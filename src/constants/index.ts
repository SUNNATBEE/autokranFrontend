export interface Crane {
  id: number;
  model: string;
  brand: string;
  tonnage: number;
  mainBoom: number;
  auxBoom: number;
  image: string;
  pricePerMonth: number;
  description: string;
  specs: {
    enginePower?: string;
    maxSpeed?: string;
    operatingWeight?: string;
    maxLiftHeight?: string;
    mainBoomLength?: string;
    maxLoadCapacity?: string;
    width?: string;
    length?: string;
    weight?: string;
    engine?: string;
  };
  available: boolean;
}

export const craneData: Crane[] = [
  // 30t XCMG - 4 units
 
  {
    id: 101,
    model: "XCMG-30K5-I",
    brand: "XCMG",
    tonnage: 30,
    mainBoom: 40.4,
    auxBoom: 48.7,
    image: "/images/XCMG-30K5-I.jpeg",
    pricePerMonth: 60000000,
    description: "Yuk ko'tarish quvvati 30 tonnagacha. Ishonchli va tezkor texnika.",
    specs: {
      enginePower: "213 kVt",
      maxSpeed: "85 km/soat",
      operatingWeight: "30 000 kg",
      maxLiftHeight: "48.7 m",
      mainBoomLength: "40.4 m",
      maxLoadCapacity: "30 t"
    },
    available: true
  },
  {
    id: 102,
    model: "XCMG-30K5-I",
    brand: "XCMG",
    tonnage: 30,
    mainBoom: 40.4,
    auxBoom: 48.7,
    image: "/images/XCMG-30K5-I.jpeg",
    pricePerMonth: 60000000,
    description: "Yuk ko'tarish quvvati 30 tonnagacha. Qurilish maydonlari uchun qulay.",
    specs: {
      enginePower: "213 kVt",
      maxSpeed: "85 km/soat",
      operatingWeight: "30 000 kg",
      maxLiftHeight: "48.7 m",
      mainBoomLength: "40.4 m",
      maxLoadCapacity: "30 t"
    },
    available: true
  },
  {
    id: 103,
    model: "XCMG-30K5-I",
    brand: "XCMG",
    tonnage: 30,
    mainBoom: 40.4,
    auxBoom: 48.7,
    image: "/images/XCMG-30K5-I.jpeg",
    pricePerMonth: 60000000,
    description: "Yuk ko'tarish quvvati 30 tonnagacha. Yuqori aniqlikdagi boshqaruv.",
    specs: {
      enginePower: "213 kVt",
      maxSpeed: "85 km/soat",
      operatingWeight: "30 000 kg",
      maxLiftHeight: "48.7 m",
      mainBoomLength: "40.4 m",
      maxLoadCapacity: "30 t"
    },
    available: true
  },

  // 50t XCMG - 2 units
  {
    id: 2,
    model: "XCMG-QY50KA",
    brand: "XCMG",
    tonnage: 50,
    mainBoom: 43.5,
    auxBoom: 57.7,
    image: "/images/XCMG-QY50KA.jpg",
    pricePerMonth: 75000000,
    description: "Yuk ko'tarish quvvati 50 tonnagacha. Asosiy ko'tarish balandligi 43,5 m. Maksimal ko'tarish balandligi 57,7 m.",
    specs: {
      enginePower: "247 kVt",
      maxSpeed: "80 km/soat",
      operatingWeight: "42 000 kg",
      maxLiftHeight: "57.7 m",
      mainBoomLength: "43.5 m",
      maxLoadCapacity: "50 t"
    },
    available: true
  },
  {
    id: 201,
    model: "XCMG-QY50KA",
    brand: "XCMG",
    tonnage: 50,
    mainBoom: 43.5,
    auxBoom: 57.7,
    image: "/images/XCMG-QY50KA.jpg",
    pricePerMonth: 75000000,
    description: "Yuk ko'tarish quvvati 50 tonnagacha. Har qanday murakkablikdagi ishlar uchun.",
    specs: {
      enginePower: "247 kVt",
      maxSpeed: "80 km/soat",
      operatingWeight: "42 000 kg",
      maxLiftHeight: "57.7 m",
      mainBoomLength: "43.5 m",
      maxLoadCapacity: "50 t"
    },
    available: true
  },

  {
    id: 3,
    model: "SANY STC500",
    brand: "SANY",
    tonnage: 50,
    mainBoom: 43.5,
    auxBoom: 57.7,
    image: "/images/sany-stc500.jpg",
    pricePerMonth: 75000000,
    description: "Yuk ko'tarish quvvati 50 tonnagacha. Yuqori sifatli va ishonchli SANY texnikasi.",
    specs: {
      enginePower: "247 kVt",
      maxSpeed: "80 km/soat",
      operatingWeight: "42 000 kg",
      maxLiftHeight: "57.7 m",
      mainBoomLength: "43.5 m",
      maxLoadCapacity: "50 t"
    },
    available: true
  },
  {
    id: 4,
    model: "ZOOMLION-QY80",
    brand: "ZOOMLION",
    tonnage: 80,
    mainBoom: 44.5,
    auxBoom: 64.5,
    image: "/images/zoomlion_80t_new.jpg",
    pricePerMonth: 90000000,
    description: "Yuk ko'tarish quvvati 80 tonnagacha. Asosiy ko'tarish balandligi 44,5 m. Maksimal ko'tarish balandligi 64,5 m.",
    specs: {
      enginePower: "310 kVt",
      maxSpeed: "75 km/soat",
      operatingWeight: "55 000 kg",
      maxLiftHeight: "64.5 m",
      mainBoomLength: "44.5 m",
      maxLoadCapacity: "80 t"
    },
    available: true
  },
  {
    id: 5,
    model: "ZOOMLION-ZTC130",
    brand: "ZOOMLION",
    tonnage: 130,
    mainBoom: 70,
    auxBoom: 97.8,
    image: "/images/ZOOMLION-ZTC130.avif",
    pricePerMonth: 150000000,
    description: "Yuk ko'tarish quvvati 130 tonnagacha. Asosiy ko'tarish balandligi 70 m. Maksimal ko'tarish balandligi 97,8 m.",
    specs: {
      enginePower: "380 kVt",
      maxSpeed: "70 km/soat",
      operatingWeight: "72 000 kg",
      maxLiftHeight: "97.8 m",
      mainBoomLength: "70 m",
      maxLoadCapacity: "130 t"
    },
    available: true
  }

];

export const companyInfo = {
  name: "OOO «SERVIS ANIQ QURUVCHI»",
  shortName: "AUTOKRAN.UZ",
  founded: 2011,
  phone: "+998 95 380 24 42",
  phoneRaw: "953802442",
  // WhatsApp number in international format (no +, no spaces) for wa.me links.
  whatsapp: "998953802442",
  address: "Uchtepa tumani, Toshkent shahri",
  telegram: "https://t.me/autokran_uz",
  instagram: "https://instagram.com/autokran.uz",
  workHours: "24/7 Xizmatda",
  description: "O'zbekiston bo'ylab professional avtokran xizmatlari. 30 dan 130 tonnagacha bo'lgan zamonaviy avtokranlar bilan istalgan murakkablikdagi vazifalarni bajaramiz.",
};

/**
 * Completed-project showcase. Images currently reuse equipment photos as
 * tasteful backgrounds — REPLACE `image` with real on-site project photos
 * (place them in `public/images/`) for maximum credibility.
 */
export const projectShowcase = [
  { name: "GTL zavodi", image: "/images/ZOOMLION-ZTC130.avif" },
  { name: "Tashkent City", image: "/images/XCMG-QY50KA.jpg" },
  { name: "Seul Moon", image: "/images/zoomlion_80t_new.jpg" },
  { name: "Mega Planet", image: "/images/sany-stc500.jpg" },
  { name: "Nestone", image: "/images/XCMG-30K5-I.jpeg" },
  { name: "Dvores Forum", image: "/images/hero-bg.avif" },
];

/** Canonical, env-overridable production URL (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.autokran.uz"
).replace(/\/$/, "").replace(/\/(uz|ru|en)$/i, "");

/**
 * Search-engine ownership-verification tokens.
 * Paste the codes Google Search Console / Yandex Webmaster / Bing give you into
 * these env vars on Vercel (Production) and redeploy. Leaving one empty simply
 * omits its <meta> tag — no error.
 */
export const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
  bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
};

export const siteConfig = {
  url: SITE_URL,
  // Use a JPG/PNG (1200×630) for OG — social/search crawlers (Telegram,
  // Facebook, Google) don't reliably render AVIF preview images.
  ogImage: `${SITE_URL}/images/og-cover.jpg`,
  locales: ["uz", "ru", "en"] as const,
  defaultLocale: "uz" as const,
  // Approximate coordinates for Tashkent (used in LocalBusiness schema).
  geo: { latitude: 41.2995, longitude: 69.2401 },
  addressLocality: "Toshkent",
  addressCountry: "UZ",
  priceRange: "$$",
};

export const partners = [
  "Discover Invest",
  "Neft Gaz Montaj"
];

export const projects = [
  "GTL zavodi",
  "Seul Moon",
  "Nestone",
  "Tashkent City",
  "Mega Planet",
  "Dvores Forum",
  
];

