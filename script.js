/* ============================================================
   Luxury Wedding Invitation — behaviour
   All content comes from INVITE_CONFIG (config.js).

   1. Theme · palette · custom fonts        8. Map
   2. Text hydration                        9. Countdown (flip)
   3. Cinematic opening                    10. Background music
   4. Hero letter reveal                   11. RSVP form
   5. Story timeline (scroll-drawn rail)   12. Share
   6. Event cards                          13. FX: dust · parallax · grain ·
   7. Gallery + lightbox + custom sections     comet · traces · flourishes
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
    var c = getComputedStyle(root).getPropertyValue("--bg-deep").trim();
    if (c) meta.setAttribute("content", c);
  }
  syncThemeColor();

  /* ============ 2. Text hydration ============ */
  // Multi-slot attributes (blessing / initials / names appear more than once).
  ["data-blessing", "data-initials", "data-name1", "data-name2"].forEach(function (attr) {
    var val = attr === "data-blessing" ? cfg.blessing
      : attr === "data-initials" ? cfg.couple.initials
      : attr === "data-name1" ? cfg.couple.name1
      : cfg.couple.name2;
    if (val == null) return;
    $$("[" + attr + "]").forEach(function (el) { el.textContent = val; });
  });

  var slots = {
    "data-date-display": cfg.dateDisplay,
    "data-city": cfg.city,
    "data-hero-eyebrow": cfg.heroEyebrow || "The Wedding of",
    "data-welcome-eyebrow": cfg.welcome.eyebrow,
    "data-parents1": cfg.welcome.parents1,
    "data-parents2": cfg.welcome.parents2,
    "data-invite-line": cfg.welcome.inviteLine,
    "data-epigraph": cfg.epigraph,
    "data-countdown-note": cfg.countdownNote,
    "data-venue-name": cfg.venue.name,
    "data-venue-address": (cfg.venue.address || ""),
    "data-closing": cfg.closing,
    "data-footer-names": cfg.couple.name1 + " & " + cfg.couple.name2,
    "data-footer-date": formatDateShort() + " \u00B7 " + cfg.city.replace(", Bangladesh", "").replace(/,.*/, ""),
    "data-hashtag": cfg.couple.hashtag,
    "data-credit": cfg.credit,
    "data-intro-eyebrow": cfg.intro && cfg.intro.eyebrow,
    "data-intro-line": cfg.intro && cfg.intro.line,
    "data-intro-enter": cfg.intro && cfg.intro.enterLabel,
  };

  Object.keys(slots).forEach(function (attr) {
    if (slots[attr] == null) return;
    $$("[" + attr + "]").forEach(function (el) { el.textContent = slots[attr]; });
  });

  // Hide the epigraph slot entirely when left empty.
  if (!cfg.epigraph) {
    var epi = $("[data-epigraph]");
    if (epi) epi.hidden = true;
  }

  // Document title & social meta follow the couple.
  var title = cfg.couple.name1 + " & " + cfg.couple.name2 + " \u2014 Wedding Invitation";
  document.title = title;
  var ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);

  function formatDateShort() {
    // "19 · 03 · 2027" from weddingDateTime (venue-local via manual parse).
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(cfg.weddingDateTime);
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
  (function initLetters() {
    if (reduced) return;
    $$(".hero__name").forEach(function (el) {
      var text = el.textContent;
      el.textContent = "";
      var i = 0;
      for (var c = 0; c < text.length; c++) {
        var span = document.createElement("span");
        var ch = text.charAt(c);
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
  })();

  /* ============ 5. Story timeline ============ */
  var storyList = $("#storyList");
  if (storyList && cfg.story && cfg.story.chapters && cfg.story.chapters.length) {
    var storyHead = {
      eyebrow: $(".story .eyebrow"),
      title: $(".story .section-title"),
    };
    if (storyHead.eyebrow) storyHead.eyebrow.textContent = cfg.story.eyebrow;
    if (storyHead.title) {
      storyHead.title.innerHTML =
        esc(cfg.story.title || "Our") + " <em>" + esc(cfg.story.titleAccent || "Story") + "</em>";
    }
    storyList.insertAdjacentHTML("beforeend", cfg.story.chapters.map(function (ch) {
      return (
        '<article class="chapter reveal">' +
        '<span class="chapter__dot" aria-hidden="true"></span>' +
        (ch.label ? '<p class="chapter__label">' + esc(ch.label) + "</p>" : "") +
        '<h3 class="chapter__title">' + esc(ch.title) + "</h3>" +
        '<p class="chapter__text">' + esc(ch.text) + "</p>" +
        "</article>"
      );
    }).join(""));
    // Remove the sample chapter baked into index.html.
    var sample = storyList.querySelector(".chapter:not(.reveal)");
    if (sample) sample.remove();

    // Gently illuminate the chapter the guest is reading: whichever
    // chapter's centre sits nearest the middle of the viewport (rAF-gated).
    if (!reduced) {
      var chapters = $$(".chapter", storyList);
      var picking = false;
      var pickActive = function () {
        picking = false;
        var vh = window.innerHeight;
        var best = null, bestDist = Infinity;
        chapters.forEach(function (c) {
          var r = c.getBoundingClientRect();
          if (r.bottom < -80 || r.top > vh + 80) return;
          var d = Math.abs(r.top + r.height / 2 - vh / 2);
          if (d < bestDist) { bestDist = d; best = c; }
        });
        chapters.forEach(function (c) { c.classList.toggle("is-active", c === best); });
      };
      window.addEventListener("scroll", function () {
        if (!picking) { picking = true; requestAnimationFrame(pickActive); }
      }, { passive: true });
      pickActive();
    }
  }

  /* ============ 6. Event cards ============ */
  var ICONS = {
    date: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path pathLength="1" d="M3 10h18"/><path pathLength="1" d="M8 3v4"/><path pathLength="1" d="M16 3v4"/></svg>',
    time: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18Z"/><path pathLength="1" d="M12 7v5l3.5 1.5"/></svg>',
    pin: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><path pathLength="1" d="M9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z"/></svg>',
  };

  var list = $("#eventList");
  if (list && cfg.events && cfg.events.length) {
    list.innerHTML = cfg.events.map(renderEvent).join("");
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
      row(ICONS.date, "Date", ev.date) +
      row(ICONS.time, "Time", ev.time) +
      row(ICONS.pin, "Venue", ev.venue) +
      (ev.address ? row('<span class="row__dot" aria-hidden="true"></span>', "Address", ev.address) : "") +
      "</dl>" +
      '<div class="event-card__actions">' +
      '<a class="link-btn" href="' + mapUrl + '" target="_blank" rel="noopener">View on Map <span class="link-btn__arrow" aria-hidden="true">\u2197</span></a>' +
      (calUrl ? '<a class="link-btn link-btn--calendar" href="' + calUrl + '" target="_blank" rel="noopener">Add to Calendar <span class="link-btn__arrow" aria-hidden="true">\u2197</span></a>' : "") +
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
      text: cfg.couple.name1 + " & " + cfg.couple.name2 + " \u2014 " + ev.name,
      dates: start + "/" + end,
      details: "We would be honoured by your presence. " + cfg.couple.hashtag,
      location: [ev.venue, ev.address].filter(Boolean).join(", "),
    };
    if (ev.calTz) params.ctz = ev.calTz;
    return "https://calendar.google.com/calendar/render?" + Object.keys(params)
      .map(function (k) { return k + "=" + encodeURIComponent(params[k]); })
      .join("&");
  }

  /* ============ 7. Gallery + lightbox ============ */
  var galleryGrid = $("#galleryGrid");
  var photos = (cfg.gallery && cfg.gallery.photos) || [];

  if (galleryGrid && photos.length) {
    var gHead = { eyebrow: $(".gallery .eyebrow"), title: $(".gallery .section-title") };
    if (gHead.eyebrow) gHead.eyebrow.textContent = cfg.gallery.eyebrow;
    if (gHead.title) {
      gHead.title.innerHTML =
        esc(cfg.gallery.title || "Our") + " <em>" + esc(cfg.gallery.titleAccent || "Gallery") + "</em>";
    }
    galleryGrid.innerHTML = photos.map(function (p, i) {
      var cls = "g-photo reveal" + (p.wide ? " g-photo--wide" : "") + (p.tall ? " g-photo--tall" : "");
      return (
        '<button class="' + cls + '" type="button" ' +
        'data-index="' + i + '" aria-label="View photo: ' + esc(p.alt || p.caption || "photo") + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || "") + '" loading="lazy" decoding="async" />' +
        (p.caption ? '<span class="g-photo__cap">' + esc(p.caption) + "</span>" : "") +
        "</button>"
      );
    }).join("");
  }

  (function initLightbox() {
    var lb = $("#lightbox");
    if (!lb || !photos.length) return;

    var img = $("#lbImg"), cap = $("#lbCaption"), count = $("#lbCount");
    var current = 0;
    var lastFocus = null;

    function render() {
      var p = photos[current] || {};
      img.src = p.src || "";
      img.alt = p.alt || "";
      cap.textContent = p.caption || "";
      count.textContent = (current + 1) + " / " + photos.length;
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
      current = (current + d + photos.length) % photos.length;
      render();
    }

    $$(".g-photo").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(parseInt(btn.getAttribute("data-index"), 10) || 0);
      });
    });

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
  (function initCustomSections() {
    var wrap = $("#customSections");
    var sections = (cfg.customSections || []).filter(function (s) { return s && s.layout; });
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
            (s.cards || []).map(function (c) {
              return (
                '<div class="c-card reveal">' +
                (c.kicker ? '<p class="c-card__kicker">' + esc(c.kicker) + "</p>" : "") +
                (c.title ? '<h3 class="c-card__title">' + esc(c.title) + "</h3>" : "") +
                (c.text ? '<p class="c-card__text">' + esc(c.text) + "</p>" : "") +
                (c.swatches && c.swatches.length
                  ? '<div class="c-card__swatches" aria-hidden="true">' +
                    c.swatches.map(function (hex) { return '<i style="background:' + esc(hex) + '"></i>'; }).join("") +
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
  })();

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
    setNum(cd.d, diff <= 0 ? "00" : pad(Math.floor(diff / 864e5)));
    setNum(cd.h, diff <= 0 ? "00" : pad(Math.floor(diff / 36e5) % 24));
    setNum(cd.m, diff <= 0 ? "00" : pad(Math.floor(diff / 6e4) % 60));
    setNum(cd.s, diff <= 0 ? "00" : pad(Math.floor(diff / 1e3) % 60));
  }
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
      btn.setAttribute("aria-label", "Pause background music");
    }

    function pause() {
      fadeTo(0, function () { audio.pause(); });
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play background music");
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

  /* ============ 11. RSVP ============ */
  (function initRsvp() {
    var section = $(".rsvp");
    var form = $("#rsvpForm");
    var done = $("#rsvpDone");
    if (!form) return;
    if (!cfg.rsvp || !cfg.rsvp.enabled) {
      if (section) section.style.display = "none";
      return;
    }

    var noteEl = $("[data-rsvp-note]");
    if (noteEl && cfg.rsvp.note) {
      noteEl.textContent = String(cfg.rsvp.note).replace("{deadline}", cfg.rsvp.deadline || "");
    }
    var successEl = $("[data-rsvp-success]");
    if (successEl && cfg.rsvp.successNote) successEl.textContent = cfg.rsvp.successNote;

    // Event checkboxes from the same config that renders the cards.
    var eventsWrap = $("#rsvpEvents");
    if (eventsWrap && cfg.events && cfg.events.length) {
      eventsWrap.innerHTML = cfg.events.map(function (ev, i) {
        return (
          '<label class="choice__opt">' +
          '<input type="checkbox" name="events" value="' + esc(ev.name) + '" ' + (i === 0 ? "" : "checked") + ' />' +
          "<span>" + esc(ev.name) + "</span>" +
          "</label>"
        );
      }).join("");
    }

    var guestsWrap = $("#rsvpGuestsWrap");
    var eventsWrapField = $("#rsvpEventsWrap");

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
        couple: cfg.couple.name1 + " & " + cfg.couple.name2,
        name: ($("#rsvpName") || {}).value || "",
        attending: (form.querySelector('input[name="attending"]:checked') || {}).value || "yes",
        guests: ($("#rsvpGuests") || {}).value || "",
        events: $$('input[name="events"]:checked', form).map(function (c) { return c.value; }),
        message: ($("#rsvpMessage") || {}).value || "",
      };
    }

    function whatsappUrl(data) {
      var lines = [
        "RSVP \u2014 " + data.couple,
        "Name: " + data.name,
        data.attending === "yes"
          ? "Attending: Joyfully, yes (" + data.guests + " guest" + (data.guests === "1" ? "" : "s") + ")"
          : "Attending: Regretfully, no",
      ];
      if (data.attending === "yes" && data.events.length) {
        lines.push("Events: " + data.events.join(", "));
      }
      if (data.message.trim()) lines.push("Message: " + data.message.trim());
      return "https://wa.me/" + cfg.rsvp.whatsapp.replace(/[^\d]/g, "") +
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

      var finish = function (msg) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-sending");
        }
        showDone(msg);
      };

      if (cfg.rsvp.endpoint) {
        if (submitBtn) submitBtn.classList.add("is-sending");
        fetch(cfg.rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json ? r.json() : {};
          })
          .then(function () { finish(cfg.rsvp.successNote); })
          .catch(function () {
            if (cfg.rsvp.whatsapp) {
              window.open(whatsappUrl(data), "_blank", "noopener");
              finish("We opened WhatsApp with your answers \u2014 just press send.");
            } else {
              finish("Something went wrong sending your RSVP \u2014 please try again.");
            }
          });
        return;
      }

      if (cfg.rsvp.whatsapp) {
        window.open(whatsappUrl(data), "_blank", "noopener");
        finish("We opened WhatsApp with your answers \u2014 just press send.");
        return;
      }

      finish(cfg.rsvp.successNote);
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

  function share() {
    var data = {
      title: document.title,
      text: "You\u2019re invited \u2014 " + cfg.couple.name1 + " & " + cfg.couple.name2 +
        " \u00B7 " + cfg.dateDisplay + " \u00B7 " + cfg.city,
      url: location.origin === "null" || location.protocol === "file:"
        ? "https://your-invite-link.example"
        : location.href,
    };
    if (navigator.share) {
      navigator.share(data).catch(function () { /* user dismissed */ });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data.url).then(
        function () { showToast("Link copied to clipboard"); },
        function () { fallbackCopy(data.url); }
      );
      return;
    }
    fallbackCopy(data.url);
  }

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
      showToast("Link copied to clipboard");
    } catch (e) {
      showToast(text);
    }
    document.body.removeChild(ta);
  }

  ["#shareBtn", "#shareFab"].forEach(function (sel) {
    var btn = $(sel);
    if (btn) btn.addEventListener("click", share);
  });

  /* Floating share pill appears after hero */
  var fab = $("#shareFab");
  var hero = $(".hero");
  if (fab && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        fab.classList.toggle("is-visible", !e.isIntersecting);
      });
    }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
  } else if (fab) {
    fab.classList.add("is-visible");
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

  (function initReveals() {
    $$(".section-title").forEach(function (t) {
      if (!t.nextElementSibling || !t.nextElementSibling.classList.contains("flourish")) {
        t.insertAdjacentHTML("afterend", FLOURISH);
      }
    });

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
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      $$(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    }
  })();
})();
