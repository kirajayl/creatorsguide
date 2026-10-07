# Regine Z. — Social Media, Automated

Static one-page site for Regine's done-for-you social media service: content produced,
captioned, scheduled and published to Instagram, TikTok and Facebook.

The site has a single conversion path — **WhatsApp → short meeting → quote**. There are no
prices on the page by design.

## Structure

```
.
├── index.html          # the entire page
├── css/styles.css      # all styles (plain CSS, no framework)
├── js/main.js          # FAQ, scroll reveal, hero approval queue
├── images/             # photography + logo
└── vercel.json         # static hosting config (no build step)
```

## Stack

Plain HTML, one hand-written stylesheet, and ~250 lines of vanilla JavaScript. No build
step, no bundler, no framework — `vercel.json` sets `buildCommand: null` and serves the
directory as-is.

**There is deliberately no Tailwind.** An earlier version of this site used Tailwind-style
class names (`sm:py-24`, `text-[#5a5a5a]`, `lg:grid-cols-3`) without Tailwind actually
being installed, so many of them silently did nothing and the page had drifted to 339
inline `style="…"` attributes to compensate. Styling now lives entirely in
`css/styles.css` under real, semantic class names. If you add markup, add a rule — don't
reintroduce utility-looking classes that nothing defines.

## Design system

Editorial/magazine layout: confident serif display type, asymmetric 12-column grids,
hairline rules as the main dividing device, generous whitespace, and a warm paper palette.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F7F4EF` | page background |
| `--paper-2` | `#EFE9DF` | alternating section bands |
| `--ink` | `#1B1917` | primary text, buttons |
| `--ink-soft` | `#5C5349` | body copy |
| `--ink-faint` | `#8B8178` | captions, meta |
| `--gold` | `#A0845C` | accent marks |
| `--gold-deep` | `#7A6137` | accent text (passes contrast on paper) |
| `--espresso` | `#2A2420` | closing section background |

Type: **Fraunces** (display, variable — uses the `SOFT` and `WONK` axes), **Instrument
Sans** (body), **JetBrains Mono** (eyebrows, captions, meta). All three load from Google
Fonts.

## Sections

1. **Masthead** — sticky, wordmark + nav + WhatsApp CTA
2. **Hero** — headline, lede, WhatsApp CTA, and the interactive month calendar
3. **Pipeline** — the A→Z flow; animated SVG diagram at ≥1024px, ordered list below it
4. **What I handle** — six services as an interlocked bento grid (two 2x2 hero tiles)
5. **Manifesto** — pull quote and three claims
6. **Output** — an Instagram-style profile feed, 3x3
7. **Questions** — seven-item FAQ accordion
8. **Closing** — dark espresso band, final WhatsApp CTA
9. **Colophon** — handle and domain

## The pipeline diagram

`index.html` holds the diagram twice, on purpose:

- the inline `<svg class="flow__svg">` is `aria-hidden` and shown only at ≥1024px;
- the `<ol class="stages">` carries the same content as real text. Below 1024px it is the
  visible version; above it, it becomes screen-reader-only.

**If you edit one, edit the other.** SVG coordinates live in a `0 0 1000 430` viewBox. The
main rail is horizontal: `M70 290 L650 290`, with the five stage dots on it at x = 70, 215,
360, 505, 650. Stage labels sit *above* the rail, the A/YOU/Z markers *below* it, and the
dashed feedback loop runs underneath everything. A three-way publish fan breaks off the
last node to x = 845 at y = 200 / 290 / 380 — the only diagonals in the diagram.

## The hero calendar

28 cells = four clean weeks. Deliberately **not** a real calendar month: no ragged first or
last week, and no month name to go stale (the previous site died partly on a hardcoded
date). It reads as a diagram of cadence, not a screenshot of a real client's schedule.

Of 20 posts across those 28 days:

- **weeks 1–2 (10 posts)** ship already approved, as `.day--post` with a `data-t` thumbnail;
- **weeks 3–4 (10 posts)** start as `.day--pending` and carry their own copy in data
  attributes (`data-thumb`, `data-caption`, `data-platform`, `data-kind`, `data-day`);
- **8 days have no post** — `.day--empty`. A post every single day would look fake.

### Two rules for calendar imagery

**One post, one distinct photograph.** The post count is capped by how many source images
exist. An earlier version faked 20 posts from 20 thumbnails that were really *two crops of
ten photos*; at 75px the pairs read as the same picture twice, which invites exactly the
wrong question — is she reposting the same content on different days? To add posts, add
source photos first and regenerate the thumbnails. Never reuse one.

**Calendar photos must feature the avatar.** The object/still-life photography (the six
bento tiles, `hours-back.jpg`) belongs to its own sections; a content calendar showing a
notebook or a desk clock as a "post" does not read as a social feed. `images/thumbs/` is
built from avatar photos only.

The pending cells *are* the queue's data source; `js/main.js` reads them in DOM order, so
there is no duplicated list to keep in sync. A pending cell holds its image in
`data-thumb`, not `data-t`, precisely so the `.day[data-t]` background rule does not reveal
the photo before approval.

**Behaviour.** The card shows the head of the queue. Approve sends a cloned thumbnail
flying into the date cell (`.ghost`, animated from `getBoundingClientRect` on both ends),
then the cell flips to `.day--post`. "Ask for changes" pushes that post to the back of the
queue, as it would in reality. After three manual approvals an "approve the remaining N"
shortcut appears so it never becomes twenty clicks.

**Idle autopilot.** If nobody interacts within `IDLE_MS` (5s) the queue approves itself
every `AUTO_MS` (850ms), so a passive visitor still sees the month fill. A click calls
`cancelAuto()`, which sets `userTookOver` and stops it for good; losing visibility calls
`pauseAuto()`, which can resume.

### Why visibility here is a hit test, not geometry

**The hero is `position: sticky`, so it never leaves the viewport** — it is hidden by being
*covered* by later sections. That breaks the two obvious ways to detect visibility:
`getBoundingClientRect()` keeps reporting it on screen, and an IntersectionObserver reports
a covered sticky element as still intersecting. Both were tried and both let the
fixed-position `.ghost` keep flying across whatever section was actually on screen.

`calOnScreen()` instead hit-tests the middle of the calendar's visible area with
`document.elementFromPoint()` and asks whether the topmost painted element there still
belongs to the calendar. `.ghost` is `pointer-events: none`, so it never wins that test and
cannot make the calendar look visible to itself.

It is consulted in three places: before starting the idle countdown, on every autopilot
tick, and inside `fly()` before a ghost is created. A scroll/resize listener (rAF-gated)
re-checks and calls `landAll()`, which immediately finishes any ghost already in the air so
nothing keeps sailing over the next section.

**If you add another sticky section, the same trap applies** — geometry and
IntersectionObserver will both lie to you about it.

**Gotcha worth knowing:** the load-in stagger sets `opacity: 0` on `.cal__grid .day` and
relies on `animation-fill-mode: forwards` to hold cells visible. Replacing that animation
drops the cell back to invisible, so `fill()` pins `opacity`/`transform` inline *before*
assigning the pop animation. Keep that if you touch it.

The widget is labelled `demo` in its header — it illustrates the approval step, it is not a
live tool, and the captions are generic rather than any real client's posts.

## The 12-column grids and mobile

`.hero__grid`, `.handle__grid`, `.faq__grid` and `.manifesto__grid` are
`repeat(12, 1fr)` with a large `gap`. **Below 880px they must collapse to
`grid-template-columns: 1fr`, not merely re-span their items.**

A `gap` applies between *every* column. Eleven 40px gaps is 440px of gap; on a
320px viewport the content box is 288px, so every track was squeezed to `0px` and
an item spanning `grid-column: 1 / -1` came out at `0 x 12 + 11 x 40px` = 440px —
120px wider than the viewport. The page then had a dead strip down the right at
every mobile width. Three other sections did the same at 32px gaps (352px).

Collapsing the template makes the gap a row gap only. **If you add another
12-column section, add it to that collapse rule.**

Verify with the overflow check: `document.documentElement.scrollWidth` must equal
`window.innerWidth` at 320, 360, 390, 414, 430, 560, 768, 880 and 900px.

## Section stacking

Three short, visual sections pin and get covered by the next one; the tall sections
(pipeline, bento, feed, FAQ) scroll normally, because a sticky section taller than the
viewport cannot be scrolled through.

```css
.hero, .manifesto, .closing {
  position: sticky;
  top: min(0px, calc(100vh - 100%));
}
```

That `top` value is the load-bearing trick: for a section shorter than the viewport it
resolves to `0`, and for a taller one it goes negative, so the section scrolls fully into
view *before* it pins. Nothing gets clipped at any height.

Static elements paint beneath positioned ones regardless of document order, so **every**
section carries an explicit `z-index` in document order (hero 1 → colophon 8) and the
covering sections need an opaque `background`. If you add a section, give it the next
z-index and a background or the stack will show through.

Disabled below 768px and under `prefers-reduced-motion: reduce`.

## Bento tiles

Each tile's photograph is a **CSS background**, not an `<img>`. That is deliberate: a
missing file fails silently to the espresso fallback instead of showing a broken image, so
the section always looks finished.

| Class | File | Tile |
| --- | --- | --- |
| `.tile--strategy` | `images/tile-01-strategy.jpg` | 01 Strategy (hero) |
| `.tile--production` | `images/tile-02-production.jpg` | 02 Production (hero) |
| `.tile--copy` | `images/tile-03-copy.jpg` | 03 Copy & captions |
| `.tile--scheduling` | `images/tile-04-scheduling.jpg` | 04 Scheduling |
| `.tile--publishing` | `images/tile-05-publishing.jpg` | 05 Publishing |
| `.tile--reporting` | `images/tile-06-reporting.jpg` | 06 Reporting |

Source art is 4:3. **Serve it at 1600px wide, JPEG quality ~82** — the widest a hero tile
ever renders is ~580 CSS px, so 1600 covers 2x DPR with room to spare. The originals were
2400x1792 at ~2.9MB each (17MB for the set); downscaling cut that to ~1MB total. If you
replace one, resize it the same way:

```python
from PIL import Image
im = Image.open('new.jpg').convert('RGB')
w, h = im.size
im.resize((1600, round(h * 1600 / w)), Image.LANCZOS).save(
    'images/tile-0N-slug.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
```

The bottom ~60% of each tile sits under a scrim, so keep the subject in the upper two
thirds.

Hover reveals the detail copy on pointer devices. Under `@media (hover: none)` the detail
is permanently visible instead — never make hover the only way to read tile content.

## WhatsApp CTA

All three buttons point at the same link. The number is intentionally **never rendered as
visible text** — it only exists inside `href` attributes.

```
https://wa.me/60183644068?text=<prefilled message>
```

To change the number, replace all three occurrences:

```bash
grep -n 'wa.me' index.html
```

The prefilled message tells Regine the enquiry came from the site. Keep it URL-encoded
(`%20` for spaces).

## Local development

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## Cache busting

Both assets are versioned in `index.html` (currently `styles.css?v=13`, `main.js?v=6`).
**Bump the number whenever you change either file**, or Vercel will serve stale copies.

## Deployment

Vercel (project `creatorsguide`), from the repository root. No build command.

Live at **regine.the1percentclub.net**. The hostname has no underscore on purpose —
underscores are invalid in hostnames per RFC 1123, so Let's Encrypt (which Vercel
uses) will not issue a certificate for one and the site would be served without
working HTTPS. `reginez_z@the1percentclub.net` is still fine as an *email* address;
the restriction applies to hostnames only.

When changing the domain, update all four places that hardcode it: `rel="canonical"`,
`og:url`, `og:image`, `twitter:image`, plus the footer text in `.colophon__handle`.

Order of operations for a domain move: push and verify on the `*.vercel.app` URL
first, then add the domain in Vercel, then set DNS at the registrar. DNS is the
slow, cached step, so the destination must be correct before traffic is pointed at
it.

## Notes

- `images/thumbs/` holds twenty 180px square crops, **one per distinct avatar photo**, used
  by the hero calendar cells — 155KB for the set. `t01`–`t10` are the original lifestyle
  photos; `t11`–`t20` are the purpose-made `post-*.jpg` set (1:1, generated against the
  prompt list). Cropped from the top, where the subject sits.
- `post-01-coffee.jpg` … `post-10-goldenhour.jpg` are currently **thumbnail sources only** —
  nothing references them at runtime, so they are ~1.7MB deployed for nothing. They are the
  obvious candidates to replace the older photos in the Instagram feed section, which would
  both put them to work and make the feed consistent with the calendar.
- The photography carried over from
  the previous site still uses its old filenames (`hero-ai-clone.jpeg`,
  `step2-create-content.jpeg`); those are referenced only from `index.html`, so rename
  freely if you update the references at the same time.
- Watch for the same photo appearing twice. `why-works.jpeg` was briefly used in both the
  manifesto and the Instagram feed, one screen apart, which made it read as filler. The
  manifesto now uses `hero-ai-clone.jpeg` as a placeholder pending a purpose-made
  still-life.
- `vercel.json` sets a 1-year `immutable` cache on `/images/*`. Filenames carry no hash, so
  if you replace a tile image in place, returning visitors may keep the old one. Rename it
  (and the CSS rule) when the change must be seen immediately.
- Motion respects `prefers-reduced-motion`: the pulse animation, scroll reveals and smooth
  scrolling all switch off.
