import { useNavigate } from "react-router-dom";
import { Sun, Moon, ChevronRight, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImg from "@/assets/logo.png";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

const Welcome = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

        {/* Language toggle top right */}
        <div className="absolute top-4 right-4 z-20 animate-fade-in-up">
          <div className="bg-glass rounded-full border border-border/30 shadow-card">
            <LanguageToggle />
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8">
          <div className="animate-fade-in-up">
            <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-deep ring-4 ring-primary/20 mx-auto">
              <img src={logoImg} alt="Dyslexia Lens" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="animate-fade-in-up space-y-3" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-[11px] font-medium text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              {t("welcome.tag")}
            </div>
            <h1 className="font-dyslexic text-4xl font-extrabold text-foreground tracking-tight">
              Dyslexia Lens
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {t("welcome.tagline")}
            </p>
          </div>

          <div className="animate-fade-in-up w-full" style={{ animationDelay: "200ms" }}>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("welcome.pickTheme")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { if (theme === "dark") toggleTheme(); }}
                className={`flex-1 flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  theme === "light"
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border/50 hover:border-primary/30 bg-card"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center shadow-card">
                  <Sun className="w-7 h-7 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-card-foreground">{t("welcome.light")}</span>
                {theme === "light" && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
              </button>
              <button
                onClick={() => { if (theme === "light") toggleTheme(); }}
                className={`flex-1 flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border/50 hover:border-primary/30 bg-card"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center shadow-card">
                  <Moon className="w-7 h-7 text-indigo-200" />
                </div>
                <span className="text-sm font-semibold text-card-foreground">{t("welcome.dark")}</span>
                {theme === "dark" && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="animate-fade-in-up w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-hero text-primary-foreground text-sm font-bold shadow-xl-custom transition-all duration-300 hover:shadow-glow active:scale-[0.97]"
            style={{ animationDelay: "300ms" }}
          >
            {t("welcome.start")}
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-[11px] text-muted-foreground/40 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
            {t("welcome.made")}
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Welcome;
