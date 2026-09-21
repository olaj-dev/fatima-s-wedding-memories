// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT — replace the values below with the real details.
// ---------------------------------------------------------------------------

export const wedding = {
  bride: "Fatima",
  groom: "Ahmad",
  hashtag: "#TheAFUnion2026",
  // Nikkah day
  date: "2026-11-06T11:00:00+01:00",
  dateLabel: "Friday, 6th November 2026",
  timeLabel: "11:00 AM prompt",
  venue: "Al-Noor Central Mosque Hall",
  address: "12 Awolowo Road, Ikoyi, Lagos, Nigeria",
  mapUrl: "https://maps.google.com/?q=Ikoyi+Lagos",
  dressCode: "Emerald green & gold — modest attire please",
  story:
    "Two families, one prayer answered. What began with a quiet introduction between loved ones has grown into a union built on faith, patience and mercy. We invite you to stand with us as Fatima and Ahmad begin this beautiful journey.",
} as const;

export const ayah = {
  arabic:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  translation:
    "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
  reference: "Surah Ar-Rum 30:21",
} as const;

export const programme = [
  { time: "9:30 AM", title: "Guests arrive & seating", note: "Light refreshments served" },
  { time: "10:30 AM", title: "Qur'an recitation", note: "Opening supplication" },
  { time: "11:00 AM", title: "Nikkah ceremony", note: "Solemnisation & exchange of vows" },
  { time: "12:00 PM", title: "Sermon & prayers", note: "Words from the Imam" },
  { time: "12:45 PM", title: "Family photographs", note: "Both families & friends" },
  { time: "1:30 PM", title: "Walimah reception", note: "Lunch, music & toasts" },
  { time: "4:00 PM", title: "Send-forth", note: "Departure of the couple" },
];

export const contacts = [
  { name: "Aisha Bello", role: "Bride's family", phone: "+2348012345678" },
  { name: "Yusuf Ibrahim", role: "Groom's family", phone: "+2348023456789" },
  { name: "Abioye Olajide", role: "Guest coordination", phone: "+2348034567890" },
];

export const gifts = {
  intro:
    "Your presence and prayers are the greatest gift. For those who wish to give a little extra, here are a few ways.",
  options: [
    {
      label: "Bank transfer",
      detail: "Fatima & Ahmad — 0123456789, Example Bank",
      hint: "Kindly use your name as the narration.",
    },
    {
      label: "Gift registry",
      detail: "Items for the new home",
      hint: "Registry link coming soon.",
    },
    {
      label: "Sadaqah in our name",
      detail: "A donation to a cause close to our hearts",
      hint: "Tell us about it — it would mean the world.",
    },
  ],
};

export const noteToFatima = {
  greeting: "My dearest Fatima,",
  paragraphs: [
    "I have watched you pray for this, quietly and patiently, long before anyone else knew what you were asking for. And here it is — answered, and more beautiful than we imagined.",
    "You have been the kind of friend who shows up: in the small hours, in the hard seasons, in the plain ordinary days that nobody writes about. Knowing you has made me softer and braver at once.",
    "So today I am not losing a friend to marriage. I am watching a whole new chapter open for someone I love, and I get a front-row seat.",
    "May your home be filled with mawaddah and rahmah. May laughter outnumber tears. May you always be each other's peace.",
  ],
  signature: "With all my love, always — Abioye",
};
