/* ============================================================
   LUXURY TEMPLATE — CLIENT CONFIG
   ------------------------------------------------------------
   Everything a client personalises lives in this one object.
   Fill it in, save, deploy. No other file needs editing.
   ============================================================ */

const INVITE_CONFIG = {
  /* ---------- Theme (Luxury-tier customisation) ----------
     One word restyles the whole invitation:
       "noir"   — charcoal black & champagne gold   (default)
       "royal"  — midnight navy & platinum silver
       "ivory"  — warm ivory & antique gold (light)      */
  theme: "noir",

  /* ---------- Custom colours (Luxury-tier option) ----------
     Optional. Overrides any theme colour — change one, change all.
     Keys: gold, goldDeep, goldSoft, bg, bgDeep, panel, ink, muted
     Example: palette: { gold: "#e0c07a" }   // warmer gold accents
     Leave { } to use the theme untouched.                       */
  palette: {},

  /* ---------- Custom typography (Luxury-tier option) ----------
     Optional. Pick one per role — the font loads on demand:
       display: "Marcellus" | "Playfair Display" | "Cormorant Garamond"
       script:  "Pinyon Script" | "Great Vibes" | "Parisienne"
       sans:    "Montserrat" | "Jost" | "Manrope"
     Leave { } for the defaults shown below.                      */
  fonts: {},

  /* ---------- Motion ----------
     "always" — the cinematic motion plays for every guest (default).
     "honor"  — guests whose device asks for reduced motion
                (prefers-reduced-motion) get a still, instant version:
                no curtain, no letter effects, no dust.               */
  motion: "always",

  /* ---------- Cinematic opening ----------
     A black "curtain" opens the invitation. The tap that opens it
     also starts the music (browsers need a tap before audio).
     Set enabled: false to land straight on the hero.              */
  intro: {
    enabled: true,
    eyebrow: "You are cordially invited to",
    line: "a celebration of love, light & forever",
    enterLabel: "Open the Invitation",
  },

  /* ---------- Couple ---------- */
  couple: {
    name1: "Tasnia Haque",
    name2: "Farhan Malik",
    initials: "T&F",            // shown in the gold seal
    hashtag: "#TasniaAndFarhan",
  },

  /* ---------- Ceremony / occasion ---------- */
  // Wedding datetime — local time. Countdown, calendar links and the
  // displayed date all derive from this one value.
  weddingDateTime: "2027-03-19T18:00:00+06:00",
  dateDisplay: "Friday, 19 March 2027",
  city: "Dhaka, Bangladesh",
  heroEyebrow: "The Wedding of",

  /* ---------- Opening blessing ---------- */
  // Any one-line blessing, or replace with a quote. Leave "" to hide.
  blessing: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

  /* ---------- Families / welcome ---------- */
  welcome: {
    eyebrow: "Together with their families",
    parents1: "Daughter of Mr. Iqbal Haque & Mrs. Nasrin Haque",
    parents2: "Son of Mr. Rashid Malik & Mrs. Farzana Malik",
    inviteLine:
      "request the honour of your presence at their wedding celebration — three evenings of light, laughter and blessings.",
  },

  /* ---------- A line beneath the welcome (script font) ----------
     Leave "" to hide. */
  epigraph: "Some stories are written in ink — ours, in gold.",

  /* ---------- Countdown ---------- */
  countdownNote: "until the curtain rises on forever — In Shaa Allah",

  /* ---------- Our Story (cinematic timeline) ---------- */
  // Each chapter becomes one milestone on the gold timeline.
  story: {
    eyebrow: "How It Began",
    title: "Our",
    titleAccent: "Story",
    chapters: [
      {
        label: "Scene One · 2021",
        title: "A Wedding Brought Us",
        text: "A friend's nikah in Chattogram, a crowded hall, and one conversation by the sea that refused to end. Tasnia says Farhan quoted poetry for an hour; Farhan says he would have quoted forever.",
      },
      {
        label: "Scene Two · 2023",
        title: "Two Families, One Table",
        text: "A monsoon evening in Dhaka — parents smiling over biryani, du'a in the air, and a promise made official. The hardest part was pretending to be surprised.",
      },
      {
        label: "Scene Three · 2026",
        title: "She Said Yes",
        text: "On a rooftop under January stars, with the whole city glittering below, Farhan asked the question he had been rehearsing for a year. Tasnia said yes before he finished the sentence.",
      },
      {
        label: "The Finale · 2027",
        title: "Forever Begins",
        text: "And now we invite you — the people who loved us first — to witness the opening night of our greatest story.",
      },
    ],
  },

  /* ---------- Events ---------- */
  // Each event becomes one gilded card. Add or remove entries freely.
  // "mapQuery" is what gets searched on Google Maps (name or lat,lng).
  // For the calendar button to work, each event needs date (YYYY-MM-DD),
  // start/end (HH:MM, 24h, venue local time) and a timezone.
  events: [
    {
      tag: "Pre-Wedding",
      name: "Mehendi Night",
      tagline: "henna, candlelight & songs till late",
      date: "Thursday, 18 March 2027",
      time: "6:30 PM onwards",
      venue: "The Rooftop Garden, Haque Residence",
      address: "House 27, Road 11, Banani, Dhaka 1213",
      mapQuery: "Banani, Dhaka",
      calDate: "2027-03-18",
      calStart: "18:30",
      calEnd: "23:30",
      calTz: "Asia/Dhaka",
    },
    {
      tag: "Wedding Day",
      name: "Akd Ceremony",
      tagline: "the blessed union, followed by dinner",
      date: "Friday, 19 March 2027",
      time: "6:00 PM onwards",
      venue: "Grand Ballroom, The Westin Dhaka",
      address: "Main Gulshan Avenue, Road 45, Gulshan 2, Dhaka 1212",
      mapQuery: "The Westin Dhaka",
      calDate: "2027-03-19",
      calStart: "18:00",
      calEnd: "23:00",
      calTz: "Asia/Dhaka",
    },
    {
      tag: "Celebration",
      name: "Walima Reception",
      tagline: "an evening of dinner, duas & dance",
      date: "Saturday, 20 March 2027",
      time: "7:00 PM onwards",
      venue: "Crystal Ballroom, Pan Pacific Sonargaon Dhaka",
      address: "107 Kazi Nazrul Islam Avenue, Dhaka 1215",
      mapQuery: "Pan Pacific Sonargaon Dhaka",
      calDate: "2027-03-20",
      calStart: "19:00",
      calEnd: "23:30",
      calTz: "Asia/Dhaka",
    },
  ],

  /* ---------- Venue / map ---------- */
  // Shown in the map section (usually your main event).
  venue: {
    name: "Grand Ballroom, The Westin Dhaka",
    address: "Main Gulshan Avenue, Road 45, Gulshan 2, Dhaka 1212",
    mapQuery: "The Westin Dhaka",
    mapZoom: 15,
  },

  /* ---------- Photo gallery ----------
     Drop photos into assets/photos/ (webp/jpg, ~1200px wide is plenty)
     and list them here. "wide: true" spans two columns,
     "tall: true" spans two rows.                                        */
  gallery: {
    eyebrow: "Captured Moments",
    title: "Our",
    titleAccent: "Gallery",
    photos: [
      { src: "assets/photos/photo-1.svg", alt: "Tasnia and Farhan monogram in a gold ring", caption: "Two names, one story", wide: false },
      { src: "assets/photos/photo-2.svg", alt: "Save the date artwork with rings", caption: "Save the date", wide: true },
      { src: "assets/photos/photo-3.svg", alt: "Crescent moon and stars artwork", caption: "Under the same moon", wide: false },
      { src: "assets/photos/photo-4.svg", alt: "Damask pattern artwork", caption: "Woven like jaal", wide: false },
      { src: "assets/photos/photo-5.svg", alt: "Moorish arch with hanging lights artwork", caption: "The grand entrance", wide: true },
      { src: "assets/photos/photo-6.svg", alt: "Gold botanical sprays artwork", caption: "Golden hour", wide: false },
      { src: "assets/photos/photo-7.svg", alt: "Ornate hanging lantern artwork", caption: "Light upon light", wide: false },
      { src: "assets/photos/photo-8.svg", alt: "Gold paisley motif artwork", caption: "Where it all begins", wide: false },
    ],
  },

  /* ---------- Custom sections (the Luxury signature) ----------
     Any number of extra sections, rendered between the gallery and
     the venue map. Four layouts:
       { layout: "quote", quote, source }
       { layout: "text",  eyebrow, title, titleAccent, text, note? }
       { layout: "cards", eyebrow, title, titleAccent, note?,
         cards: [{ kicker, title, text, swatches: ["#hex", …] }] }
       { layout: "faq",   eyebrow, title, titleAccent,
         items: [{ q, a }] }
     Remove an entry to drop the section. Add your own the same way.  */
  customSections: [
    {
      layout: "quote",
      quote:
        "And among His signs is this: that He created for you mates from among yourselves, that you may find tranquillity in them; and He has put love and mercy between your hearts.",
      source: "Surah Ar-Rum · 30:21",
    },
    {
      layout: "cards",
      eyebrow: "The Palette",
      title: "Dress",
      titleAccent: "Code",
      note: "We warmly invite you to wrap yourselves in the colours of the evening — jewel tones, deep silks and gold.",
      cards: [
        {
          kicker: "For Her",
          title: "Sarees & Gowns",
          text: "Emerald, maroon, sapphire or gold — shimmer and sparkle are very welcome.",
          swatches: ["#14524a", "#7a1f2b", "#1f2a52", "#c9a24d"],
        },
        {
          kicker: "For Him",
          title: "Sherwani & Suits",
          text: "Classic black, ivory or midnight blue — a touch of gold completes it.",
          swatches: ["#141414", "#efe6d4", "#1d2a45", "#c9a24d"],
        },
      ],
    },
    {
      layout: "cards",
      eyebrow: "From Afar",
      title: "Travel &",
      titleAccent: "Stay",
      note: "For our loved ones travelling to Dhaka — we want your journey to be as easy as it is joyful.",
      cards: [
        {
          kicker: "2 min from the venue",
          title: "The Westin Dhaka",
          text: "Our main venue hotel — mention the Haque–Malik wedding for the guests' rate.",
        },
        {
          kicker: "City centre",
          title: "Pan Pacific Sonargaon",
          text: "Where the Walima is held — stay where the celebration continues.",
        },
        {
          kicker: "Need a hand?",
          title: "Call Our Planner",
          text: "Rifa (family planner) can help with cars, rooms and directions — +880 17XX-XXXXXX.",
        },
      ],
    },
    {
      layout: "faq",
      eyebrow: "Before You Ask",
      title: "Good to",
      titleAccent: "Know",
      items: [
        {
          q: "What about gifts?",
          a: "Your presence is the greatest gift of all. If you would still like to bless us, a small contribution to our first home will be received with love and gratitude.",
        },
        {
          q: "Will there be photography?",
          a: "Yes — our photographers will quietly roam all three evenings. Dress ready; the albums will be shared with everyone who joins.",
        },
        {
          q: "Can we bring the children?",
          a: "Absolutely — the little ones are part of the joy. A supervised kids' corner with snacks and games will be waiting at the ballroom.",
        },
        {
          q: "Is parking available?",
          a: "Valet parking is complimentary at both hotels. Do tell the gate you are with the Haque–Malik wedding.",
        },
      ],
    },
  ],

  /* ---------- Background music ----------
     Replace assets/music/theme.mp3 with the client's song (mp3, ≤2 MB is
     ideal). "autoplay" starts it on the tap that opens the invitation —
     browsers block silent autoplay, so this is the smoothest allowed
     behaviour.                                                          */
  music: {
    enabled: true,
    src: "assets/music/theme.mp3",
    autoplay: true,
  },

  /* ---------- RSVP ----------
     Guests submit the form below. Two delivery options:
       endpoint  — a Formspree/formsubmit-style URL (POSTs as JSON).
                   Leave "" to skip.
       whatsapp  — fallback/primary: opens WhatsApp with the answers
                   pre-typed, sent straight to the couple's number
                   (international format, digits only, no +).
     If both are set, the form POSTs to the endpoint and also offers
     the WhatsApp button.                                                */
  rsvp: {
    enabled: true,
    deadline: "1 March 2027",
    note: "Kindly respond by {deadline} — the ballroom awaits your name.",
    whatsapp: "8801712345678",
    endpoint: "",
    successNote:
      "JazakAllah Khair! Your seat is being saved — we can't wait to celebrate with you.",
  },

  /* ---------- Closing ---------- */
  closing: "With love and prayers, we await your presence",
  credit: "Crafted with \u2665 \u2014 Your Studio Name",
};

/* Export for reuse; safe to ignore in the browser. */
if (typeof module !== "undefined") {
  module.exports = INVITE_CONFIG;
}
