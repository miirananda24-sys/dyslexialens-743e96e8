import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "id" | "en";

type Dict = Record<string, { id: string; en: string }>;

const dict: Dict = {
  // Welcome
  "welcome.tag": { id: "Alat Bantu Membaca", en: "Assistive Reading Tool" },
  "welcome.tagline": {
    id: "Pindai teks apapun dan ubah ke font yang ramah disleksia. Membaca jadi lebih nyaman untuk semua orang.",
    en: "Scan any text and convert it to a dyslexia-friendly font. Reading made comfortable for everyone.",
  },
  "welcome.pickTheme": { id: "Pilih Tema", en: "Choose Theme" },
  "welcome.pickLang": { id: "Pilih Bahasa", en: "Choose Language" },
  "welcome.light": { id: "Terang", en: "Light" },
  "welcome.dark": { id: "Gelap", en: "Dark" },
  "welcome.start": { id: "Mulai Sekarang", en: "Get Started" },
  "welcome.made": { id: "Dibuat dengan 💙 untuk pembaca disleksia", en: "Made with 💙 for dyslexic readers" },

  // Home
  "home.subtitle": { id: "Assistive Reading Tool", en: "Assistive Reading Tool" },
  "home.hero.badge": { id: "OCR + Font Disleksia + Koreksi AI", en: "OCR + Dyslexic Font + AI Correction" },
  "home.hero.title1": { id: "Bantu Membaca", en: "Read More" },
  "home.hero.title2": { id: "Dengan Lebih Nyaman", en: "Comfortably" },
  "home.hero.desc": {
    id: "Pindai teks apapun dan ubah ke font yang ramah disleksia. Dilengkapi terjemahan, text-to-speech, dan koreksi otomatis.",
    en: "Scan any text and convert it to a dyslexia-friendly font. With translation, text-to-speech, and auto-correction.",
  },
  "home.hero.cta": { id: "Mulai Scan Sekarang", en: "Start Scanning" },
  "home.stat.ocr": { id: "Mesin OCR", en: "OCR Engine" },
  "home.stat.font": { id: "Font Khusus", en: "Special Font" },
  "home.stat.ai": { id: "Koreksi AI", en: "AI Correction" },
  "home.action.scan.title": { id: "Mulai Scan", en: "Start Scan" },
  "home.action.scan.desc": { id: "Pindai teks dengan kamera atau upload gambar", en: "Scan text with camera or upload an image" },
  "home.action.settings.title": { id: "Aksesibilitas", en: "Accessibility" },
  "home.action.settings.desc": { id: "Atur font, ukuran, dan kenyamanan baca", en: "Adjust font, size, and reading comfort" },
  "home.about": { id: "Tentang Kami", en: "About Us" },
  "home.footer": { id: "Dibuat dengan 💙 untuk pembaca disleksia", en: "Made with 💙 for dyslexic readers" },

  // About
  "about.title": { id: "Tentang Kami", en: "About Us" },
  "about.subtitle": { id: "Pelajari lebih lanjut tentang Dyslexia Lens", en: "Learn more about Dyslexia Lens" },
  "about.team.title": { id: "Tim Pengembang", en: "Development Team" },
  "about.team.desc": { id: "Kenali orang-orang di balik Dyslexia Lens", en: "Meet the people behind Dyslexia Lens" },
  "about.credits.title": { id: "Kredit & Teknologi", en: "Credits & Technology" },
  "about.credits.desc": { id: "Open-source tools & libraries yang digunakan", en: "Open-source tools & libraries used" },
  "about.feedback.title": { id: "Feedback & Bug Report", en: "Feedback & Bug Report" },
  "about.feedback.desc": { id: "Bantu kami jadi lebih baik dengan masukan kamu", en: "Help us improve with your feedback" },

  // Team
  "team.title": { id: "Tim Pengembang", en: "Development Team" },
  "team.heroTitle": { id: "Meet the Team", en: "Meet the Team" },
  "team.heroDesc": { id: "Orang-orang hebat di balik Dyslexia Lens", en: "The amazing people behind Dyslexia Lens" },
  "team.role.researcher": { id: "Peneliti", en: "Researcher" },
  "team.role.developer": { id: "Pengembang", en: "Developer" },

  // Credits
  "credits.title": { id: "Kredit & Teknologi", en: "Credits & Technology" },
  "credits.heroTitle": { id: "Teknologi yang Digunakan", en: "Technologies Used" },
  "credits.heroDesc": { id: "Open-source tools & libraries", en: "Open-source tools & libraries" },
  "credits.by": { id: "oleh", en: "by" },

  // Feedback
  "fb.title": { id: "Feedback & Bug Report", en: "Feedback & Bug Report" },
  "fb.heroTitle": { id: "Kirim Masukan", en: "Send Feedback" },
  "fb.heroDesc": { id: "Bantu kami jadi lebih baik", en: "Help us improve" },
  "fb.feedback": { id: "Feedback", en: "Feedback" },
  "fb.bug": { id: "Bug Report", en: "Bug Report" },
  "fb.name": { id: "Nama kamu (opsional)", en: "Your name (optional)" },
  "fb.message": { id: "Tulis pesan, saran, atau laporkan bug...", en: "Write a message, suggestion, or report a bug..." },
  "fb.attach": { id: "Lampirkan screenshot (maks 3)", en: "Attach screenshot (max 3)" },
  "fb.send": { id: "Kirim Feedback", en: "Send Feedback" },
  "fb.sending": { id: "Mengirim...", en: "Sending..." },
  "fb.sent": { id: "Terkirim! Feedback kamu sudah masuk", en: "Sent! Your feedback has been received" },

  // Settings
  "set.title": { id: "Aksesibilitas", en: "Accessibility" },
  "set.display": { id: "Tampilan", en: "Display" },
  "set.darkMode": { id: "Mode Gelap", en: "Dark Mode" },
  "set.darkModeDesc": { id: "Nyaman di mata saat gelap", en: "Easier on the eyes in the dark" },
  "set.fontType": { id: "Jenis Font", en: "Font Type" },
  "set.recommended": { id: "Disarankan", en: "Recommended" },
  "set.font.opendys": { id: "Disarankan untuk disleksia", en: "Recommended for dyslexia" },
  "set.font.inter": { id: "Bersih & modern", en: "Clean & modern" },
  "set.font.comic": { id: "Familiar & mudah dibaca", en: "Familiar & easy to read" },
  "set.font.georgia": { id: "Serif klasik, nyaman", en: "Classic serif, comfortable" },
  "set.font.verdana": { id: "Huruf lebar & jelas", en: "Wide & clear letters" },
  "set.sizing": { id: "Ukuran & Jarak", en: "Size & Spacing" },
  "set.fontSize": { id: "Ukuran Font", en: "Font Size" },
  "set.letter": { id: "Jarak Huruf", en: "Letter Spacing" },
  "set.line": { id: "Jarak Baris", en: "Line Spacing" },
  "set.preview": { id: "Preview", en: "Preview" },
  "set.previewText": {
    id: "Dyslexia Lens membantu kamu membaca teks dengan lebih nyaman menggunakan font khusus disleksia.",
    en: "Dyslexia Lens helps you read text more comfortably with a special dyslexia-friendly font.",
  },

  // Scan
  "scan.title": { id: "Scan Langsung", en: "Live Scan" },
  "scan.active": { id: "OCR Aktif", en: "OCR Active" },
  "scan.detected": { id: "Teks Terdeteksi", en: "Detected Text" },
  "scan.translated": { id: "Hasil Terjemahan", en: "Translation" },
  "scan.translate": { id: "Terjemahkan", en: "Translate" },
  "scan.copied": { id: "Teks disalin!", en: "Text copied!" },
  "scan.translateFail": { id: "Terjemahan gagal", en: "Translation failed" },
  "scan.translateErr": { id: "Error saat menerjemahkan", en: "Translation error" },
  "scan.corrections": { id: "Koreksi OCR", en: "OCR Corrections" },
  "scan.words": { id: "kata", en: "words" },
  "scan.history": { id: "Riwayat", en: "History" },
  "scan.clear": { id: "Hapus", en: "Clear" },

  // Camera
  "cam.processing": { id: "Memproses...", en: "Processing..." },
  "cam.aim": { id: "Arahkan ke paragraf", en: "Aim at a paragraph" },
  "cam.reading": { id: "Membaca teks...", en: "Reading text..." },
  "cam.capture": { id: "Capture Paragraf", en: "Capture Paragraph" },
};

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LanguageCtx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "id");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => dict[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
};

export const useLanguage = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLanguage must be inside LanguageProvider");
  return c;
};
