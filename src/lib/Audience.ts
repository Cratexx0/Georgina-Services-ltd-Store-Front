// src/lib/audience.ts
// Shared helper so Category + Product pages speak the same "men / women / kids" language.

export type Audience = "men" | "women" | "kids" | "all";

export const detectAudience = (...values: Array<string | undefined | null>): Audience => {
  const t = values.filter(Boolean).join(" ").toLowerCase();
  if (/\b(kid|kids|child|children|boy|boys|girl|girls|baby|toddler|junior)\b/.test(t)) return "kids";
  if (/\b(women|woman|female|ladies|lady|her)\b/.test(t)) return "women";
  if (/\b(men|man|male|gents|gentlemen|him)\b/.test(t)) return "men";
  return "all";
};

export interface AudienceMeta {
  label: string;
  eyebrow: string;
  tagline: string;
  /** Tailwind gradient classes used behind hero / badges */
  gradient: string;
  badge: string;
  sizeSystem: string;
  styling: string[];
  sizeChart: { headers: string[]; rows: string[][] };
}

export const AUDIENCE_META: Record<Audience, AudienceMeta> = {
  men: {
    label: "Men",
    eyebrow: "Ankara for him",
    tagline: "Sharp kaftans, shirts and two-piece sets cut from bold wax prints.",
    gradient: "from-amber-900/90 via-orange-900/80 to-stone-900/90",
    badge: "bg-amber-100 text-amber-900",
    sizeSystem: "S – XXL",
    styling: [
      "Pair a printed shirt with plain chinos for an easy smart-casual look.",
      "Wear a full Ankara two-piece for weddings, naming ceremonies and church.",
      "Keep accessories minimal — let the print do the talking.",
    ],
    sizeChart: {
      headers: ["Size", "Chest (in)", "Waist (in)"],
      rows: [
        ["S", "36–38", "30–32"],
        ["M", "38–40", "32–34"],
        ["L", "40–42", "34–36"],
        ["XL", "42–44", "36–38"],
        ["XXL", "44–46", "38–40"],
      ],
    },
  },
  women: {
    label: "Women",
    eyebrow: "Ankara for her",
    tagline: "Gowns, wrap dresses, skirts and sets in vibrant, statement prints.",
    gradient: "from-rose-900/90 via-fuchsia-900/80 to-purple-950/90",
    badge: "bg-rose-100 text-rose-900",
    sizeSystem: "UK 8 – 18",
    styling: [
      "Pair a bold print with neutral heels and gold jewellery.",
      "Mix a printed top with a solid skirt to dress it down for the day.",
      "Tailored fits look best — check the chart and measure your bust and waist.",
    ],
    sizeChart: {
      headers: ["UK size", "Bust (in)", "Waist (in)", "Hip (in)"],
      rows: [
        ["8", "32", "26", "35"],
        ["10", "34", "28", "37"],
        ["12", "36", "30", "39"],
        ["14", "38", "32", "41"],
        ["16", "40", "34", "43"],
        ["18", "42", "36", "45"],
      ],
    },
  },
  kids: {
    label: "Kids",
    eyebrow: "Ankara for little ones",
    tagline: "Playful, comfortable matching outfits for birthdays, festivals and Sundays.",
    gradient: "from-sky-800/90 via-emerald-800/80 to-teal-900/90",
    badge: "bg-sky-100 text-sky-900",
    sizeSystem: "Age 2 – 13",
    styling: [
      "Order one size up if your child is between sizes — they grow fast.",
      "Matching family sets make great photos for celebrations.",
      "Cotton wax prints are breathable and hard-wearing for active kids.",
    ],
    sizeChart: {
      headers: ["Age", "Height (cm)", "Chest (cm)"],
      rows: [
        ["2–3 yrs", "92–98", "53–55"],
        ["4–5 yrs", "104–110", "57–59"],
        ["6–7 yrs", "116–122", "61–63"],
        ["8–9 yrs", "128–134", "66–69"],
        ["10–11 yrs", "140–146", "72–75"],
        ["12–13 yrs", "152–158", "78–81"],
      ],
    },
  },
  all: {
    label: "Ankara",
    eyebrow: "The Ankara edit",
    tagline: "Authentic African wax print fashion for the whole family.",
    gradient: "from-stone-900/90 via-neutral-800/80 to-stone-900/90",
    badge: "bg-stone-100 text-stone-900",
    sizeSystem: "Varies",
    styling: [
      "Check the size chart for the exact fit of each piece.",
      "Wax prints are bold — choose one statement piece per outfit.",
    ],
    sizeChart: {
      headers: ["Size", "Chest / Bust (in)", "Waist (in)"],
      rows: [
        ["S", "34–36", "28–30"],
        ["M", "36–38", "30–32"],
        ["L", "38–40", "32–34"],
        ["XL", "40–42", "34–36"],
      ],
    },
  },
};

export const CURRENCY = "£";
export const formatPrice = (n: number) => `${CURRENCY}${n.toFixed(2)}`;