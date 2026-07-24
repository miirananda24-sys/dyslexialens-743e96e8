import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Award, Mail, Moon, Sun, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImg from "@/assets/logo.png";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

const About = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const cards = [
    { icon: Users, title: t("about.team.title"), desc: t("about.team.desc"), path: "/team", gradient: "bg-gradient-primary", iconColor: "text-primary-foreground" },
    { icon: Award, title: t("about.credits.title"), desc: t("about.credits.desc"), path: "/credits", gradient: "bg-gradient-secondary", iconColor: "text-secondary-foreground" },
    { icon: Mail, title: t("about.feedback.title"), desc: t("about.feedback.desc"), path: "/feedback", gradient: "bg-gradient-to-br from-amber-500 to-orange-500", iconColor: "text-white" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

        <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/home")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded-xl overflow-hidden">
                <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-sm font-bold text-foreground">{t("about.title")}</h1>
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4 relative z-10">
          <div className="text-center animate-fade-in-up mb-2">
            <h2 className="text-xl font-bold text-foreground mb-1">{t("about.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("about.subtitle")}</p>
          </div>

          <div className="space-y-3 stagger-children">
            {cards.map((c) => (
              <button
                key={c.path}
                onClick={() => navigate(c.path)}
                className="group w-full animate-fade-in-up flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-card text-left transition-all duration-300 hover:shadow-deep hover:-translate-y-1 active:scale-[0.98]"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${c.gradient} shadow-card transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <c.icon className={`w-7 h-7 ${c.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-card-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0 transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default About;
