# GR Station — live website prototype

Working prototype of the live website described in the Awaken Entertainment ×
Grand Royal **Interactive Charging Station** proposal (section: *Accounts, live
data and rewards*).

The deck specifies one live website with four views on a single cloud ledger.
This is that website, built as a static site so it can be hosted on GitHub Pages.

| Page | Who it is for | What it does |
| --- | --- | --- |
| `index.html` | Anyone | Overview of the system, the register flow, the points ladder, the data/roles table |
| `live.html` | Public, no login | Leaderboards by venue and city, the just-now feed, Station status |
| `account.html` | The player | Phone + SMS sign-in, points, progress, history, voucher with a QR code |
| `vendor.html` | Venue staff | Vendor-code sign-in, check a voucher, hand the prize over, the day's claims |
| `dashboard.html` | Grand Royal and Awaken | Live counters, plays per hour, uptime, venue/city breakdowns, CSV export |

## One database, four views

Every page reads and writes the same ledger (`assets/gr.js`), kept in
`localStorage` and mirrored across open tabs with `BroadcastChannel`. Claim a
prize on the account page and the voucher is immediately checkable in the vendor
portal; hand it over and the claims counter moves on the dashboard and the feed
updates on the public board. There is no server: nothing leaves the browser.

## Trying it

1. **Account** — any local mobile number works (for example `09 771 234 567`).
   The SMS code is shown on screen: `4817`.
2. Play a few rounds to pass a step on the ladder, then tap **Claim**. A
   one-time voucher with a real, scannable QR code appears.
3. **Vendor** — sign in with a demo vendor code (`VA-2043`, `VB-7715`,
   `VC-3388`, `VD-9021`), type or scan the voucher code, then **Hand over**.
4. **Live board** and **Dashboard** move as you go.

Reset the demo data from the bottom of the overview page.

## Files

```
gr-station/
├── index.html · live.html · account.html · vendor.html · dashboard.html
└── assets/
    ├── gr.css        design system: palette and type from the deck
    ├── fonts.css     self-hosted Cormorant Garamond + DM Sans (latin subsets)
    ├── fonts/        the woff2 files, so there is no third-party font request
    ├── gr.js         the mock cloud: ledger, simulation, points, vouchers
    └── qr.js         QR encoder (byte mode, EC level L, versions 1–5)
```

No build step and no dependencies — open `index.html` or serve the folder.

## Status of the content

Screens, points, prize steps and rules are **proposals**, to be tuned in the
pilot. Sample data only: no real accounts, no real phone numbers, no real
prizes. Rewards are free to play, skill-based, 18+, non-alcohol, and switch on
only with counsel clearance, per the compliance envelope in the deck.
