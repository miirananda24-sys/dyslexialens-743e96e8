import { useState } from "react";
import { Volume2, VolumeX, Languages, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AccessibilitySettings {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  useDyslexicFont: boolean;
}

interface TextResultPanelProps {
  detectedText: string;
  accessibilitySettings?: AccessibilitySettings;
}

const LANGUAGES = [
  { code: "id", name: "Indonesia" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "tr", name: "Türkçe" },
  { code: "pl", name: "Polski" },
  { code: "sv", name: "Svenska" },
  { code: "ms", name: "Melayu" },
];

const TextResultPanel = ({ detectedText, accessibilitySettings }: TextResultPanelProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const s = accessibilitySettings ?? { fontSize: 18, letterSpacing: 2, lineHeight: 1.8, useDyslexicFont: true };

  const speak = (text: string, lang?: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || targetLang;
    utterance.rate = 0.7;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const translate = async () => {
    if (!detectedText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(detectedText)}&langpair=auto|${targetLang}`
      );
      const data = await res.json();
      if (data.responseData?.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        toast.error("Terjemahan gagal");
      }
    } catch {
      toast.error("Error saat menerjemahkan");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(translatedText || detectedText);
    setCopied(true);
    toast.success("Teks disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const textStyle = {
    fontSize: `${s.fontSize}px`,
    letterSpacing: `${s.letterSpacing}px`,
    lineHeight: s.lineHeight,
  };

  const fontClass = s.useDyslexicFont ? "font-dyslexic" : "";

  return (
    <div className="w-full space-y-3">
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teks Terdeteksi</h3>
          <div className="flex gap-0.5">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => speak(detectedText, "auto")}>
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyText}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
        <p className={`${fontClass} text-card-foreground whitespace-pre-wrap`} style={textStyle}>
          {detectedText}
        </p>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary shrink-0" />
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="flex-1 h-9 text-sm rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={translate} disabled={isTranslating} className="bg-gradient-primary text-primary-foreground h-9 px-4 rounded-xl">
            {isTranslating ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : "Terjemahkan"}
          </Button>
        </div>

        {translatedText && (
          <div className="bg-accent/40 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Hasil Terjemahan</span>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => speak(translatedText, targetLang)}>
                <Volume2 className="w-3 h-3" />
              </Button>
            </div>
            <p className={`${fontClass} text-accent-foreground whitespace-pre-wrap`} style={textStyle}>
              {translatedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextResultPanel;
