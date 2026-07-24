import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Mail, Send, CheckCircle, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

const FEEDBACK_EMAIL = "miirananda24@gmail.com";

const Feedback = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "feedback">("feedback");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
    setImagePreviews(newImages.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setImagePreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("_subject", feedbackType === "bug"
        ? `[Bug Report] Dyslexia Lens - dari ${name || "Anonim"}`
        : `[Feedback] Dyslexia Lens - dari ${name || "Anonim"}`);
      formData.append("Nama", name || "Anonim");
      formData.append("Tipe", feedbackType === "bug" ? "Bug Report" : "Feedback");
      formData.append("Pesan", message);
      images.forEach((img, i) => formData.append(`attachment${i + 1}`, img));

      const res = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setName("");
          setMessage("");
          setImages([]);
          setImagePreviews([]);
        }, 3000);
      }
    } catch (e) {
      console.error("Failed to send feedback:", e);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

        <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/about")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm font-bold text-foreground">{t("fb.title")}</h1>
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5 relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto flex items-center justify-center mb-3 shadow-glow">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{t("fb.heroTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("fb.heroDesc")}</p>
          </div>

          <div className="animate-fade-in-up rounded-2xl bg-card border border-border/50 shadow-card p-5 space-y-4" style={{ animationDelay: "100ms" }}>
            <div className="flex gap-2">
              <button onClick={() => setFeedbackType("feedback")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${feedbackType === "feedback" ? "bg-primary text-primary-foreground shadow-card" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                💬 {t("fb.feedback")}
              </button>
              <button onClick={() => setFeedbackType("bug")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${feedbackType === "bug" ? "bg-destructive text-destructive-foreground shadow-card" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                🐛 {t("fb.bug")}
              </button>
            </div>

            <input type="text" placeholder={t("fb.name")} value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />

            <textarea placeholder={t("fb.message")} value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />

            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/50 group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X className="w-4 h-4 text-background" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 3 && (
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1">
                  <ImagePlus className="w-4 h-4" />
                  {t("fb.attach")}
                </button>
              )}
            </div>

            <button onClick={handleSend} disabled={!message.trim() || sent || sending}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] ${sent ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground hover:opacity-90 shadow-card disabled:opacity-50 disabled:cursor-not-allowed"}`}>
              {sent ? (<><CheckCircle className="w-4 h-4" />{t("fb.sent")}</>) : sending ? (<><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{t("fb.sending")}</>) : (<><Send className="w-4 h-4" />{t("fb.send")}</>)}
            </button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Feedback;
