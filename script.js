/* ============================================================
   Luxury Wedding Invitation — behaviour
   All content comes from INVITE_CONFIG (config.js).

   1. Theme · palette · custom fonts        8. Map
   2. Text hydration + EN/বাংলা           9. Countdown (flip)
   3. Cinematic opening                    10. Background music
   4. Hero letter reveal                   11. RSVP form
   5. Story timeline (scroll-drawn rail)   12. Share menu
   6. Event cards                          13. FX: dust · parallax · grain ·
   7. Gallery + lightbox + custom sections    comet · traces · flourishes
                                           14. Language toggle
   ============================================================ */
(function () {
  "use strict";

  // Top-level `const` in config.js creates a global lexical binding, not a
  // window property — so read the binding directly and only fall back to window.
  var cfg = typeof INVITE_CONFIG !== "undefined" ? INVITE_CONFIG : window.INVITE_CONFIG;
  if (!cfg) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============ 0. Language / i18n ============
     English is the default. First-time visitors whose browser language
     starts with "bn" get Bangla; the choice is remembered in localStorage.
     UI chrome strings live in UI below. Client content is localised via the
     optional "bn" block in config.js (missing keys fall back to English).
     With no "bn" block the toggle hides itself and the site stays English. */
  var LANG_KEY = "invite-lang";

  var UI = {
    en: {
      documentTitleSuffix: "Wedding Invitation",
      nameSep: "&",
      amp: "&",
      scroll: "Scroll",
      saveTheDate: "Save the Date",
      countdownTitle: "Counting Down<br /><em>to Forever</em>",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      countdownAria: "Countdown to the wedding",
      eventsEyebrow: "When & Where",
      eventsTitle: "Three Evenings of <em>Light</em>",
      galleryHint: "Tap a photo to view it close-up",
      viewPhoto: "View photo: {name}",
      venueEyebrow: "The Venue",
      venueTitle: "Find Us <em>There</em>",
      mapTitle: "Map to the wedding venue",
      openInMaps: "Open in Google Maps \u2197",
      shareAria: "Share this invitation",
      shareThis: "Share this Invitation",
      share: "Share",
      shareCopy: "Copy link",
      shareWhatsApp: "WhatsApp",
      shareMessenger: "Messenger",
      shareTelegram: "Telegram",
      shareEmail: "Email",
      socialInstagram: "Spondora Invites on Instagram",
      socialFacebook: "Spondora Invites on Facebook",
      viewOnMap: "View on Map \u2197",
      addToCalendar: "Add to Calendar \u2197",
      labelDate: "Date",
      labelTime: "Time",
      labelVenue: "Venue",
      labelAddress: "Address",
      linkCopied: "Link copied to clipboard",
      copied: "Copied \u2713",
      shareText: "You\u2019re invited \u2014 {names} \u00B7 {date} \u00B7 {city}",
      calendarDetails: "We would be honoured by your presence. {hashtag}",
      rsvpEyebrow: "Will You Join Us?",
      rsvpTitle: "Kindly <em>Respond</em>",
      rsvpName: "Your Name",
      rsvpNamePh: "e.g. Rahim Uddin & family",
      rsvpAttending: "Will you be attending?",
      rsvpYes: "Joyfully, yes",
      rsvpNo: "Regretfully, no",
      rsvpGuests: "Number of Guests",
      guest1: "1 guest",
      guest2: "2 guests",
      guest3: "3 guests",
      guest4: "4 guests",
      guest5: "5 guests",
      guest6: "6+ guests",
      rsvpEvents: "Which events will you attend?",
      rsvpMessage: "A Message for the Couple",
      rsvpOptional: "(optional)",
      rsvpMessagePh: "Your wishes, duas & blessings\u2026",
      rsvpSubmit: "Send RSVP",
      rsvpWhatsappHeader: "RSVP \u2014 {couple}",
      rsvpNameLine: "Name: {name}",
      rsvpAttendingYes: "Attending: Joyfully, yes ({guests})",
      rsvpAttendingNo: "Attending: Regretfully, no",
      rsvpEventsLine: "Events: {events}",
      rsvpMessageLine: "Message: {message}",
      guestSingular: "guest",
      guestPlural: "guests",
      rsvpWhatsappOpened: "We opened WhatsApp with your answers \u2014 just press send.",
      rsvpError: "Something went wrong sending your RSVP \u2014 please try again.",
      musicPlay: "Play background music",
      musicPause: "Pause background music",
      lightboxLabel: "Photo viewer",
      lightboxClose: "Close photo viewer",
      lightboxPrev: "Previous photo",
      lightboxNext: "Next photo",
      switchTo: "Switch to Bangla",
    },
    bn: {
      documentTitleSuffix: "বিয়ের আমন্ত্রণ",
      nameSep: "ও",
      amp: "ও",
      scroll: "নিচে দেখুন",
      saveTheDate: "তারিখটি মনে রাখুন",
      countdownTitle: "মুহূর্ত গুনছি<br /><em>চিরকালের জন্য</em>",
      days: "দিন",
      hours: "ঘণ্টা",
      minutes: "মিনিট",
      seconds: "সেকেন্ড",
      countdownAria: "বিয়ের কাউন্টডাউন",
      eventsEyebrow: "কখন ও কোথায়",
      eventsTitle: "আলোয় ভরা <em>তিন সন্ধ্যা</em>",
      galleryHint: "ছবিতে চাপ দিয়ে বড় করে দেখুন",
      viewPhoto: "ছবি দেখুন: {name}",
      venueEyebrow: "স্থান",
      venueTitle: "আমাদের খুঁজে পান <em>সেখানে</em>",
      mapTitle: "বিয়ের স্থানের মানচিত্র",
      openInMaps: "গুগল ম্যাপে খুলুন \u2197",
      shareAria: "এই আমন্ত্রণটি শেয়ার করুন",
      shareThis: "এই আমন্ত্রণটি শেয়ার করুন",
      share: "শেয়ার",
      shareCopy: "লিংক কপি করুন",
      shareWhatsApp: "হোয়াটসঅ্যাপ",
      shareMessenger: "মেসেঞ্জার",
      shareTelegram: "টেলিগ্রাম",
      shareEmail: "ইমেইল",
      socialInstagram: "ইনস্টাগ্রামে Spondora Invites",
      socialFacebook: "ফেসবুকে Spondora Invites",
      viewOnMap: "মানচিত্রে দেখুন \u2197",
      addToCalendar: "ক্যালেন্ডারে যোগ করুন \u2197",
      labelDate: "তারিখ",
      labelTime: "সময়",
      labelVenue: "স্থান",
      labelAddress: "ঠিকানা",
      linkCopied: "লিংক কপি হয়েছে",
      copied: "কপি হয়েছে \u2713",
      shareText: "আপনি আমন্ত্রিত \u2014 {names} \u00B7 {date} \u00B7 {city}",
      calendarDetails: "আপনাদের উপস্থিতিই আমাদের সৌভাগ্য। {hashtag}",
      rsvpEyebrow: "আপনি কি আমাদের সঙ্গে থাকবেন?",
      rsvpTitle: "সাদরে <em>উত্তর দিন</em>",
      rsvpName: "আপনার নাম",
      rsvpNamePh: "যেমন: রহিম উদ্দিন ও পরিবার",
      rsvpAttending: "আপনি কি উপস্থিত থাকবেন?",
      rsvpYes: "আনন্দের সঙ্গে, হ্যাঁ",
      rsvpNo: "দুঃখিত, পারছি না",
      rsvpGuests: "অতিথির সংখ্যা",
      guest1: "১ জন অতিথি",
      guest2: "২ জন অতিথি",
      guest3: "৩ জন অতিথি",
      guest4: "৪ জন অতিথি",
      guest5: "৫ জন অতিথি",
      guest6: "৬+ জন অতিথি",
      rsvpEvents: "কোন কোন অনুষ্ঠানে থাকবেন?",
      rsvpMessage: "নবদম্পতির জন্য একটি বার্তা",
      rsvpOptional: "(ঐচ্ছিক)",
      rsvpMessagePh: "আপনার শুভেচ্ছা, দোয়া ও আশীর্বাদ\u2026",
      rsvpSubmit: "আরএসভিপি পাঠান",
      rsvpWhatsappHeader: "আরএসভিপি \u2014 {couple}",
      rsvpNameLine: "নাম: {name}",
      rsvpAttendingYes: "উপস্থিতি: আনন্দের সঙ্গে, হ্যাঁ ({guests})",
      rsvpAttendingNo: "উপস্থিতি: দুঃখিত, পারছি না",
      rsvpEventsLine: "অনুষ্ঠান: {events}",
      rsvpMessageLine: "বার্তা: {message}",
      guestSingular: "জন অতিথি",
      guestPlural: "জন অতিথি",
      rsvpWhatsappOpened: "আপনার উত্তরসহ হোয়াটসঅ্যাপ খোলা হয়েছে \u2014 শুধু পাঠিয়ে দিন।",
      rsvpError: "আরএসভিপি পাঠাতে সমস্যা হয়েছে \u2014 আবার চেষ্টা করুন।",
      musicPlay: "ব্যাকগ্রাউন্ড সংগীত চালু করুন",
      musicPause: "ব্যাকগ্রাউন্ড সংগীত বন্ধ করুন",
      lightboxLabel: "ছবি দেখার উইন্ডো",
      lightboxClose: "ছবি দেখার উইন্ডো বন্ধ করুন",
      lightboxPrev: "আগের ছবি",
      lightboxNext: "পরের ছবি",
      switchTo: "ইংরেজিতে পরিবর্তন করুন",
    },
  };

  var BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  var bnAvailable = !!(cfg.bn && typeof cfg.bn === "object" && !Array.isArray(cfg.bn));
  var lang = "en";
  var t = UI.en;       // current UI strings
  var c = cfg;         // current content config (English, or merged with cfg.bn)
  var refreshCountdown = null; // language swaps call this to re-render digits
  var refreshRsvp = null;      // set by the RSVP module
  var revealIO = null;         // created by initReveals()
  var revealReady = false;

  function isPlainObject(o) {
    return !!o && typeof o === "object" && !Array.isArray(o);
  }

  // Merge the Bangla mirror over the English config. Plain objects merge
  // key by key (a bn block may localise only some fields); arrays replace.
  function deepMerge(base, over) {
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(over).forEach(function (k) {
      out[k] = isPlainObject(base && base[k]) && isPlainObject(over[k])
        ? deepMerge(base[k], over[k])
        : over[k];
    });
    return out;
  }

  // Localise generated numerals (countdown, footer date, lightbox count).
  function L(value) {
    var s = String(value);
    if (lang !== "bn") return s;
    return s.replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }

  function initialLang() {
    if (!bnAvailable) return "en";
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "bn" || saved === "en") return saved;
    } catch (e) { /* storage unavailable (private mode etc.) */ }
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return String(nav).toLowerCase().indexOf("bn") === 0 ? "bn" : "en";
  }

  function setLang(next, persist) {
    lang = UI[next] ? next : "en";
    t = UI[lang];
    c = (lang === "bn" && bnAvailable) ? deepMerge(cfg, cfg.bn) : cfg;
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    }
    applyLanguage();
  }

  /* Motion default: "always" — the cinematic experience plays for every
     guest. Set INVITE_CONFIG.motion = "honor" to restore the accessible
     behaviour: guests whose device asks for reduced motion
     (prefers-reduced-motion) get a still, instant version instead. */
  var honorReducedMotion = cfg.motion === "honor";
  var reduced = honorReducedMotion &&
    !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (reduced) {
    document.body.classList.add("reduced");
    document.documentElement.classList.add("motion-reduced");
  }

  /* Shared with the intro + music modules: will the curtain play? */
  var introEl = $("#intro");
  var introActive = !!(introEl && (!cfg.intro || cfg.intro.enabled !== false) && !reduced);
  var musicKick = null; // set by the music module; called when the curtain opens

  /* ============ 1. Theme · palette · custom fonts ============ */
  var root = document.documentElement;

  if (cfg.theme) root.setAttribute("data-theme", cfg.theme);

  // Custom colours: override the core vars, then re-tint the hairlines
  // that are normally baked into each theme.
  var PALETTE_VARS = {
    gold: "--gold", goldDeep: "--gold-deep", goldSoft: "--gold-soft",
    bg: "--bg", bgDeep: "--bg-deep", panel: "--panel", ink: "--ink", muted: "--muted",
  };
  var customGold = null;
  if (cfg.palette && typeof cfg.palette === "object") {
    Object.keys(PALETTE_VARS).forEach(function (k) {
      if (cfg.palette[k]) {
        root.style.setProperty(PALETTE_VARS[k], cfg.palette[k]);
        if (k === "gold") customGold = cfg.palette[k];
      }
    });
    if (customGold) {
      var rgb = hexToRgb(customGold);
      if (rgb) {
        root.style.setProperty("--line", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.32)");
        root.style.setProperty("--line-faint", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.14)");
        root.style.setProperty("--glow", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.16)");
      }
    }
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  // Custom typography: any family from the approved list loads on demand.
  var FONT_ROLES = {
    display: { options: ["Marcellus", "Playfair Display", "Cormorant Garamond"], stack: ', "Cormorant Garamond", "Noto Serif Bengali", serif', varName: "--font-display" },
    script: { options: ["Pinyon Script", "Great Vibes", "Parisienne"], stack: ', "Noto Serif Bengali", cursive', varName: "--font-script" },
    sans: { options: ["Montserrat", "Jost", "Manrope"], stack: ', "Noto Serif Bengali", system-ui, sans-serif', varName: "--font-sans" },
  };
  // Families already requested by the <link> in index.html.
  var loadedFonts = {
    Marcellus: true, "Cormorant Garamond": true, "Pinyon Script": true,
    Montserrat: true, "Noto Serif Bengali": true,
  };

  function loadFont(family, weights) {
    if (loadedFonts[family]) return;
    loadedFonts[family] = true;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" +
      encodeURIComponent(family).replace(/%20/g, "+") +
      ":wght@" + weights + "&display=swap";
    document.head.appendChild(link);
  }

  if (cfg.fonts && typeof cfg.fonts === "object") {
    Object.keys(FONT_ROLES).forEach(function (role) {
      var pick = cfg.fonts[role];
      var def = FONT_ROLES[role];
      if (!pick || def.options.indexOf(pick) === -1) return;
      loadFont(pick, role === "sans" ? "300;400;500;600" : "400");
      root.style.setProperty(def.varName, '"' + pick + '"' + def.stack);
    });
  }

  // Keep the browser chrome in step with the chosen theme.
  function syncThemeColor() {
    var meta = $('meta[name="theme-color"]');
    if (!meta) return;
    var color = getComputedStyle(root).getPropertyValue("--bg-deep").trim();
    if (color) meta.setAttribute("content", color);
  }
  syncThemeColor();

  /* ============ 2. Text hydration ============ */
  function hydrateContent() {
    // Multi-slot attributes (blessing / initials / names appear more than once).
    [
      ["data-blessing", c.blessing],
      ["data-initials", c.couple.initials],
      ["data-name1", c.couple.name1],
      ["data-name2", c.couple.name2],
    ].forEach(function (pair) {
      if (pair[1] == null) return;
      $$("[" + pair[0] + "]").forEach(function (el) { el.textContent = pair[1]; });
    });

    var slots = {
      "data-date-display": c.dateDisplay,
      "data-city": c.city,
      "data-hero-eyebrow": c.heroEyebrow || "The Wedding of",
      "data-welcome-eyebrow": c.welcome.eyebrow,
      "data-parents1": c.welcome.parents1,
      "data-parents2": c.welcome.parents2,
      "data-invite-line": c.welcome.inviteLine,
      "data-epigraph": c.epigraph,
      "data-countdown-note": c.countdownNote,
      "data-venue-name": c.venue.name,
      "data-venue-address": (c.venue.address || ""),
      "data-closing": c.closing,
      "data-footer-names": c.couple.name1 + " " + t.nameSep + " " + c.couple.name2,
      "data-footer-date": L(formatDateShort()) + " \u00B7 " + c.city.replace(/,.*/, ""),
      "data-hashtag": c.couple.hashtag,
      "data-credit": c.credit,
      "data-intro-eyebrow": c.intro && c.intro.eyebrow,
      "data-intro-line": c.intro && c.intro.line,
      "data-intro-enter": c.intro && c.intro.enterLabel,
    };

    Object.keys(slots).forEach(function (attr) {
      if (slots[attr] == null) return;
      $$("[" + attr + "]").forEach(function (el) { el.textContent = slots[attr]; });
    });

    // Hide the epigraph slot entirely when left empty.
    var epi = $("[data-epigraph]");
    if (epi) epi.hidden = !c.epigraph;

    // Document title & social meta follow the couple and the language.
    var title = c.couple.name1 + " " + t.nameSep + " " + c.couple.name2 + " \u2014 " + t.documentTitleSuffix;
    document.title = title;
    var ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
  }

  // Footer social icons: hrefs come from cfg.social; a fully empty
  // block hides the icon row (the credit line stays on its own).
  // Language-independent, so this runs once.
  var socialsWrap = $("[data-socials]");
  if (socialsWrap) {
    var socialMap = cfg.social || {};
    $$("[data-social]", socialsWrap).forEach(function (a) {
      var url = socialMap[a.getAttribute("data-social")];
      if (url) {
        a.setAttribute("href", url);
        a.hidden = false;
      } else {
        a.remove();
      }
    });
    if (!socialsWrap.querySelector("a")) socialsWrap.hidden = true;
  }

  // Swap every language-dependent piece of the page in one pass.
  function applyLanguage() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n")];
      if (typeof v === "string") el.textContent = v;
    });
    $$("[data-i18n-html]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-html")];
      if (typeof v === "string") el.innerHTML = v;
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-aria")];
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });
    $$("[data-i18n-title]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-title")];
      if (typeof v === "string") el.setAttribute("title", v);
    });
    $$("[data-i18n-ph]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-ph")];
      if (typeof v === "string") el.setAttribute("placeholder", v);
    });
    var toastEl = $("#toast");
    if (toastEl) toastEl.textContent = t.linkCopied;
    hydrateContent();
    renderStory();
    renderEvents();
    renderGallery();
    renderCustomSections();
    if (typeof refreshRsvp === "function") refreshRsvp();
    syncMusicLabel();
    updateToggleUI();
    initLetters();
    // Re-render countdown digits immediately (e.g. ৪২ vs 42); no-op before
    // the countdown module has initialised.
    if (typeof refreshCountdown === "function") refreshCountdown();
  }

  function formatDateShort() {
    // "19 · 03 · 2027" from weddingDateTime (venue-local via manual parse).
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(c.weddingDateTime);
    return m ? m[3] + " \u00B7 " + m[2] + " \u00B7 " + m[1] : "";
  }

  /* ============ 3. Cinematic opening ============ */
  // Choreography (kept brief — the page is interactive again in ~0.45s):
  //   t=0      guest taps → music starts, content bows out, seam blooms
  //   t≈430ms  the two veils part and scrolling unlocks; the hero's own
  //            entrance begins in step (its delays carry the ceremony:
  //            blessing → monogram → names letter-by-letter → rule →
  //            date → place → frame → corners)
  //   t≈2.05s  the overlay is dropped entirely
  (function initIntro() {
    if (!introEl) return;
    if (!introActive) {
      introEl.classList.add("is-done");
      document.body.classList.add("intro-done");
      return;
    }

    document.body.classList.add("is-locked");
    var openBtn = $("#introOpen");

    function open() {
      if (introEl.classList.contains("is-opening")) return; // ignore double taps
      introEl.classList.add("is-opening");
      if (typeof musicKick === "function") musicKick();

      setTimeout(function () {
        introEl.classList.add("is-open");
        document.body.classList.remove("is-locked");
        // The hero starts hidden and enters while the curtains part —
        // otherwise it would show through the gap fully formed.
        document.body.classList.add("intro-done");
      }, 430);

      setTimeout(function () {
        introEl.classList.add("is-done");
        // Hand focus into the page now that the invitation is open.
        var main = $("#invite");
        if (main) {
          main.setAttribute("tabindex", "-1");
          try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
        }
      }, 2050);
    }

    if (openBtn) openBtn.addEventListener("click", open);
  })();

  /* ============ 4. Hero letter reveal ============ */
  function initLetters() {
    $$(".hero__name").forEach(function (el) {
      // Bangla conjuncts and vowel signs break when split into per-character
      // spans (shaping does not cross element boundaries) — keep those whole.
      if (reduced || lang === "bn") return;
      var text = el.textContent;
      el.textContent = "";
      var i = 0;
      for (var idx = 0; idx < text.length; idx++) {
        var span = document.createElement("span");
        var ch = text.charAt(idx);
        if (ch === " ") {
          span.className = "ltr ltr--sp";
        } else {
          span.className = "ltr";
          span.textContent = ch;
          span.style.setProperty("--i", i++);
        }
        el.appendChild(span);
      }
    });
  }

  /* ============ 5. Story timeline ============ */
  var storyList = $("#storyList");

  function renderStory() {
    if (!storyList || !c.story || !c.story.chapters || !c.story.chapters.length) return;
    var storyHead = {
      eyebrow: $(".story .eyebrow"),
      title: $(".story .section-title"),
    };
    if (storyHead.eyebrow) storyHead.eyebrow.textContent = c.story.eyebrow;
    if (storyHead.title) {
      storyHead.title.innerHTML =
        esc(c.story.title || "Our") + " <em>" + esc(c.story.titleAccent || "Story") + "</em>";
    }
    $$(".chapter", storyList).forEach(function (el) { el.remove(); });
    storyList.insertAdjacentHTML("beforeend", c.story.chapters.map(function (ch) {
      return (
        '<article class="chapter reveal">' +
        '<span class="chapter__dot" aria-hidden="true"></span>' +
        (ch.label ? '<p class="chapter__label">' + esc(ch.label) + "</p>" : "") +
        '<h3 class="chapter__title">' + esc(ch.title) + "</h3>" +
        '<p class="chapter__text">' + esc(ch.text) + "</p>" +
        "</article>"
      );
    }).join(""));
    $$(".chapter", storyList).forEach(observeReveal);
  }

  // Gently illuminate the chapter the guest is reading: whichever
  // chapter's centre sits nearest the middle of the viewport (rAF-gated).
  (function initStoryFocus() {
    if (!storyList || reduced) return;
    var picking = false;
    function pickActive() {
      picking = false;
      var chapters = $$(".chapter", storyList);
      var vh = window.innerHeight;
      var best = null, bestDist = Infinity;
      chapters.forEach(function (ch) {
        var r = ch.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < bestDist) { bestDist = d; best = ch; }
      });
      chapters.forEach(function (ch) { ch.classList.toggle("is-active", ch === best); });
    }
    window.addEventListener("scroll", function () {
      if (!picking) { picking = true; requestAnimationFrame(pickActive); }
    }, { passive: true });
    pickActive();
  })();

  /* ============ 6. Event cards ============ */
  var ICONS = {
    date: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path pathLength="1" d="M3 10h18"/><path pathLength="1" d="M8 3v4"/><path pathLength="1" d="M16 3v4"/></svg>',
    time: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18Z"/><path pathLength="1" d="M12 7v5l3.5 1.5"/></svg>',
    pin: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><path pathLength="1" d="M9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z"/></svg>',
  };

  var list = $("#eventList");

  function renderEvents() {
    if (!list) return;
    if (!c.events || !c.events.length) { list.innerHTML = ""; return; }
    // Cards that were already revealed stay visible on a language swap.
    var cards = $$(".event-card", list);
    var alreadyIn = cards.length > 0 && cards.every(function (el) {
      return el.classList.contains("is-in");
    });
    list.innerHTML = c.events.map(renderEvent).join("");
    $$(".event-card", list).forEach(function (el) {
      if (alreadyIn) el.classList.add("is-in");
      else observeReveal(el);
    });
  }

  function renderEvent(ev) {
    var mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.mapQuery || ev.venue || "");
    var calUrl = buildCalendarUrl(ev);
    return (
      '<article class="event-card reveal">' +
      '<p class="event-card__tag">' + esc(ev.tag) + "</p>" +
      '<h3 class="event-card__name">' + esc(ev.name) + "</h3>" +
      (ev.tagline ? '<p class="event-card__tagline">' + esc(ev.tagline) + "</p>" : "") +
      '<div class="event-card__divider" aria-hidden="true"></div>' +
      '<dl class="event-card__rows">' +
      row(ICONS.date, t.labelDate, ev.date) +
      row(ICONS.time, t.labelTime, ev.time) +
      row(ICONS.pin, t.labelVenue, ev.venue) +
      (ev.address ? row('<span class="row__dot" aria-hidden="true"></span>', t.labelAddress, ev.address) : "") +
      "</dl>" +
      '<div class="event-card__actions">' +
      '<a class="link-btn" href="' + mapUrl + '" target="_blank" rel="noopener">' + esc(t.viewOnMap) + "</a>" +
      (calUrl ? '<a class="link-btn link-btn--calendar" href="' + calUrl + '" target="_blank" rel="noopener">' + esc(t.addToCalendar) + "</a>" : "") +
      "</div></article>"
    );
  }

  function row(icon, label, value) {
    return '<div class="row"><dt>' + icon + "<span>" + label + "</span></dt><dd>" + esc(value) + "</dd></div>";
  }

  function buildCalendarUrl(ev) {
    if (!ev.calDate || !ev.calStart || !ev.calEnd) return "";
    var start = ev.calDate.replace(/-/g, "") + "T" + ev.calStart.replace(":", "") + "00";
    var end = ev.calDate.replace(/-/g, "") + "T" + ev.calEnd.replace(":", "") + "00";
    var params = {
      action: "TEMPLATE",
      text: c.couple.name1 + " " + t.nameSep + " " + c.couple.name2 + " \u2014 " + ev.name,
      dates: start + "/" + end,
      details: t.calendarDetails.replace("{hashtag}", c.couple.hashtag),
      location: [ev.venue, ev.address].filter(Boolean).join(", "),
    };
    if (ev.calTz) params.ctz = ev.calTz;
    return "https://calendar.google.com/calendar/render?" + Object.keys(params)
      .map(function (k) { return k + "=" + encodeURIComponent(params[k]); })
      .join("&");
  }

  /* ============ 7. Gallery + lightbox ============ */
  var galleryGrid = $("#galleryGrid");

  function currentPhotos() {
    return (c.gallery && c.gallery.photos) || [];
  }

  function renderGallery() {
    var photos = currentPhotos();
    if (!galleryGrid || !photos.length) return;
    var gHead = { eyebrow: $(".gallery .eyebrow"), title: $(".gallery .section-title") };
    if (gHead.eyebrow) gHead.eyebrow.textContent = c.gallery.eyebrow;
    if (gHead.title) {
      gHead.title.innerHTML =
        esc(c.gallery.title || "Our") + " <em>" + esc(c.gallery.titleAccent || "Gallery") + "</em>";
    }
    galleryGrid.innerHTML = photos.map(function (p, i) {
      var cls = "g-photo reveal" + (p.wide ? " g-photo--wide" : "") + (p.tall ? " g-photo--tall" : "");
      var label = t.viewPhoto.replace("{name}", p.alt || p.caption || "photo");
      return (
        '<button class="' + cls + '" type="button" ' +
        'data-index="' + i + '" aria-label="' + esc(label) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || "") + '" loading="lazy" decoding="async" />' +
        (p.caption ? '<span class="g-photo__cap">' + esc(p.caption) + "</span>" : "") +
        "</button>"
      );
    }).join("");
    $$(".g-photo", galleryGrid).forEach(observeReveal);
  }

  (function initLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;

    var img = $("#lbImg"), cap = $("#lbCaption"), count = $("#lbCount");
    var current = 0;
    var lastFocus = null;

    function render() {
      var photos = currentPhotos();
      var p = photos[current] || {};
      img.src = p.src || "";
      img.alt = p.alt || "";
      cap.textContent = p.caption || "";
      count.textContent = L(current + 1) + " / " + L(photos.length);
      // Replay the gentle zoom-in on each photo.
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    }

    function open(i) {
      current = i;
      render();
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      void lb.offsetWidth; // force a frame so the fade transition runs
      lb.classList.add("is-open");
      $("#lbClose").focus();
    }

    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { lb.hidden = true; }, 320);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(d) {
      var total = currentPhotos().length;
      if (!total) return;
      current = (current + d + total) % total;
      render();
    }

    // Delegated so gallery tiles re-rendered on a language swap keep working.
    if (galleryGrid) {
      galleryGrid.addEventListener("click", function (e) {
        var btn = e.target.closest(".g-photo");
        if (btn) open(parseInt(btn.getAttribute("data-index"), 10) || 0);
      });
    }

    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", function () { step(-1); });
    $("#lbNext").addEventListener("click", function () { step(1); });

    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    // Touch swipe
    var touchX = null;
    lb.addEventListener("touchstart", function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  })();

  /* ============ 7b. Custom sections (the Luxury signature) ============ */
  function renderCustomSections() {
    var wrap = $("#customSections");
    var sections = (c.customSections || []).filter(function (s) { return s && s.layout; });
    if (!wrap) return;
    if (!sections.length) { wrap.remove(); return; }

    wrap.innerHTML = sections.map(function (s) {
      switch (s.layout) {
        case "quote":
          return (
            '<section class="custom__section custom__section--quote reveal">' +
            '<span class="custom__quote-mark" aria-hidden="true">\u201C</span>' +
            '<p class="custom__quote">' + esc(s.quote || "") + "</p>" +
            (s.source ? '<p class="custom__quote-source">' + esc(s.source) + "</p>" : "") +
            "</section>"
          );
        case "text":
          return (
            '<section class="custom__section custom__section--text reveal">' +
            head(s) +
            (s.text ? '<p class="custom__body">' + esc(s.text) + "</p>" : "") +
            (s.note ? '<p class="custom__note">' + esc(s.note) + "</p>" : "") +
            "</section>"
          );
        case "cards":
          return (
            '<section class="custom__section custom__section--cards reveal">' +
            head(s) +
            (s.note ? '<p class="custom__note">' + esc(s.note) + "</p>" : "") +
            '<div class="c-cards">' +
            (s.cards || []).map(function (card) {
              return (
                '<div class="c-card reveal">' +
                (card.kicker ? '<p class="c-card__kicker">' + esc(card.kicker) + "</p>" : "") +
                (card.title ? '<h3 class="c-card__title">' + esc(card.title) + "</h3>" : "") +
                (card.text ? '<p class="c-card__text">' + esc(card.text) + "</p>" : "") +
                (card.swatches && card.swatches.length
                  ? '<div class="c-card__swatches" aria-hidden="true">' +
                    card.swatches.map(function (hex) { return '<i style="background:' + esc(hex) + '"></i>'; }).join("") +
                    "</div>"
                  : "") +
                "</div>"
              );
            }).join("") +
            "</div></section>"
          );
        case "faq":
          return (
            '<section class="custom__section custom__section--faq reveal">' +
            head(s) +
            '<div class="faq">' +
            (s.items || []).map(function (item, i) {
              return (
                '<div class="faq__item reveal">' +
                '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faqA' + i + '">' +
                "<span>" + esc(item.q) + "</span>" +
                '<span class="faq__q-icon" aria-hidden="true"></span>' +
                "</button>" +
                '<div class="faq__a" id="faqA' + i + '" role="region">' +
                '<p class="faq__a-inner">' + esc(item.a) + "</p>" +
                "</div></div>"
              );
            }).join("") +
            "</div></section>"
          );
        default:
          return "";
      }
    }).join("");

    function head(s) {
      return (
        (s.eyebrow ? '<p class="eyebrow eyebrow--gold">' + esc(s.eyebrow) + "</p>" : "") +
        (s.title ? '<h2 class="section-title">' + esc(s.title) +
          (s.titleAccent ? " <em>" + esc(s.titleAccent) + "</em>" : "") + "</h2>" : "")
      );
    }

    // Accordion behaviour (height animated via scrollHeight).
    $$(".faq__q", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var ans = item.querySelector(".faq__a");
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : "";
      });
    });

    injectFlourishes(wrap);
    $$(".reveal", wrap).forEach(observeReveal);
  }

  /* ============ 8. Map ============ */
  var mapFrame = $("#venueMap");
  if (mapFrame && cfg.venue.mapQuery) {
    var zoom = cfg.venue.mapZoom || 15;
    mapFrame.src =
      "https://maps.google.com/maps?q=" + encodeURIComponent(cfg.venue.mapQuery) +
      "&z=" + zoom + "&output=embed";
  }
  $$("[data-directions]").forEach(function (a) {
    if (cfg.venue.mapQuery) {
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cfg.venue.mapQuery);
    }
  });

  /* ============ 9. Countdown (with flip) ============ */
  var target = new Date(cfg.weddingDateTime).getTime();
  var cd = {
    d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMinutes"), s: $("#cdSeconds"),
  };

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function setNum(el, val) {
    if (!el || el.textContent === val) return;
    el.textContent = val;
    if (reduced) return;
    el.classList.remove("is-tick");
    void el.offsetWidth; // restart the flip animation
    el.classList.add("is-tick");
  }

  function tick() {
    var diff = target - Date.now();
    if (isNaN(target)) return;
    setNum(cd.d, diff <= 0 ? L("00") : L(pad(Math.floor(diff / 864e5))));
    setNum(cd.h, diff <= 0 ? L("00") : L(pad(Math.floor(diff / 36e5) % 24)));
    setNum(cd.m, diff <= 0 ? L("00") : L(pad(Math.floor(diff / 6e4) % 60)));
    setNum(cd.s, diff <= 0 ? L("00") : L(pad(Math.floor(diff / 1e3) % 60)));
  }
  refreshCountdown = tick;
  tick();
  setInterval(tick, 1000);

  /* ============ 10. Background music ============ */
  (function initMusic() {
    var btn = $("#musicBtn");
    if (!btn || !cfg.music || !cfg.music.enabled || !cfg.music.src) return;

    var audio = new Audio(cfg.music.src);
    audio.loop = true;
    audio.preload = "auto";

    var fading = null;

    function fadeTo(vol, done) {
      if (fading) clearInterval(fading);
      var from = audio.volume, t = 0, steps = 20, dur = 700;
      fading = setInterval(function () {
        t += 1;
        audio.volume = Math.min(1, Math.max(0, from + (vol - from) * (t / steps)));
        if (t >= steps) {
          clearInterval(fading);
          fading = null;
          if (done) done();
        }
      }, dur / steps);
    }

    function play() {
      var p = audio.play();
      if (p && p.catch) p.catch(function () { /* still blocked; user can tap the button */ });
      audio.volume = 0;
      fadeTo(0.55);
      btn.classList.add("is-playing");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", t.musicPause);
    }

    function pause() {
      fadeTo(0, function () { audio.pause(); });
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", t.musicPlay);
    }

    // Only reveal the control once we know the track loads.
    audio.addEventListener("canplaythrough", function () { btn.hidden = false; }, { once: true });
    audio.addEventListener("error", function () { btn.hidden = true; }, { once: true });
    audio.load();

    btn.addEventListener("click", function () {
      if (audio.paused) play();
      else pause();
    });

    if (cfg.music.autoplay && !reduced) {
      if (introActive) {
        // The tap that opens the curtain starts the soundtrack.
        musicKick = play;
      } else {
        // Browsers block silent autoplay — start on the guest's first gesture.
        var startOnce = function () {
          if (audio.paused) play();
          window.removeEventListener("pointerdown", startOnce);
          window.removeEventListener("keydown", startOnce);
        };
        window.addEventListener("pointerdown", startOnce);
        window.addEventListener("keydown", startOnce);
      }
    }

    // Pause politely when the tab is hidden.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && !audio.paused) pause();
    });
  })();

  // Keep the music button's label in the current language.
  function syncMusicLabel() {
    var btn = $("#musicBtn");
    if (!btn) return;
    btn.setAttribute("aria-label", btn.getAttribute("aria-pressed") === "true" ? t.musicPause : t.musicPlay);
  }

  /* ============ 11. RSVP ============ */
  (function initRsvp() {
    var section = $(".rsvp");
    var form = $("#rsvpForm");
    var done = $("#rsvpDone");
    if (!form) return;
    if (!c.rsvp || !c.rsvp.enabled) {
      if (section) section.style.display = "none";
      return;
    }

    var noteEl = $("[data-rsvp-note]");
    var successEl = $("[data-rsvp-success]");
    var eventsWrap = $("#rsvpEvents");
    var guestsWrap = $("#rsvpGuestsWrap");
    var eventsWrapField = $("#rsvpEventsWrap");

    // Language-dependent copy, re-rendered on every language swap.
    function renderRsvp() {
      if (noteEl && c.rsvp.note) {
        noteEl.textContent = String(c.rsvp.note).replace("{deadline}", c.rsvp.deadline || "");
      }
      if (successEl && c.rsvp.successNote) successEl.textContent = c.rsvp.successNote;
      // Event checkboxes from the same config that renders the cards.
      if (eventsWrap && c.events && c.events.length) {
        eventsWrap.innerHTML = c.events.map(function (ev, i) {
          return (
            '<label class="choice__opt">' +
            '<input type="checkbox" name="events" value="' + esc(ev.name) + '" ' + (i === 0 ? "" : "checked") + ' />' +
            "<span>" + esc(ev.name) + "</span>" +
            "</label>"
          );
        }).join("");
      }
    }
    refreshRsvp = renderRsvp;
    renderRsvp();

    function syncAttendance() {
      var attending = (form.querySelector('input[name="attending"]:checked') || {}).value === "yes";
      if (guestsWrap) guestsWrap.hidden = !attending;
      if (eventsWrapField) eventsWrapField.hidden = !attending;
    }
    $$('input[name="attending"]', form).forEach(function (r) {
      r.addEventListener("change", syncAttendance);
    });
    syncAttendance();

    function collect() {
      return {
        couple: c.couple.name1 + " " + t.nameSep + " " + c.couple.name2,
        name: ($("#rsvpName") || {}).value || "",
        attending: (form.querySelector('input[name="attending"]:checked') || {}).value || "yes",
        guests: ($("#rsvpGuests") || {}).value || "",
        events: $$('input[name="events"]:checked', form).map(function (el) { return el.value; }),
        message: ($("#rsvpMessage") || {}).value || "",
      };
    }

    function whatsappUrl(data) {
      var count = L(data.guests) + " " + (data.guests === "1" ? t.guestSingular : t.guestPlural);
      var lines = [
        t.rsvpWhatsappHeader.replace("{couple}", data.couple),
        t.rsvpNameLine.replace("{name}", data.name),
        data.attending === "yes"
          ? t.rsvpAttendingYes.replace("{guests}", count)
          : t.rsvpAttendingNo,
      ];
      if (data.attending === "yes" && data.events.length) {
        lines.push(t.rsvpEventsLine.replace("{events}", data.events.join(", ")));
      }
      if (data.message.trim()) lines.push(t.rsvpMessageLine.replace("{message}", data.message.trim()));
      return "https://wa.me/" + c.rsvp.whatsapp.replace(/[^\d]/g, "") +
        "?text=" + encodeURIComponent(lines.join("\n"));
    }

    function showDone(msg) {
      if (successEl && msg) successEl.textContent = msg;
      form.hidden = true;
      done.hidden = false;
      done.classList.add("reveal", "is-in");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameEl = $("#rsvpName");
      if (!nameEl.value.trim()) {
        nameEl.focus();
        nameEl.reportValidity && nameEl.reportValidity();
        return;
      }

      var data = collect();
      var submitBtn = $("#rsvpSubmit");
      if (submitBtn) submitBtn.disabled = true;

      // Reserve the WhatsApp tab during the submit gesture. Opening it only
      // after an endpoint failure is asynchronous and is blocked by browsers.
      var whatsappWindow = c.rsvp.endpoint && c.rsvp.whatsapp
        ? window.open("", "_blank") : null;
      if (whatsappWindow) whatsappWindow.opener = null;

      var finish = function (msg) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-sending");
        }
        showDone(msg);
      };

      if (c.rsvp.endpoint) {
        if (submitBtn) submitBtn.classList.add("is-sending");
        fetch(c.rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
          })
          .then(function () {
            if (whatsappWindow) whatsappWindow.close();
            finish(c.rsvp.successNote);
          })
          .catch(function () {
            if (c.rsvp.whatsapp) {
              if (whatsappWindow) whatsappWindow.location.href = whatsappUrl(data);
              else window.open(whatsappUrl(data), "_blank", "noopener");
              finish(t.rsvpWhatsappOpened);
            } else {
              if (whatsappWindow) whatsappWindow.close();
              finish(t.rsvpError);
            }
          });
        return;
      }

      if (c.rsvp.whatsapp) {
        window.open(whatsappUrl(data), "_blank", "noopener");
        finish(t.rsvpWhatsappOpened);
        return;
      }

      finish(c.rsvp.successNote);
    });
  })();

  /* ============ 12. Share ============ */
  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  /* Channels — compose prefilled links from the invitation data. No backend:
     copy has a legacy-http fallback; the rest open the target app directly. */
  var enc = encodeURIComponent;
  function inviteText() {
    return t.shareText
      .replace("{names}", c.couple.name1 + " " + t.nameSep + " " + c.couple.name2)
      .replace("{date}", c.dateDisplay)
      .replace("{city}", c.city);
  }
  var shareUrl = location.origin === "null" || location.protocol === "file:"
    ? "https://your-invite-link.example"
    : location.href;

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(t.linkCopied);
    } catch (e) {
      showToast(text);
    }
    document.body.removeChild(ta);
  }

  function copyLink() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        function () { showToast(t.linkCopied); },
        function () { fallbackCopy(shareUrl); }
      );
      return;
    }
    fallbackCopy(shareUrl);
  }

  var shareChannels = {
    copy: copyLink,
    whatsapp: function () {
      window.open("https://wa.me/?text=" + enc(inviteText() + "\n" + shareUrl), "_blank", "noopener");
    },
    /* shortcut: the deep link only opens the Messenger app (mobile); the
       desktop web dialog needs a registered Facebook app ID */
    messenger: function () {
      window.open("fb-messenger://share/?link=" + enc(shareUrl), "_blank", "noopener");
    },
    telegram: function () {
      window.open("https://t.me/share/url?url=" + enc(shareUrl) + "&text=" + enc(inviteText()), "_blank", "noopener");
    },
    email: function () {
      location.href = "mailto:?subject=" + enc(inviteText()) + "&body=" + enc(inviteText() + "\n" + shareUrl);
    },
  };

  var sharePairs = [];

  ["#shareBtn", "#shareFab"].forEach(function (sel) {
    var btn = $(sel);
    var menu = btn ? document.getElementById(btn.getAttribute("aria-controls") || "") : null;
    if (!btn || !menu) return;

    menu.hidden = false; /* JS is healthy — the .open class takes over from [hidden] */

    function setOpen(open) {
      menu.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    btn.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });

    /* Clicks elsewhere close the menu. */
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") &&
          !menu.contains(e.target) &&
          e.target.closest("[data-share-button]") !== btn) setOpen(false);
    });

    Object.keys(shareChannels).forEach(function (key) {
      var channelBtn = menu.querySelector('[data-share="' + key + '"]');
      if (!channelBtn) return;
      channelBtn.addEventListener("click", function () {
        if (key === "copy") {
          copyLink();
          /* Confirm on the button itself */
          var original = channelBtn.textContent;
          channelBtn.textContent = t.copied;
          setTimeout(function () { channelBtn.textContent = original; }, 1600);
        } else {
          shareChannels[key]();
          setOpen(false);
        }
      });
    });

    sharePairs.push({ button: btn, menu: menu, setOpen: setOpen });
  });

  /* Escape closes every open share menu. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    sharePairs.forEach(function (p) {
      if (p.menu.classList.contains("open")) { p.setOpen(false); p.button.focus(); }
    });
  });

  /* Floating share pill appears after hero */
  var fab = $("#shareFab");
  var hero = $(".hero");
  var floatWrap = fab ? fab.closest(".float-share") : null;
  if (floatWrap && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        floatWrap.classList.toggle("is-visible", !e.isIntersecting);
      });
    }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
  } else if (floatWrap) {
    floatWrap.classList.add("is-visible");
  }

  /* ============ 13. FX: dust · rail · parallax · reveals · progress ============ */

  // Rising gold dust in the hero.
  (function initDust() {
    var wrap = $("#heroDust");
    if (!wrap || reduced) return;
    var count = window.innerWidth < 560 ? 10 : 16;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var d = document.createElement("span");
      d.className = "dust";
      d.style.setProperty("--x", (Math.random() * 96 + 2).toFixed(1) + "%");
      d.style.setProperty("--s", (Math.random() * 5 + 3).toFixed(1) + "px");
      d.style.setProperty("--t", (Math.random() * 14 + 14).toFixed(1) + "s");
      d.style.setProperty("--d", "-" + (Math.random() * 20).toFixed(1) + "s");
      d.style.setProperty("--dx", (Math.random() * 110 - 55).toFixed(0) + "px");
      d.style.setProperty("--o", (Math.random() * 0.45 + 0.3).toFixed(2));
      frag.appendChild(d);
    }
    wrap.appendChild(frag);
  })();

  // One rAF-gated scroll handler drives the progress bar, the story rail
  // and the hero parallax together.
  (function initScrollFx() {
    var bar = $("#progressBar");
    var rail = $("#storyRail");
    var timeline = $(".story__timeline");
    var vignette = $(".hero__vignette");
    var frame = $(".hero__frame");

    if (reduced) {
      // Rail stands full-height (body.reduced); progress bar is hidden by CSS.
      return;
    }

    var ticking = false;
    var scrollCue = $(".hero__scroll");

    // A bead of light rides the tip of the drawing story rail.
    var comet = null;
    if (rail && timeline) {
      comet = document.createElement("span");
      comet.className = "rail-comet";
      comet.setAttribute("aria-hidden", "true");
      timeline.appendChild(comet);
    }

    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      var vh = window.innerHeight;
      var doc = document.documentElement;

      // Scroll progress
      if (bar) {
        var max = (doc.scrollHeight - vh) || 1;
        bar.style.transform = "scaleX(" + Math.min(1, y / max).toFixed(4) + ")";
      }

      // The scroll cue bows out once the guest starts moving.
      if (scrollCue) scrollCue.classList.toggle("is-hidden", y > 60);

      // Story rail draws as the guest reads
      if (rail && timeline) {
        var rect = timeline.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (vh * 0.72 - rect.top) / rect.height));
        rail.style.transform = "scaleY(" + p.toFixed(4) + ")";
        if (comet) {
          // Rail spans top:8 to bottom:8; park the bead on its live tip.
          comet.style.top = (8 + p * (rect.height - 16) - 3.5).toFixed(1) + "px";
          comet.classList.toggle("is-on", p > 0.004);
        }
      }

      // Hero parallax — only while the hero is on screen
      if (y < vh * 1.2) {
        if (vignette) vignette.style.transform = "translate3d(0," + (y * 0.16).toFixed(1) + "px,0)";
        if (frame) frame.style.transform = "translate3d(0," + (y * 0.08).toFixed(1) + "px,0)";
      }
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  })();

  // Staggered reveal-on-scroll.

  /* The signature divider, matching the welcome ornament: two gold
     strokes parting around a floating diamond. Injected beneath every
     section title (pathLength="1" keeps the dash maths exact) and
     hard-coded above the welcome eyebrow. */
  var FLOURISH =
    '<svg class="flourish" viewBox="0 0 200 20" aria-hidden="true">' +
    '<path class="fl__line" pathLength="1" d="M80 10H0"/>' +
    '<path class="fl__line" pathLength="1" d="M120 10h80"/>' +
    '<path class="fl__gem" d="M100 4.34 105.66 10 100 15.66 94.34 10Z"/>' +
    '</svg>';

  function injectFlourishes(rootScope) {
    (rootScope || document).querySelectorAll(".section-title").forEach(function (el) {
      if (el.nextElementSibling && el.nextElementSibling.classList.contains("flourish")) return;
      el.insertAdjacentHTML("afterend", FLOURISH);
      var flourish = el.nextElementSibling;
      if (flourish) {
        flourish.classList.add("reveal");
        observeReveal(flourish);
      }
    });
  }

  // Before initReveals runs, dynamic content is picked up by its final
  // $$(".reveal") sweep; after that, new nodes are observed on demand.
  function observeReveal(el) {
    if (!revealReady) return;
    if (!revealIO) { el.classList.add("is-in"); return; }
    revealIO.observe(el);
  }

  (function initReveals() {
    injectFlourishes(document);

    var selectors = [
      ".welcome", ".countdown__panel", ".chapter", ".event-card",
      ".g-photo", ".venue__info", ".venue__frame", ".rsvp__panel",
      ".custom__section", ".c-card", ".faq__item", ".footer__inner",
      ".flourish",
      ".story .eyebrow", ".story .section-title",
      ".events .eyebrow", ".events .section-title",
      ".gallery .eyebrow", ".gallery .section-title",
    ];
    if ("IntersectionObserver" in window && !reduced) {
      // Measure the etched panels' frames so their borders can draw around.
      $$(".frame-trace rect").forEach(function (r) {
        var len = 9999;
        try { len = Math.ceil(r.getTotalLength()); } catch (e) { /* keep fallback */ }
        r.style.setProperty("--len", String(len));
      });
      selectors.forEach(function (sel) {
        $$(sel).forEach(function (el) { el.classList.add("reveal"); });
      });
      // Stagger siblings inside each group.
      [".chapter", ".event-card", ".g-photo", ".c-card", ".faq__item"].forEach(function (sel) {
        $$(sel).forEach(function (el, i) {
          el.style.transitionDelay = Math.min(i % 4, 3) * 90 + "ms";
        });
      });
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            revealIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      $$(".reveal").forEach(function (el) { revealIO.observe(el); });
    } else {
      $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    }
    revealReady = true;
  })();

  /* ============ 14. Language toggle (EN / বাংলা) ============ */
  var langToggle = $("#langToggle");

  function updateToggleUI() {
    if (!langToggle) return;
    var enOpt = langToggle.querySelector("[data-lang-opt='en']");
    var bnOpt = langToggle.querySelector("[data-lang-opt='bn']");
    if (enOpt) enOpt.classList.toggle("is-active", lang === "en");
    if (bnOpt) bnOpt.classList.toggle("is-active", lang === "bn");
    langToggle.setAttribute("aria-label", t.switchTo);
  }

  if (langToggle) {
    if (bnAvailable) {
      langToggle.addEventListener("click", function () {
        setLang(lang === "bn" ? "en" : "bn", true);
      });
    } else {
      // No Bangla content configured — hide the toggle, English-only site.
      langToggle.hidden = true;
    }
  }

  // Render the page in the visitor's language (default English).
  setLang(initialLang(), false);
})();
