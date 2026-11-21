/* =====================================================================
   WEDDING CONFIG — edit this file to change anything on the invitation.
   You never need to touch index.html, style.css or main.js for content.
   ===================================================================== */

window.WEDDING = {

  /* ---------- The couple ---------- */
  groom: {
    fullName: "Mirda Alfian Dwi Cahyono",
    nickname: "Mirda",
    parentsLabel: "The son of",
    parents: "Alm. Bapak Suheri & Ibu Sri Lestari",
    photo: "assets/images/groom.jpg",
    instagram: ""            // e.g. "https://instagram.com/username" — leave "" to hide
  },
  bride: {
    fullName: "Aprilia Faiqoh Ferdian",
    nickname: "Aprilia",
    parentsLabel: "The daughter of",
    parents: "Alm. Bapak Ferdiansyah & Ibu Endang Pujawati",
    photo: "assets/images/bride.jpg",
    instagram: ""
  },

  /* ---------- Opening words ---------- */
  verse: {                   // set text to "" to hide
    text: "And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy.",
    source: "QS. Ar-Rum : 21"
  },
  intro: "We are beginning a new chapter of our lives, and we would be so happy to share this moment with our family and friends. With joy, we invite you to celebrate our wedding.",
  countdownNote: "Every passing day brings us closer to our forever. Thank you for the love and prayers that brought us here.",

  /* ---------- The event ----------
     Times are ISO date-time WITH timezone. +07:00 = WIB (Batam).
     The countdown counts to the FIRST session. Each session gets its
     own card with "Save to calendar" and "Google Maps" buttons.        */
  event: {
    title: "The Wedding of Aprilia & Mirda",
    sessions: [
      { name: "Akad Nikah", start: "2026-12-26T13:00:00+07:00", end: "2026-12-26T14:30:00+07:00" },
      { name: "Resepsi",    start: "2026-12-26T14:30:00+07:00", end: "2026-12-26T17:00:00+07:00" }
    ],
    venueName: "Garpoo Batam",
    venueAddress: "Batam, Kepulauan Riau",
    mapsQuery: "Garpoo Batam",             // what Google Maps searches for
    mapsLink: "",                           // optional: paste an exact Google Maps share link to override mapsQuery
    calendarDescription: "With joy, we invite you to celebrate the wedding of Aprilia Faiqoh Ferdian & Mirda Alfian Dwi Cahyono."
  },

  /* ---------- Dress code ---------- */
  dressCode: {
    note: "These colours are only a guide, not a rule. Please come in whatever you already have in your wardrobe.",
    colors: [
      { hex: "#647348", name: "Olive" },
      { hex: "#764521", name: "Cinnamon" },
      { hex: "#D3B592", name: "Sand" },
      { hex: "#F7E2DC", name: "Blush" },
      { hex: "#D6993C", name: "Turmeric" },
      { hex: "#F7F7AF", name: "Butter" },
      { hex: "#111A24", name: "Midnight" }
    ]
  },

  /* ---------- Gifts ---------- */
  gifts: {
    title: "Wanna give us some gifts?",
    note: "Your presence and prayers are the greatest gift. But if you'd like to send a token of love, here's how.",
    banks: [
      { bank: "BCA", number: "5660476247", holder: "Mirda Alfian Dwi Cahyono" },
      { bank: "CIMB Niaga", number: "706461211500", holder: "Aprilia Ferdian" }
    ],
    // Physical gifts: guests confirm the address on WhatsApp.
    // Format: country code, no "+" or spaces, e.g. "6281234567890". Leave "" to hide.
    whatsappBride: "",
    whatsappGroom: "",
    whatsappMessage: "Hi! I'd like to send a wedding gift. Could you share the delivery address?"
  },

  /* ---------- RSVP / wishes backend ----------
     Paste your Google Apps Script Web App URL here (see README, step 2).
     While it's empty, the form works in demo mode and nothing is saved. */
  rsvp: {
    scriptUrl: "https://script.google.com/macros/s/AKfycbx1W7RKVixX7WUzEwKKnrmuUDzxhjlQBVEsVHtyT6cGNb3sPR-i4u__1zK0U0ZqhY3I/exec",
    note: "Kindly let us know by 19 December 2026.",
    maxGuests: 5,
    refreshSeconds: 30
  },

  /* ---------- Media ---------- */
  media: {
    // The moving background behind the WHOLE invitation.
    backgroundVideo: "assets/video/background.mp4",   // muted, looping. Keep under ~8 MB.
    backgroundPoster: "assets/images/background-poster.jpg", // shown while loading / if autoplay is blocked
    backgroundDarkness: 0.5,  // 0 = no dimming, 0.8 = very dark. Raise it if text is hard to read.

    coverImage: "assets/images/cover.jpg",          // opening screen before "Open invitation"
    gallery: [
      "assets/images/gallery-1.jpg",
      "assets/images/gallery-2.jpg",
      "assets/images/gallery-3.jpg",
      "assets/images/gallery-4.jpg",
      "assets/images/gallery-5.jpg",
      "assets/images/gallery-6.jpg"
    ],
    video: "",                 // optional pre-wedding film in the gallery, e.g. "assets/video/prewedding.mp4"
    youtubeId: "",             // or a YouTube ID instead of a file
    music: ""                  // e.g. "assets/music/song.mp3"
  },

  /* ---------- Closing ---------- */
  closing: {
    message: "It would be our greatest honour and happiness to have you with us on our wedding day.",
    signoff: "With love, Aprilia & Mirda, and both families"
  }
};
