import { useLanguage, Lang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

const FlagID = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
    <rect width="24" height="8" fill="#e70011" />
    <rect y="8" width="24" height="8" fill="#fff" />
  </svg>
);

const FlagEN = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const LangFlag = ({ lang, className }: { lang: Lang; className?: string }) =>
  lang === "id" ? <FlagID className={className} /> : <FlagEN className={className} />;

const LanguageToggle = ({ compact = true }: { compact?: boolean }) => {
  const { lang, setLang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={`${compact ? "h-9 w-9" : "h-10 w-10"} rounded-full overflow-hidden hover:bg-accent transition-all`}
          aria-label="Change language"
        >
          <span className="w-6 h-4 rounded-sm overflow-hidden ring-1 ring-border/50 shadow-sm block">
            <LangFlag lang={lang} className="w-full h-full block" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] animate-scale-in">
        {(["id", "en"] as Lang[]).map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLang(l)} className="gap-2.5 cursor-pointer">
            <span className="w-5 h-3.5 rounded-sm overflow-hidden ring-1 ring-border/50 block">
              <LangFlag lang={l} className="w-full h-full block" />
            </span>
            <span className="flex-1 text-sm font-medium">
              {l === "id" ? "Bahasa Indonesia" : "English"}
            </span>
            {lang === l && <Check className="w-3.5 h-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LangFlag };
export default LanguageToggle;
