/* =====================================================================
   WEDDING CONFIG — edit this file to change anything on the invitation.
   You never need to touch index.html, style.css or main.js for content.
   ===================================================================== */

window.WEDDING = {

  /* ---------- The couple ---------- */
  groom: {
    fullName: "Mirda Alfian Dwi Cahyono",
    nickname: "Mirda",
    parentsLabel: "The youngest son of",
    parents: "Alm. Bapak Heri Sukamto & Ibu Sri Lestari",
    photo: "assets/images/groom.jpg",
    instagram: ""            // e.g. "https://instagram.com/username" — leave "" to hide
  },
  bride: {
    fullName: "Aprilia Faiqoh Ferdian",
    nickname: "April",
    parentsLabel: "The eldest daughter of",
    parents: "Alm. Bapak Ferdiansyah & Ibu Endang Pujawati",
    photo: "assets/images/bride.jpg",
    instagram: ""
  },
  story: {
    title: "A Little Story",
    subtitle: "of April & Mirda",
    paragraphs: [
      "What began with a match on Bumble in July 2023 became a journey neither of them could have imagined.",
      "From a missed flight and a rather unusual gift of Cosmos potting mix to their first meeting in Batam, their story has been filled with little surprises, long-distance goodbyes, shared adventures, and countless reasons to choose each other.",
      "Through life's unexpected turns, they learned that love is not only about being together in the happiest moments, but also about showing up, staying, and finding strength in one another when things get difficult.",
      "And then came a bouquet, caught by Mirda at April's brother's wedding and handed to April — perhaps a little preview of the day they would begin their own forever.",
      "Today, they're turning the page to their most beautiful chapter yet."
    ]
  },
  /* ---------- Opening words ---------- */
   verse: {
    text: "“If there's any kind of magic in this world, it must be in the attempt of understanding someone, sharing something...\n\nI know, it's almost impossible to succeed, but... who cares, really? The answer must be in the attempt.”",
    source: "Before Sunrise (1995)"
  },
  intro: "We are beginning a new chapter of our lives, and we would be so happy to share this moment with our family and friends. With joy, we invite you to celebrate our wedding.",
  countdownNote: "Every passing day brings us closer to our forever. Thank you for the love and prayers that brought us here.",

  /* ---------- The event ----------
     Times are ISO date-time WITH timezone. +07:00 = WIB (Batam).
     The countdown counts to the FIRST session. Each session gets its
     own card with "Save to calendar" and "Google Maps" buttons.        */
  event: {
    title: "The Wedding of April & Mirda",
    sessions: [
      { name: "Akad Nikah", start: "2026-12-26T13:00:00+07:00", end: "2026-12-26T14:30:00+07:00", akadOnly: true },
      { name: "Resepsi",    start: "2026-12-26T14:30:00+07:00", end: "2026-12-26T17:00:00+07:00" }
    ],
    venueName: "Garpoo Batam",
    venueAddress: "Batam, Kepulauan Riau",
    mapsQuery: "Garpoo Batam",             // what Google Maps searches for
    mapsLink: "",                           // optional: paste an exact Google Maps share link to override mapsQuery
    calendarDescription: "With joy, we invite you to celebrate the wedding of Aprilia Faiqoh Ferdian & Mirda Alfian Dwi Cahyono."
  },

     /* ---------- Two kinds of invitation ----------
     Akad guests:          https://…/?to=Name&type=akad
     Resepsi-only guests:  https://…/?to=Name
     {time} is filled in automatically (13.00 WIB / 14.30 WIB).        */
  invite: {
    default: "resepsi",
    akadNote: "You are warmly welcome to join our Akad Nikah, and may arrive from {time}.",
    resepsiNote: "We would love to celebrate with you at our Resepsi, which starts at {time}."
  },
   
  /* ---------- Dress code ---------- */
  dressCode: {
    note: "These colours are only a guide, not a rule. Please come in whatever you already have in your wardrobe.",
      colors: [
      { hex: "#A4BCA5", name: "Sage" },
      { hex: "#647348", name: "Olive" },
      { hex: "#764521", name: "Cinnamon" },
      { hex: "#CA9874", name: "Caramel" },
      { hex: "#FFACD2", name: "Pink" },
      { hex: "#F2B251", name: "Marigold" },
      { hex: "#FBFBA0", name: "Butter" },
      { hex: "#111A24", name: "Midnight" }
    ]
  },

  /* ---------- Gifts ---------- */
  gifts: {
    title: "Wanna give us some gifts?",
    note: "Your presence and prayers are the greatest gift. But if you'd like to send a token of love, here's how.",
    banks: [
      { bank: "BCA", number: "5660476247", holder: "Mirda Alfian Dwi Cahyono" },
      { bank: "CIMB Niaga", number: "706461211500", holder: "Aprilia F Ferdian" }
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
         monogram: "assets/images/AM_Monogram.png",
    // The moving background behind the WHOLE invitation.
    backgroundVideo: "assets/video/background-portrait.mp4",   // loops behind everything. Keep under ~10 MB.
    backgroundPoster: "assets/images/background-poster.jpg", // shown while loading / if autoplay is blocked
   backgroundVideoDesktop: "assets/video/background-desktop.mp4",
   backgroundPosterDesktop: "assets/images/background-poster-desktop.jpg",
    backgroundDarkness: 0.5,  // 0 = no dimming, 0.8 = very dark. Raise it if text is hard to read.
    backgroundVideoSound: true, // true = the background video's own sound plays after "Open invitation"
                                // (the floating button mutes/unmutes it). Ignored if "music" below is set.

    gallery: [],               // photo grid — empty = hidden (the gallery video replaces it)
   coverflow: ["assets/images/gallery-1.jpg", "assets/images/gallery-2.jpg", "assets/images/gallery-3.jpg", "assets/images/gallery-4.jpg", "assets/images/gallery-5.jpg", "assets/images/gallery-6.jpg"],
    video: "",   // designed motion gallery: silent, autoplays, loops
    videoPoster: "",           // optional still shown before the gallery video loads
    youtubeId: "",             // alternative to a video file (overrides "video")
   galleryImage: "",    
   music: ""                  // optional separate song file; leave "" to use the background video's sound
  },

  /* ---------- Closing ---------- */
    closing: {
    message: "It would be our greatest honour and happiness to have you with us on our wedding day.",
    withLove: "with love,",
    names: "April & Mirda",
    families: "and both families"
  }
};
