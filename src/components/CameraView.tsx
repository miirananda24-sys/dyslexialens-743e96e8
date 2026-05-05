import { useRef, useState, useCallback, useEffect } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Upload, ScanLine, Move, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
  autoScanInterval?: number;
}

const CameraView = ({ onCapture, isProcessing }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [zoom, setZoom] = useState(1);
  const streamRef = useRef<MediaStream | null>(null);
  // intervalRef removed — manual capture only
  const [scanCount, setScanCount] = useState(0);

  // Scan box state (percentage-based)
  const [scanBox, setScanBox] = useState({ x: 5, y: 10, w: 90, h: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, bx: 0, by: 0 });

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [startCamera]);

  const processImage = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Adaptive thresholding with better contrast for OCR
    // Step 1: Convert to grayscale with enhanced contrast
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Increase contrast with sigmoid-like curve
      const contrast = 1.8;
      const adjusted = Math.min(255, Math.max(0, ((gray / 255 - 0.5) * contrast + 0.5) * 255));
      data[i] = adjusted; data[i + 1] = adjusted; data[i + 2] = adjusted;
    }

    // Step 2: Apply Otsu's threshold for optimal binarization
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) histogram[data[i]]++;
    const totalPixels = data.length / 4;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];
    let sumB = 0, wB = 0, maxVariance = 0, threshold = 128;
    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;
      const wF = totalPixels - wB;
      if (wF === 0) break;
      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const variance = wB * wF * (mB - mF) * (mB - mF);
      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }

    // Step 3: Apply threshold
    for (let i = 0; i < data.length; i += 4) {
      const val = data[i] > threshold ? 255 : 0;
      data[i] = val; data[i + 1] = val; data[i + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png", 1.0);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Crop to scan box area
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const sx = (scanBox.x / 100) * vw;
    const sy = (scanBox.y / 100) * vh;
    const sw = (scanBox.w / 100) * vw;
    const sh = (scanBox.h / 100) * vh;

    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    const result = processImage(canvas);
    if (result) {
      setScanCount((c) => c + 1);
      onCapture(result);
    }
  }, [scanBox, onCapture, isProcessing, processImage]);

  // Manual capture only — no auto-scan to keep history clean

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const result = processImage(canvas);
        if (result) { setScanCount((c) => c + 1); onCapture(result); }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleCamera = () => setFacingMode((p) => (p === "user" ? "environment" : "user"));

  // Drag scan box
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    if (px >= scanBox.x && px <= scanBox.x + scanBox.w && py >= scanBox.y && py <= scanBox.y + scanBox.h) {
      setIsDragging(true);
      dragStart.current = { mx: px, my: py, bx: scanBox.x, by: scanBox.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = px - dragStart.current.mx;
    const dy = py - dragStart.current.my;
    const nx = Math.max(0, Math.min(100 - scanBox.w, dragStart.current.bx + dx));
    const ny = Math.max(0, Math.min(100 - scanBox.h, dragStart.current.by + dy));
    setScanBox((b) => ({ ...b, x: nx, y: ny }));
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-foreground/5 border border-border/50 shadow-card touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <video
          ref={videoRef}
          className="w-full aspect-[3/4] sm:aspect-[4/3] object-cover"
          playsInline
          muted
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />

        {isStreaming && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark overlay outside scan box */}
            <div className="absolute inset-0 bg-foreground/40" style={{
              clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${scanBox.y}%, ${scanBox.x}% ${scanBox.y}%, ${scanBox.x}% ${scanBox.y + scanBox.h}%, ${scanBox.x + scanBox.w}% ${scanBox.y + scanBox.h}%, ${scanBox.x + scanBox.w}% ${scanBox.y}%, 0% ${scanBox.y}%)`
            }} />

            {/* Scan box border */}
            <div
              className="absolute border-2 border-primary rounded-lg"
              style={{
                left: `${scanBox.x}%`, top: `${scanBox.y}%`,
                width: `${scanBox.w}%`, height: `${scanBox.h}%`,
              }}
            >
              {/* Corner markers */}
              <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-[3px] border-l-[3px] border-primary rounded-tl-md" />
              <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-[3px] border-r-[3px] border-primary rounded-tr-md" />
              <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-[3px] border-l-[3px] border-primary rounded-bl-md" />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-[3px] border-r-[3px] border-primary rounded-br-md" />

              {/* Scan line */}
              <div className="absolute left-2 right-2 h-0.5 bg-primary/60 animate-scan rounded-full" style={{ boxShadow: '0 0 12px 2px hsl(174 62% 40% / 0.4)' }} />

              {/* Drag hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Move className="w-5 h-5 text-primary-foreground/40" />
              </div>
            </div>

            {/* Status pill */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium text-foreground">
                {isProcessing ? "Memproses..." : "Arahkan ke paragraf"}
              </span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-background/20 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card/95 px-5 py-3 rounded-xl shadow-deep flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="font-dyslexic text-xs text-card-foreground font-medium">Membaca teks...</span>
            </div>
          </div>
        )}
      </div>

      {/* Big Capture Button */}
      <div className="mt-3 flex items-center justify-center">
        <Button
          onClick={capture}
          disabled={isProcessing || !isStreaming}
          className="h-14 px-8 rounded-full bg-gradient-primary text-primary-foreground shadow-glow font-dyslexic font-semibold text-sm gap-2 hover:shadow-deep active:scale-95 transition-all"
        >
          <Camera className="w-5 h-5" />
          {isProcessing ? "Memproses..." : "Capture Paragraf"}
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-card rounded-full px-2 py-1 shadow-sm border border-border/50">
          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setZoom((z) => Math.max(1, z - 0.5))}>
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-[10px] font-dyslexic text-muted-foreground min-w-[3ch] text-center">{zoom.toFixed(1)}x</span>
          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setZoom((z) => Math.min(4, z + 0.5))}>
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/60 border border-border/50">
          <ScanLine className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-medium text-accent-foreground">{scanCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={toggleCamera}>
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
