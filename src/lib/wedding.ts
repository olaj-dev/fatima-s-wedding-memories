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
  // TODO: placeholder secret — replace with a code only Fatima would guess.
  secretHash:
    "9b3b0d70a1b31e51bbfaad2e1f1a37e2d5e1a3f0a3c2e8d7b6a5948372615049", // "mawaddah"
  secretHint:
    "The word the Qur'an uses for the love placed between two hearts — Ar-Rum 30:21.",
  greeting: "My dearest Fatima,",
  paragraphs: [
    "I have watched you pray for this, quietly and patiently, long before anyone else knew what you were asking for. And here it is — answered, and more beautiful than we imagined.",
    "You have been the kind of friend who shows up: in the small hours, in the hard seasons, in the plain ordinary days that nobody writes about. Knowing you has made me softer and braver at once.",
    "So today I am not losing a friend to marriage. I am watching a whole new chapter open for someone I love, and I get a front-row seat.",
    "May your home be filled with mawaddah and rahmah. May laughter outnumber tears. May you always be each other's peace.",
  ],
  signature: "With all my love, always — Abioye",
};
