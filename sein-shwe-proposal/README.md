# Reawaken: Sein & Shwe Traditional Sauce — Proposal Site

Standalone, self-contained website version of the "Reawaken: Traditional Sauce"
digital proposal (Awaken Digital → Delous Company Limited, Sein & Shwe
Traditional Sauce, September 2026 launch window).

Plain HTML/CSS/JS, no build step. Open `index.html` directly or serve the
folder with any static file server.

```
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Structure

```
index.html        all page content/sections
styles.css         styling
script.js          scroll reveal, calendar tabs, video player logic
assets/img/        logos + poster frames (extracted from the source PDF)
assets/videos/     drop the 3 final animated hero clips here (see below)
```

## Adding the 3 animated hero videos (Content Samples, slides 26–28)

The "Content Samples" section (`#samples`) has three video players already
wired up and waiting. Drop the exported `.mp4` files into `assets/videos/`
using these exact names and each player goes live automatically — no code
changes needed:

| Slide | Concept                        | File to add                              |
|-------|---------------------------------|-------------------------------------------|
| 26    | Sein — "The Fermentation Story" | `assets/videos/fermentation-story.mp4`    |
| 27    | Shwe — "The Vendor's Math"      | `assets/videos/vendors-math.mp4`          |
| 28    | Shwe — "The House Full of Surprise" | `assets/videos/house-of-surprise.mp4` |

Until a file is present, the card shows its poster frame with an "Awaiting
final clip" tag and a play button that gently shakes instead of erroring.
The page checks for the file with a `HEAD` request, so this only works when
served over `http(s)://` (a static server or GitHub Pages) — opening
`index.html` straight from disk (`file://`) will always show the pending
state, even after you add the files.

Keep clips reasonably compressed (H.264 mp4, a few MB each) since they load
directly in the browser with no CDN in front of them.
