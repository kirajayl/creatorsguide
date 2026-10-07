# Build History

## Version 2.3.0 — October 7, 2026

- Site moves to **regine.the1percentclub.net** (from creatorsguide.the1percentclub.net).
  Note the hostname deliberately omits the underscore from the `@reginez_z` handle:
  underscores are not valid in hostnames (RFC 1123), so no CA will issue a
  certificate for one and the site would have had no working HTTPS. The handle
  still appears in the footer, and `reginez_z@the1percentclub.net` remains valid
  as an email address, where underscores are permitted in the local part.
- Added `rel="canonical"` and `og:url`, which the site never had. Both matter during
  a domain move so the old and new subdomains do not compete as duplicate content.
- Made `og:image` and `twitter:image` absolute URLs. Relative paths are not resolved
  by most social scrapers, so link previews were silently rendering without an image.
- Asset version bumped to `styles.css?v=24`.

## Version 2.2.4 — October 7, 2026

- **Fixed horizontal overflow at every mobile width** (a dead strip down the right
  side). The 12-column grids kept `repeat(12, 1fr)` below 880px while their items
  spanned `1 / -1`; since `gap` applies between every column, eleven 40px gaps
  consumed 440px against a 288px content box, collapsing all tracks to 0px and
  making the spanning items 440px wide. The templates now collapse to a single
  column, so the gap is a row gap only. Verified `scrollWidth == innerWidth` from
  320px to 1920px.
- **Fixed `el.hidden` doing nothing to `.queue__actions`** — a class setting
  `display: flex` outranks the UA's `[hidden] { display: none }`.
- **Pending calendar cells made legible.** A 1px gold hairline on cream was
  invisible at 75px, so the unapproved half of the calendar looked broken rather
  than reserved. They now carry a gold tint, a 1.5px border and a centre dot, and
  the legend swatches match.
- Strengthened the bento scrim on touch devices, where the detail copy is
  permanently visible over the full height of the tile.
- Asset version bumped to `styles.css?v=22`.

## Version 2.2.3 — October 6, 2026

- **Fixed properly: approval thumbnails still flew over later sections.** The previous fix
  gated on `getBoundingClientRect()` and an IntersectionObserver, but both are blind to the
  real cause — the hero is `position: sticky`, so it never leaves the viewport and a
  *covered* sticky element still reports as visible/intersecting. Visibility is now a hit
  test (`document.elementFromPoint` on the middle of the calendar's visible area), checked
  before the idle countdown, on every autopilot tick, and inside `fly()`.
- Added `landAll()`: a ghost already mid-flight when the calendar gets covered is finished
  immediately rather than continuing for up to 550ms over the next section.
- Asset version bumped to `main.js?v=9`.

## Version 2.2.2 — October 6, 2026

- **Calendar restricted to avatar photography.** The six bento tile images and
  `hours-back.jpg` were being used as calendar posts; an object still-life does not read as
  a social post. They remain in their own sections.
- **Ten new purpose-made avatar photos added** (`post-01-coffee.jpg` …
  `post-10-goldenhour.jpg`), generated 1:1 at 2048px against a written prompt set with
  specified outfits in a single coherent palette. Optimised 26.1MB → 1.66MB (−93%) at
  1200×1200, quality 82.
- **Calendar back to 20 posts** across 28 days (10 approved on load, 10 pending, 8 no-post
  days, 71% fill) with twenty distinct photographs — one per post, no repeats. Old and new
  sources are interleaved so neither set clusters.
- Asset version bumped to `styles.css?v=20`.

## Version 2.2.1 — October 6, 2026

- **"Regine Z." removed everywhere**, including `<title>`, the Open Graph and Twitter
  titles, `og:site_name`, the footer wordmark and the copyright line. The site is "Regine".
- **Fixed: approval thumbnails flew across unrelated sections.** The hero is
  `position: sticky`, so it stays inside the viewport beneath later sections; the autopilot
  therefore kept approving after the visitor scrolled away, and the fixed-position `.ghost`
  animated over whatever was on screen. The queue now only runs while the calendar is
  visible (IntersectionObserver), and `fly()` skips the animation unless both ends pass an
  `onScreen()` check. A user click cancels autopilot permanently; losing visibility only
  pauses it.
- **Fixed: repeated photos in the calendar.** The 20 thumbnails were two crops of ten
  photos, so each source appeared twice and read as a duplicated post. Rebuilt with 17
  thumbnails from 17 distinct sources — the bento and manifesto photography is now included
  as calendar content, which a real feed would mix anyway. The calendar is 17 posts across
  28 days (9 approved on load, 8 pending, 11 no-post days), every post a different image.
- Asset versions bumped to `styles.css?v=18`, `main.js?v=7`.

## Version 2.2.0 — October 6, 2026

- **Hero photo replaced with an interactive month calendar.** 28 cells, 20 posts. Weeks 1-2
  arrive approved; weeks 3-4 wait on the visitor, who approves them from a card beside the
  grid. Each approval sends a thumbnail flying into its date cell. "Ask for changes" sends
  a post to the back of the queue; an "approve the remaining N" shortcut appears after
  three manual approvals. If untouched for 5s the queue approves itself so passive
  visitors still see the payoff; any click cancels that. Labelled `demo`, with generic
  captions rather than any real client's posts.
- Twenty 180px thumbnails generated for the calendar cells (143KB total) rather than
  loading full-size photos into 78px squares.
- **Nav wordmark shortened to "Regine"** (footer and `<title>` still read "Regine Z.").
- **Section stacking added.** Hero, manifesto and closing pin and get covered by the next
  section via `top: min(0px, calc(100vh - 100%))`, which lets sections taller than the
  viewport scroll fully into view before pinning. Tall sections scroll normally. Every
  section got an explicit z-index because static elements paint under positioned ones.
  Off below 768px and under reduced motion.
- Fixed: the calendar's load stagger uses `opacity: 0` plus `forwards`, so replacing a
  cell's animation on approval made it fade back to invisible. `fill()` now pins the
  resting state inline first.
- Asset versions bumped to `styles.css?v=13`, `main.js?v=6`.

## Version 2.1.0 — October 6, 2026

Revisions following first review of 2.0.0.

- **Pipeline rail straightened.** Was an inclined line rising to the right; now flat
  (`M70 290 L650 290`). Required re-laying out the diagram: stage labels moved above the
  rail, A/YOU/Z markers below it, feedback loop rerouted underneath. The publish fan is now
  the only intentional diagonal.
- **"What I handle" rebuilt as a bento grid.** The six-item numbered list read as a wall of
  text and was likely to be skipped. Now two 2x2 hero tiles (Strategy, Production)
  interlocked with four 1x1 tiles, detail revealed on hover and on `:focus-within`.
  Under `@media (hover: none)` the detail is permanently visible so touch users lose
  nothing. Reflows to 2 columns at 880px and 1 at 560px.
- **Output section restyled as an Instagram profile feed** — avatar, handle, bio, tab row,
  3x3 square grid with reel and carousel badges. This absorbed the three previously unused
  images, so nothing in `images/` is dead.
- **Email contact added**, same hidden treatment as the phone number: present only in
  `mailto:` hrefs, never as visible text. Appears under the closing CTA and in the footer.
- **Tile photography added and optimised.** Six generated 4:3 images, downscaled from
  2400x1792 (~17.0MB total) to 1600px wide at quality 82 (~1.0MB total), a 94% reduction.
  Served as CSS backgrounds so a missing file degrades silently.
- Asset versions bumped to `styles.css?v=10`, `main.js?v=4`.

## Version 2.0.0 — October 6, 2026

Full rebrand from "The 1% Better Program" (a $9.90 self-serve AI-clone course) to
**Regine Z. — Social Media, Automated**, a done-for-you service.

### Positioning
- Offer inverted: the buyer no longer builds anything themselves. Regine runs the whole
  pipeline, from content production through scheduling to publishing.
- Single conversion path: WhatsApp → short meeting → quote. **No prices on the page.**
- Platforms stated as Instagram, TikTok and Facebook.

### Removed
- All previous page content, per rebrand scope.
- The three-tier table ($9.90 Blueprint / $999 Done-For-You / $4,999 Empire).
- "52/100 Pioneer Spots Claimed" counter and the value-stack strikethrough pricing block.
- "Founding Cohort Enrollment Closes April 30, 2026" — five months stale.
- 72-hour deployment guarantee, 7-Day Challenge, "131 agents", "100 women" / "busy moms"
  audience framing, income disclaimer.
- Instagram reel iframe and all `nas.io` / `tiny.cc` links.

### Design
- New archetype: editorial/magazine — asymmetric 12-column grids, hairline rules,
  large serif display type, warm paper palette.
- Type changed to Fraunces (display, variable axes) + Instrument Sans + JetBrains Mono,
  replacing Playfair Display + Inter.
- New signature section: an animated SVG node-map of the A→Z pipeline, with a traveling
  pulse, a three-way publish fan, and a dashed monthly-report feedback loop.

### Technical
- `css/styles.css` rewritten from scratch. The previous file was a partial hand-rolled
  imitation of Tailwind; the markup referenced utility classes (`sm:py-24`,
  `text-[#5a5a5a]`, `antialiased`, `lg:grid-cols-3`) that were never defined, so they
  silently did nothing. Every class the HTML uses now has a real rule.
- Removed all 339 inline `style="…"` attributes.
- `js/main.js` rewritten: FAQ disclosure with correct `aria-expanded` / `aria-controls`,
  plus IntersectionObserver scroll reveal. The old JS smooth-scroll handler was dropped in
  favour of CSS `scroll-behavior` + `scroll-margin-top`.
- Fixed a live 404: `images/favicon.ico` was referenced but does not exist. Now uses
  `images/logo.png`.
- Accessibility: skip link, visible focus rings, the pipeline diagram mirrored as real
  text for screen readers, and full `prefers-reduced-motion` support.
- Asset versions bumped to `styles.css?v=7` and `main.js?v=3`.

## Version 1.0.0 — March 23, 2026
- Initial deployment
- Static website with HTML, CSS, and JavaScript
- Responsive design
- AI Clone Marketing System landing page
