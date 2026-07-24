import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js";
import { ArrowLeft, Eye, Moon, Sun, Sparkles, Trash2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { correctOCRText } from "@/lib/ocr-correction";
import CameraView from "@/components/CameraView";
import TextResultPanel from "@/components/TextResultPanel";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

interface CorrectionInfo {
  original: string;
  suggested: string;
  similarity: number;
  wasChanged: boolean;
}

interface ScanResult {
  id: number;
  text: string;
  correctedText: string;
  corrections: CorrectionInfo[];
  timestamp: Date;
}

const Scan = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useAccessibility();
  const { t, lang } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker("eng+ind", 1);
      await worker.setParameters({
        tessedit_pageseg_mode: "6" as any,
        preserve_interword_spaces: "1" as any,
      });
      const { data } = await worker.recognize(imageData);
      await worker.terminate();

      const text = data.text.trim();
      if (!text || text.length < 3) {
        setIsProcessing(false);
        return;
      }

      if (data.confidence < 30) {
        setIsProcessing(false);
        return;
      }

      const correctionResult = correctOCRText(text);

      if (!correctionResult.corrected || correctionResult.corrected.trim().length < 2) {
        setIsProcessing(false);
        return;
      }

      const newResult: ScanResult = {
        id: Date.now(),
        text,
        correctedText: correctionResult.corrected,
        corrections: correctionResult.corrections,
        timestamp: new Date(),
      };
      setScanResults((prev) => {
        if (prev.length > 0 && prev[0].correctedText === correctionResult.corrected) return prev;
        return [newResult, ...prev].slice(0, 20);
      });
      setSelectedResult((prev) => prev ?? newResult);
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResults = () => {
    setScanResults([]);
    setSelectedResult(null);
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/home")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-sm font-bold text-foreground">{t("scan.title")}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary">{t("scan.active")}</span>
            </div>
            <LanguageToggle />
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 relative z-10">
        <div className="animate-scale-in">
          <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
        </div>

        {selectedResult && (
          <div className="space-y-3 animate-fade-in-up">
            <TextResultPanel detectedText={selectedResult.correctedText} accessibilitySettings={settings} />

            {selectedResult.corrections.length > 0 && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t("scan.corrections")} ({selectedResult.corrections.length} {t("scan.words")})
                </h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedResult.corrections.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-colors ${
                      c.wasChanged
                        ? "bg-primary/8 text-primary border border-primary/10"
                        : "bg-destructive/8 text-destructive border border-destructive/10"
                    }`}>
                      {c.wasChanged ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="line-through opacity-50">{c.original}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold">{c.suggested}</span>
                      <span className="ml-auto text-[10px] opacity-50 tabular-nums">{c.similarity.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {scanResults.length > 0 && (
          <div className="space-y-2.5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {t("scan.history")} ({scanResults.length})
              </h2>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground gap-1.5 hover:text-destructive" onClick={clearResults}>
                <Trash2 className="w-3 h-3" /> {t("scan.clear")}
              </Button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {scanResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 text-sm ${
                    settings.useDyslexicFont ? "font-dyslexic" : ""
                  } ${
                    selectedResult?.id === result.id
                      ? "bg-primary/8 border-primary/25 text-foreground shadow-card"
                      : "bg-card border-border/40 text-muted-foreground hover:bg-accent/40 hover:border-border"
                  }`}
                >
                  <p className="line-clamp-2 leading-relaxed">{result.correctedText}</p>
                  <span className="text-[10px] text-muted-foreground/50 mt-1.5 block tabular-nums">
                    {result.timestamp.toLocaleTimeString(lang === "id" ? "id-ID" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </PageTransition>
  );
};

export default Scan;