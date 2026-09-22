# Luxury Wedding Invitation Template

Tier: **Luxury (৳5,990)** · Cinematic single-page digital invitation.
Everything in the Signature tier, plus the Luxury upgrades.

**Noir-cinema** design — charcoal and champagne gold, a curtain-raised
opening sequence, film grain and rising gold dust, letter-by-letter
titles, a scroll-drawn story timeline, gilded event cards, a mosaic
gallery with lightbox, **config-driven custom sections** (quote bands,
card grids, FAQs), switchable themes **plus custom colours and
typography**, background music and RSVP.

## Included in this tier

Everything from Signature (৳3,990):

- Couple names + gold seal, wedding date + live countdown
- Family / welcome message, Our Story timeline
- Multiple event cards with Google Maps + Add-to-Calendar
- Photo gallery with fullscreen lightbox (keyboard + swipe)
- Venue with embedded map + directions
- RSVP (WhatsApp and/or Formspree-style endpoint)
- Background music, shareable link, mobile-first + full desktop layout

Luxury additions:

- **Cinematic opening** — a black curtain with a drawing gold ring and
  the couple's names; the tap that opens it also starts the music
  (browsers require a tap before audio). Set `intro.enabled: false` to
  land straight on the hero. Set `motion: "honor"` to skip it
  automatically for guests whose device asks for reduced motion.
- **Premium cinematic design** — spotlight hero, film-grain overlay,
  vignette, gold corner frames, gilded cards and buttons with a sheen
- **Advanced animations** — letter-by-letter hero titles, rising gold
  dust, a story timeline whose gold rail draws itself as the guest
  reads, flip countdown, hero parallax, scroll progress bar, staggered
  reveals, ken-burns-style lightbox fades — on for everyone by default;
  `motion: "honor"` in config.js switches to a still version for
  guests whose device asks for reduced motion
- **Custom sections** — the signature Luxury feature: any number of
  extra sections from four layouts (`quote`, `text`, `cards`, `faq`),
  defined purely in config (see `customSections` below). Samples
  included: a Qur'an quote band, Dress Code with colour swatches,
  Travel & Stay, and a Good-to-Know FAQ accordion
- **Custom typography** — `fonts: { display, script, sans }` picks from
  an approved list (Marcellus / Playfair Display / Cormorant Garamond ·
  Pinyon Script / Great Vibes / Parisienne · Montserrat / Jost /
  Manrope). The chosen families load on demand — the page only
  downloads what it uses
- **Custom colours** — `theme` switches the whole palette (noir /
  royal / ivory) and `palette: { … }` fine-tunes any core colour; the
  gold hairlines and glows re-tint to match
- **Priority delivery, 3–4 revisions** — position this tier to clients
  accordingly

Not in this tier (reserved for Bespoke ৳7,990+): fully custom concept &
artwork, bespoke illustration/animation, multi-page experiences.

## Files

| File         | Purpose                                          |
|--------------|--------------------------------------------------|
| `index.html` | Page structure. Rarely needs editing.            |
| `styles.css` | All styling + theme tokens at the top.           |
| `config.js`  | **Every client-specific value lives here.**      |
| `script.js`  | Rendering, intro, animations, RSVP, music, FX.   |
| `assets/photos/` | Gallery images (placeholder art included).   |
| `assets/music/theme.mp3` | Placeholder track — swap for the client's song. |

## Customising for a client

Edit **`config.js` only** — theme, palette, fonts, intro copy, names,
blessing, date, families, story chapters, events, venue, photos, custom
sections, music, RSVP destination, closing line and studio credit.
Every field is commented.

Fields that need small care:

- `weddingDateTime` — ISO format with timezone, e.g.
  `"2027-03-19T18:00:00+06:00"`. Drives the countdown.
- Each event's `mapQuery` — paste the venue name exactly as Google Maps
  knows it (or `23.7936,90.4043` style coordinates) so the map pins
  correctly.
- `gallery.photos[].src` — drop webp/jpg files into `assets/photos/`
  (~1200px wide is plenty) and list them. `wide: true` spans two
  columns, `tall: true` spans two rows.
- `rsvp.whatsapp` — international format, digits only, no `+`
  (e.g. `8801712345678`). Set `rsvp.endpoint` to a Formspree URL to
  POST answers there instead/additionally.
- `music.src` — replace `assets/music/theme.mp3` with the client's song
  (mp3, ideally ≤2 MB). The current file is a soft generated ambient
  piano loop (placeholder only).

### Themes, colours and fonts (sold as Luxury options)

```js
theme: "noir",              // charcoal & champagne gold  (default)
theme: "royal",             // midnight navy & platinum
theme: "ivory",             // warm ivory & antique gold (light)

palette: { gold: "#e0c07a" },   // fine-tune any core colour

fonts: {
  display: "Playfair Display",  // titles & names
  script:  "Great Vibes",       // ampersands, epigraphs
  sans:    "Jost",              // labels & buttons
},
```

The `<meta name="theme-color">` in `index.html` should roughly match
the chosen theme (#0a0a0e / #0a101e / #efe7d6) — script.js also
re-syncs it at runtime.

### Custom sections

`customSections` is a list; each entry becomes a full section between
the gallery and the venue map. Four layouts:

```js
{ layout: "quote", quote: "…", source: "…" }
{ layout: "text",  eyebrow, title, titleAccent, text, note }
{ layout: "cards", eyebrow, title, titleAccent, note,
  cards: [{ kicker, title, text, swatches: ["#14524a", …] }] }
{ layout: "faq",   eyebrow, title, titleAccent,
  items: [{ q: "…", a: "…" }] }
```

Remove an entry to drop that section; copy an entry to add another of
the same kind. Dress-code colour swatches are optional per card.

## Running locally

```bash
cd template3-luxury
python3 -m http.server 8080
# open http://localhost:8080
```

(Opening `index.html` directly via `file://` also works — only the map
iframe, clipboard and music need a real http(s) origin when deployed.)

**Motion:** the animated experience plays for everyone by default. To
honour the visitor's own reduced-motion setting instead (the accessible
behaviour — curtain and effects replaced by a still, instant page), set
`motion: "honor"` in `config.js`.

## Deploying

Any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages —
drag the folder in. One URL per couple = the shareable link.

## Fonts

Defaults loaded in `index.html`: Marcellus (cinematic display serif),
Cormorant Garamond (body serif), Pinyon Script (script accents),
Montserrat (labels), Noto Serif Bengali (Bangla text support).
Alternative families chosen in `config.js` load on demand from Google
Fonts. Bangla renders correctly anywhere it appears.
