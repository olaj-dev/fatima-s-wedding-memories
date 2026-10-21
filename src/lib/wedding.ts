// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT — items still awaiting real details are marked TODO.
// ---------------------------------------------------------------------------

export const wedding = {
  bride: "Fatima",
  brideFull: "Fatima Ahmad",
  groom: "Masoud",
  groomFull: "Masoud Tijjani",
  // TODO: hashtag not concluded yet
  // Nikkah day
  date: "2026-11-07T10:00:00+01:00",
  dateLabel: "Saturday, 7th November 2026",
  timeLabel: "10:00 AM prompt · reception follows immediately",
  venue: "Digital Bridge Institute (Nitel)",
  // TODO: confirm full address / hall name
  address: "Kano, Nigeria",
  mapUrl: "https://maps.google.com/?q=Digital+Bridge+Institute+Kano",
  dressCode: "Emerald green and Champagne Gold",
  story:
    "Two families, one prayer answered. What began with a quiet introduction between loved ones has grown into a union built on faith, patience and mercy. We invite you to stand with us as Fatima and Masoud begin this beautiful journey.",
} as const;

export const ayah = {
  arabic:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  translation:
    "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
  reference: "Surah Ar-Rum 30:21",
} as const;

export const programme = [
  { time: "8:30 AM", title: "Guests arrive & seating", note: "Light refreshments served" },
  { time: "10:00 AM", title: "Nikkah ceremony", note: "Solemnisation & exchange of vows" },
  { time: "Immediately after", title: "Reception", note: "Lunch, music & toasts" },
  { time: "12:00 PM", title: "Family photographs", note: "Both families & friends" },
  { time: "2:00 PM", title: "Send-forth", note: "Departure of the couple" },
];

export const contacts = [
  { name: "Bride", phone: "07060636825" },
  { name: "Groom", phone: "07032455376" },
];

const NG_DIAL_CODE = "234";

/** Local number → international digits, e.g. 07060636825 → 2347060636825. */
export function dialDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? NG_DIAL_CODE + digits.slice(1) : digits;
}

export function telHref(phone: string) {
  return `tel:+${dialDigits(phone)}`;
}

export function whatsappHref(phone: string) {
  return `https://wa.me/${dialDigits(phone)}`;
}

export const gifts = {
  intro:
    "Your presence and prayers mean the world to us. Should you wish to honour us with something more, a contribution towards our new life together would be received with heartfelt gratitude.",
  bank: {
    bank: "OPay",
    accountName: "Fatima Ahmed",
    accountNumber: "9020314747",
    hint: "Kindly use your name as the narration.",
  },
};

export const rsvp = {
  intro: "We would be honoured to have you with us on our special day.",
  successAccepted: "We can't wait to celebrate with you, in shaa Allah.",
  successDeclined: "You'll be dearly missed — thank you for letting us know.",
} as const;

/** SHA-256 hex digest — works in the browser and in server functions (Web Crypto). */
export async function hashWord(word: string) {
  const bytes = new TextEncoder().encode(word.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const noteToFatima = {
  question: "What is the surname of your bestie back then in EPU?",
  secretHash:
    "93294099642f04b2934626d1a29455670464d6cc5bc6b32a46731df428303c30",
  /** Before this moment only a teaser is shown; from it the full letter opens. */
  fullRevealAt: "2026-11-07T00:00:00+01:00",
  teaserParagraphs: 2,
  greeting: "My dearest Fatima,",
  paragraphs: [
    "Hmnnnnn, Àṣàkẹ́ mi, ọrẹ mi ọwọn. Just the way I always hail you when I want to trouble your life! 😊",
    "Ṣé o rí i báyìí? I have watched you pray for this quietly and patiently, long before anyone knew what was in your heart. Àbájọ tí wọ́n fi ní àdúrà gbà! Here it is — answered, and more beautiful than any of us imagined.",
    "You have always been that one friend who shows up: in the odd hours, in the difficult seasons, and in the quiet days that nobody talks about. Knowing you has made me softer and braver at once. Ọrẹ tòótọ́ lo jẹ́ fún mi.",
    "So today, mi ò padánù ọrẹ rárá. I'm just watching the most beautiful chapter begin for someone I truly cherish. Bí ó tilẹ̀ jẹ́ pé I am not there physically to hold the mic with Usman and force you to pronounce three (tiwi) 😂 just to catch cruise with your R-factor, my heart is right there with you.",
    "May your home be filled with mawaddah and rahmah. May your joy never run dry, and may you and your husband always be each other's solace.",
  ],
  dua: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
  amarya: "Amarya! ✨👰🏽‍♀️",
  closing: "O kú oríire, ìyàwó wa! Always your personal person,",
  signature: "Abdullateef",
};

export function isLetterFullyOpen(now: Date = new Date()) {
  return now.getTime() >= new Date(noteToFatima.fullRevealAt).getTime();
}

export const bridalWeek = [
  { date: "2026-11-03", day: "Tue", label: "3rd Nov", title: "Bridal Soirée" },
  { date: "2026-11-04", day: "Wed", label: "4th Nov", title: "Dance Practice" },
  { date: "2026-11-05", day: "Thu", label: "5th Nov", title: "Henna Day & Dance Practice" },
  { date: "2026-11-06", day: "Fri", label: "6th Nov", title: "Engagement Ceremony" },
  { date: "2026-11-07", day: "Sat", label: "7th Nov", title: "The Main Wedding" },
];

export const memoryCategories = [
  { id: "soiree", label: "Bridal Soirée" },
  { id: "dance", label: "Dance Practice" },
  { id: "henna", label: "Henna Day" },
  { id: "engagement", label: "Engagement" },
  { id: "nikkah", label: "Nikkah Day" },
  { id: "general", label: "General" },
] as const;

export const MAX_UPLOAD_MB = 1024;

export const bridalNotes = [
  {
    title: "Makeup & Gele",
    note: "A makeup artist has agreed to handle both for ₦15,000 per person. Interested? Reach out early so we can confirm numbers ahead of time. 💄",
  },
  {
    title: "Henna Day",
    note: "The bride has already taken care of the henna — no payment required, just show up glowing. 🌿",
  },
  {
    title: "Soirée Games",
    note: "What games and fun activities should we have at the Bridal Soirée? Bring your ideas — the more laughter, the better. 🥳",
  },
] as const;

export const quiz = {
  title: "How well do you know Fatima?",
  intro: "The Bridal Soirée game. Answer all 10 and race for the Chief Bridesmaid crown.",
  /** Quiz opens for everyone at this moment (5 PM, Lagos time). */
  opensAt: "2026-11-03T17:00:00+01:00",
  instructions: [
    "There are 10 questions about Fatima — pick one answer for each.",
    "Each correct answer earns 1 point. You can't change an answer once picked.",
    "At the end, enter a nickname to post your score on the leaderboard.",
    "Highest score wins. On a tie, whoever submitted first ranks higher.",
    "The #1 spot is crowned Chief Bridesmaid 👑",
  ],
  questions: [
    {
      question: "If Fatima is having a long day, what will fix her mood instantly?",
      options: ["Suya & chilled drink", "Ice cream / Boba / Parfait", "Indomie with extra spice & egg", "Chocolate & pastries"],
      answer: 3,
    },
    {
      question: "Where did Fatima and Masoud first meet / talk?",
      options: ["At university / school", "Through mutual family friends", "At a wedding / event", "On social media / DMs"],
      answer: 1,
    },
    {
      question: "What is guaranteed to get on Fatima's last nerve?",
      options: ["People being late / unpunctual", "Slow replies or left on read", "Loud chewing / bad table manners", "Plans being cancelled last minute"],
      answer: 3,
    },
    {
      question: "What is Fatima most likely doing on a quiet, lazy Saturday morning?",
      options: ["Sleeping in until noon", "Binge-watching series / K-dramas", "Online shopping or scrolling TikTok", "Up early cleaning and organizing the room"],
      answer: 1,
    },
    {
      question: "What does Fatima have a complete weakness for when shopping?",
      options: ["Perfumes / Oud", "Bags & shoes", "Abayas & fabrics", "Skincare & lip glosses"],
      answer: 2,
    },
    {
      question: "What is one thing Fatima secretly loves doing?",
      options: ["Singing all the lyrics to 2000s throwback songs", "Cooking like a master chef", "Getting super competitive during board/card games", "Crying at emotional movie scenes"],
      answer: 1,
    },
    {
      question: "What is Fatima's ultimate dream travel / vacation destination?",
      options: ["Maldives / Zanzibar", "South Korea / Istanbul", "Paris / London", "Umrah in Makkah & Madinah"],
      answer: 1,
    },
    {
      question: "Which part of wedding planning took Fatima the most time to decide on?",
      options: ["The dress & fabric colors", "The guest list", "The photo shoots & poses", "The food menu & cake"],
      answer: 0,
    },
    {
      question: "If Fatima were stranded on an island and could only take ONE thing, what would it be?",
      options: ["Her phone (with unlimited data)", "Money!", "Her favorite lip balm / perfume", "A lifetime supply of snacks"],
      answer: 3,
    },
    {
      question: "What is Fatima most likely to say after her Nikkah?",
      options: ["Finally!", "Where is the food?", "*Starts crying*", "Is it time to take pictures already?"],
      answer: 0,
    },
  ],
  results: [
    { min: 0, label: "New friend", message: "You have some catching up to do — start with a phone call!" },
    { min: 4, label: "Good friend", message: "You know her well, but there's more to discover." },
    { min: 7, label: "Best friend material", message: "Impressive! You clearly pay attention." },
    { min: 10, label: "Soul sister", message: "You know Fatima better than she knows herself!" },
  ],
} as const;

export function isQuizOpen(now: Date = new Date()) {
  return now.getTime() >= new Date(quiz.opensAt).getTime();
}
