import { useNavigate } from "react-router-dom";
import {
  ScanLine, Settings, ChevronRight, Sparkles, Zap, Eye, BookOpen, Moon, Sun
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const stats = [
    { icon: Eye, label: t("home.stat.ocr"), value: "Tesseract" },
    { icon: BookOpen, label: t("home.stat.font"), value: "OpenDyslexic" },
    { icon: Zap, label: t("home.stat.ai"), value: "Levenshtein" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col items-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

        <header className="sticky top-0 z-50 bg-glass border-b border-border/30 w-full">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-deep ring-2 ring-primary/20">
                <img src={logoImg} alt="Dyslexia Lens" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-dyslexic text-base font-bold text-foreground leading-tight">Dyslexia Lens</h1>
                <p className="text-[10px] text-muted-foreground tracking-wide">{t("home.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-accent" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-5 relative z-10 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-4 sm:p-6 pb-5 sm:pb-8 text-primary-foreground shadow-xl-custom animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
            <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-white/5 blur-lg animate-float" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] sm:text-[11px] font-medium mb-3 sm:mb-4 border border-white/10">
                <Sparkles className="w-3 h-3" />
                {t("home.hero.badge")}
              </div>
              <h2 className="font-dyslexic text-xl sm:text-3xl font-extrabold leading-tight mb-2 sm:mb-3 tracking-tight">
                {t("home.hero.title1")}<br /><span className="opacity-90">{t("home.hero.title2")}</span>
              </h2>
              <p className="text-xs sm:text-sm opacity-75 leading-relaxed max-w-sm mb-4 sm:mb-5">
                {t("home.hero.desc")}
              </p>
              <button
                onClick={() => navigate("/scan")}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs sm:text-sm font-semibold transition-all duration-300 border border-white/20 hover:shadow-glow active:scale-95"
              >
                <ScanLine className="w-4 h-4" />
                {t("home.hero.cta")}
                <ChevronRight className="w-4 h-4 -mr-1" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/50 shadow-card">
                <s.icon className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-semibold text-foreground">{s.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 stagger-children">
            {[
              { icon: ScanLine, title: t("home.action.scan.title"), desc: t("home.action.scan.desc"), path: "/scan", iconBg: "bg-gradient-primary text-primary-foreground" },
              { icon: Settings, title: t("home.action.settings.title"), desc: t("home.action.settings.desc"), path: "/settings", iconBg: "bg-secondary/15 text-secondary" },
            ].map((f) => (
              <button
                key={f.path}
                onClick={() => navigate(f.path)}
                className="group w-full animate-fade-in-up flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-card text-left transition-all duration-300 hover:shadow-deep hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.iconBg} transition-transform group-hover:scale-110`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-card-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </main>

        <footer className="relative z-10 border-t border-border/30 w-full">
          <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col items-center gap-3">
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-card border border-border/50 shadow-card text-sm font-semibold text-card-foreground hover:shadow-deep hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
            >
              {t("home.about")}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <p className="text-[11px] text-muted-foreground/50">
              {t("home.footer")}
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Home;
