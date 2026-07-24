import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, ExternalLink, Code2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";

const credits = [
  {
    name: "Levenshtein Distance",
    desc: "Algoritma untuk mengukur kemiripan kata dan koreksi OCR otomatis",
    author: "Vladimir Levenshtein",
    url: "https://en.wikipedia.org/wiki/Levenshtein_distance",
    color: "bg-secondary/15 text-secondary",
  },
  {
    name: "Tesseract.js",
    desc: "OCR engine untuk deteksi teks dari gambar",
    author: "naptha / Tesseract OCR",
    url: "https://github.com/naptha/tesseract.js",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "OpenDyslexic",
    desc: "Font open-source yang dirancang untuk pembaca disleksia",
    author: "Abbie Gonzalez",
    url: "https://opendyslexic.org",
    color: "bg-secondary/15 text-secondary",
  },
  {
    name: "MyMemory API",
    desc: "API terjemahan gratis untuk berbagai bahasa",
    author: "Translated.net",
    url: "https://mymemory.translated.net",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Web Speech API",
    desc: "API browser native untuk text-to-speech",
    author: "W3C / Browser vendors",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API",
    color: "bg-secondary/15 text-secondary",
  },
  {
    name: "React",
    desc: "Library JavaScript untuk membangun antarmuka pengguna",
    author: "Meta (Facebook)",
    url: "https://react.dev",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Tailwind CSS",
    desc: "Framework CSS utility-first untuk desain modern",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com",
    color: "bg-secondary/15 text-secondary",
  },
  {
    name: "shadcn/ui",
    desc: "Komponen UI berkualitas tinggi berbasis Radix",
    author: "shadcn",
    url: "https://ui.shadcn.com",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Lucide Icons",
    desc: "Library ikon open-source yang bersih dan konsisten",
    author: "Lucide Contributors",
    url: "https://lucide.dev",
    color: "bg-secondary/15 text-secondary",
  },
  {
    name: "Vite",
    desc: "Build tool cepat untuk development modern",
    author: "Evan You / Vite Team",
    url: "https://vitejs.dev",
    color: "bg-primary/10 text-primary",
  },
];

const Credits = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

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
            <div className="w-8 h-8 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-secondary-foreground" />
            </div>
            <h1 className="text-sm font-bold text-foreground">{t("credits.title")}</h1>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 relative z-10">
        <div className="text-center mb-5 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-secondary mx-auto flex items-center justify-center mb-3 shadow-glow-purple">
            <BookOpen className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{t("credits.heroTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("credits.heroDesc")}</p>
        </div>

        <div className="space-y-2 stagger-children">
          {credits.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-fade-in-up flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-deep transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${c.color}`}>
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-card-foreground">{c.name}</h3>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.desc}</p>
                <p className="text-[11px] text-primary font-medium mt-1">{t("credits.by")} {c.author}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
    </PageTransition>
  );
};

export default Credits;