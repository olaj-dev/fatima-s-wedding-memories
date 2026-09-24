// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT — items still awaiting real details are marked TODO.
// ---------------------------------------------------------------------------

export const wedding = {
  bride: "Fatima",
  brideFull: "Fatima Ahmad",
  groom: "Masoud",
  groomFull: "Masoud Tijjani",
  // TODO: hashtag not concluded yet
  // Nikkah day — TODO: confirm the year if it is not 2026
  date: "2026-11-06T09:00:00+01:00",
  dateLabel: "Friday, 6th November 2026",
  timeLabel: "9:00 AM prompt · reception follows immediately",
  venue: "Digital Bridge Institute (Nitel)",
  // TODO: confirm full address / hall name
  address: "Kano, Nigeria",
  mapUrl: "https://maps.google.com/?q=Digital+Bridge+Institute+Kano",
  dressCode: "Emerald green & champagne gold — modest attire please",
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
  { time: "9:00 AM", title: "Nikkah ceremony", note: "Solemnisation & exchange of vows" },
  { time: "Immediately after", title: "Reception", note: "Lunch, music & toasts" },
  { time: "12:00 PM", title: "Family photographs", note: "Both families & friends" },
  { time: "2:00 PM", title: "Send-forth", note: "Departure of the couple" },
];

export const contacts = [
  { name: "Ayuba", role: "Bride's brother", phone: "07060636825" },
  { name: "Groom's brother", role: "Groom's family", phone: "07032455376" },
];

export const gifts = {
  intro:
    "Your presence and prayers are the greatest gift. For those who wish to give a little extra:",
  options: [
    {
      label: "Bank transfer",
      // TODO: replace with the real account details
      detail: "Fatima & Masoud — 0123456789, Example Bank",
      hint: "Kindly use your name as the narration.",
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
