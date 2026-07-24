import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Users, Award, Code2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

import helmiImg from "@/assets/team/helmi.jpg";
import putriImg from "@/assets/team/putri.jpeg";
import naylaImg from "@/assets/team/nayla.jpeg";
import nafisaImg from "@/assets/team/nafisa.jpeg";
import rosaImg from "@/assets/team/rosa.jpeg";
import oktarinaImg from "@/assets/team/oktarina.jpeg";

const Team = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const members = [
    { name: "dr. Oktarina, M. Sc., Ph. D", role: t("team.role.researcher"), photo: oktarinaImg, roleIcon: FlaskConical, accent: "border-secondary/30 bg-secondary/5" },
    { name: "Helmi Rafif Hernanda", role: t("team.role.developer"), photo: helmiImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
    { name: "Nafisa Anggraini", role: t("team.role.developer"), photo: nafisaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
    { name: "Nayla Jihan Zaskiyah", role: t("team.role.developer"), photo: naylaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
    { name: "Puteri Elmira Nafizhah Kusumasari", role: t("team.role.developer"), photo: putriImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
    { name: "Rosa Fina Mawaddah", role: t("team.role.developer"), photo: rosaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
  ];

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
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-sm font-bold text-foreground">{t("team.title")}</h1>
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-3 shadow-glow">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{t("team.heroTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("team.heroDesc")}</p>
        </div>

        <div className="space-y-2.5 stagger-children">
          {members.map((m) => (
            <div
              key={m.name}
              className={`animate-fade-in-up flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-card hover:shadow-deep transition-all duration-300 hover:-translate-y-0.5 ${m.accent}`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-border/50 shadow-card">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-card-foreground leading-tight">{m.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <m.roleIcon className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
    </PageTransition>
  );
};

export default Team;
