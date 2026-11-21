# Aprilia & Mirda — Wedding Invitation

A mobile-first digital wedding invitation for **26 December 2026, Garpoo Batam**.
Static site on **GitHub Pages**, with RSVPs and wishes stored in **Google Sheets** through **Google Apps Script**.

```
index.html            page structure (you rarely need to edit this)
css/style.css         design
js/config.js          ← ALL content: names, date, venue, banks, WhatsApp, media, Script URL
js/main.js            behaviour (countdown, RSVP, wishes, calendar, maps, music)
apps-script/Code.gs   Google Apps Script backend (paste into the Sheet's script editor)
assets/images|video|music
.nojekyll             tells GitHub Pages to serve files as-is
```

---

## Step 1: Publish on GitHub Pages

1. Put all files at the **root** of the repository, on the `main` branch.
2. On GitHub, open the repo and go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main`, and **Folder** to `/ (root)`. Click **Save**.
4. After about a minute the site is live at `https://<username>.github.io/<repo>/`.

Every later commit to `main` redeploys automatically within about a minute.

## Step 2: Google Sheets + Apps Script (RSVP database)

1. Go to <https://sheets.new> and name the sheet, for example **Wedding RSVP – Aprilia & Mirda**.
2. Open **Extensions → Apps Script**, delete the sample code, and paste the full contents of `apps-script/Code.gs`. Save.
3. In the function dropdown pick **`setup`**, then click **Run**. Google will ask for permission: choose your account, then **Advanced → Go to (project) (unsafe) → Allow**. (The warning appears because you wrote the script yourself and Google hasn't reviewed it. It's safe.)
   This creates the **RSVP** tab with headers and checkboxes, plus a **Summary** tab with live totals.
4. Click **Deploy → New deployment**, then the gear icon → **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `js/config.js`:
   ```js
   rsvp: { scriptUrl: "https://script.google.com/macros/s/XXXX/exec", ... }
   ```
6. Commit, then submit a test RSVP on the live site. A new row should appear in the sheet within a few seconds.

> **If you change `Code.gs` later:** go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same URL. Choosing "New deployment" instead creates a new URL, which you'd then have to paste into config.js again.

### Sheet structure

**RSVP** tab (one row per submission):

| Timestamp | Name | Attendance | Guests | Message | Show on website |
|---|---|---|---|---|---|
| 26 Nov 2026, 19:02 | Ade Fitriyani | Attending | 2 | Wishing you both a lifetime of happiness! | ☑ |

- **Guests** is 0 when someone isn't attending.
- **Show on website**: untick a box to hide that wish from the site. The site updates within about 30 seconds and the row stays in the sheet.
- Export with **File → Download → .xlsx / .csv**, or use filters (Data → Create a filter).

**Summary** tab (formulas update automatically): total RSVPs, attending, not attending, **total guests coming**, wishes received.

## Step 3: Upload your photos, video and music

The site currently uses placeholder images. On GitHub, open `assets/images/` → **Add file → Upload files**, then drop in your files **renamed exactly like this** so they replace the placeholders:

| File name | What it is | Best shape |
|---|---|---|
| `cover.jpg` | Opening cover + desktop side photo | Portrait (9:16), faces in the upper half |
| `bride.jpg` | Bride portrait | Portrait 3:4 |
| `groom.jpg` | Groom portrait | Portrait 3:4 |
| `gallery-1.jpg` … `gallery-6.jpg` | Gallery. Photo 1 is shown wide (landscape works best) | Any |
| `closing.jpg` | Background of the last section | Portrait |
| `og.jpg` | Preview image when the link is shared on WhatsApp | Landscape 1200×630 |

- **Video:** upload to `assets/video/`, for example `prewedding.mp4`, then set `media.video: "assets/video/prewedding.mp4"` in config.js. Or upload it to YouTube (it can be Unlisted) and set `media.youtubeId`. YouTube is lighter for guests.
- **Music:** upload to `assets/music/song.mp3`, then set `media.music: "assets/music/song.mp3"`. The floating music button appears automatically.
- More than 6 gallery photos? Name them `gallery-7.jpg` and up, and add a line for each in `media.gallery`.
- Keep files small (see the size guide below). An easy free tool is <https://squoosh.app>: set MozJPEG, quality 75, and resize to 1600 px.

## Step 4: Add the WhatsApp numbers (kept out of chat on purpose)

In `js/config.js` → `gifts`:
```js
whatsappBride: "62812xxxxxxx",   // country code, no "+", no spaces or dashes
whatsappGroom: "62813xxxxxxx",
```
Each filled number shows a "WhatsApp …" button in the gift section. If both are empty, the parcel block is hidden. Note that once committed, the numbers are visible to anyone who opens the site or the repo. That's how the button works.

---

## Adding your media

### The moving background (the most important file)
One video plays, muted and looping, behind the **whole** invitation from the cover to the very end.

- File: `assets/video/background.mp4` (the one in the zip is a placeholder made from blurred colours).
- **Portrait (vertical) works best on phones**, e.g. 720×1280. On desktop it's cropped to fill the screen.
- Keep it **10–20 seconds**, **no sound** (it's always muted), and **under ~8 MB** so it starts quickly on mobile data. Calm, slow footage works best, and the loop is less noticeable if the end looks like the start.
- `assets/images/background-poster.jpg` is a still frame shown while the video loads and on iPhones in Low Power Mode (which block autoplay). Use a frame from your video.
- Text too hard to read? Raise `media.backgroundDarkness` in `config.js` (0.5 → 0.6).

Shrink a video for free with <https://handbrake.fr>: preset "Fast 720p30", untick audio, set Constant Quality around 26–28.

### Photos
| File | Used for | Best shape |
|---|---|---|
| `bride.jpg`, `groom.jpg` | Arched portraits | Portrait 3:4, 900×1200 |
| `gallery-1.jpg` … `gallery-6.jpg` | Gallery (every 3rd photo is wide) | 1st, 4th: landscape 4:3; others portrait |
| `og.jpg` | Preview image when the link is shared on WhatsApp | 1200×630 |

Want more or fewer gallery photos? Add or remove lines in `media.gallery` in `config.js`. Shrink photos with <https://squoosh.app> (1600 px long side, quality 75).

**Pre-wedding film in the gallery (optional):** upload to `assets/video/` and set `media.video`, or upload to YouTube (Unlisted) and set `media.youtubeId`.
**Music:** upload to `assets/music/` and set `media.music: "assets/music/yourfile.mp3"`. The floating music button only appears once this is set.

## Maintenance: common edits

All of these are in **`js/config.js`**. Edit it on GitHub with the ✏️ icon, then **Commit changes**.

| You want to… | Change |
|---|---|
| Change the event time | `event.sessions`: each line has `start` and `end` (the countdown uses the first one) |
| Use an exact map pin | Open the venue in Google Maps → Share → copy link → `event.mapsLink` |
| Change the RSVP deadline text | `rsvp.note` |
| Allow more guests per RSVP | `rsvp.maxGuests` |
| Replace photos | Upload new files into `assets/images/` with the **same names**, or edit `media.gallery` |
| Add or remove gallery photos | Add or remove lines in `media.gallery` |
| Use a YouTube video instead of a file | `media.youtubeId: "abc123"` |
| Change the song | Upload to `assets/music/` and set `media.music` |
| Hide the Quran verse | `verse.text: ""` |

**Personalised links per guest:** add `?to=Name` to the URL, for example
`https://<username>.github.io/<repo>/?to=Budi+Santoso`
The cover then shows "Dear Budi Santoso" and the RSVP name is prefilled. Use `+` or `%20` for spaces.

**Media size guide (fast on mobile data):** photos 1080–1600 px on the long side, JPG quality about 75, each under 300 KB. Video 720p H.264, under 10 MB, or use YouTube. Music: MP3 at 96–128 kbps, under 4 MB. GitHub rejects single files over 100 MB.

**Troubleshooting**
- *RSVP shows "didn't go through":* check that `scriptUrl` ends in `/exec` and that the deployment's access is **Anyone**.
- *Wishes don't appear:* open `scriptUrl + "?action=wishes"` in a browser. You should see JSON. Only rows with a message and a ticked checkbox are shown.
- *Old version still showing:* hard-refresh, or wait 1–2 minutes for the GitHub Pages cache.

---

## Requirements checklist

- [x] Opening cover with personalised guest name + "Open invitation"
- [x] Bride & groom section with both sets of parents
- [x] Photo & video gallery (lightbox, video file or YouTube)
- [x] Event details: date/time opens **Google Calendar** prefilled with title, date, time, venue, description
- [x] Venue opens **Google Maps**, plus an embedded map
- [x] Dress code palette (7 colours, framed as a guide only)
- [x] Live countdown: days, hours, minutes, seconds
- [x] RSVP: full name, attendance, number of guests (required), wishes (optional)
- [x] RSVP saved to Google Sheets, one new row per submission, exportable, with a Summary tab
- [x] Wishes shown below the RSVP with name + message, refreshed every 30 s, and instant for the sender
- [x] Moderation: hide any wish with one checkbox
- [x] Gift section "Wanna give us some gifts?" with BCA + CIMB Niaga and copy buttons, plus a WhatsApp delivery-address button
- [x] Closing section
- [x] Floating music button (pauses when the video plays or the tab is hidden)
- [x] Mobile-first, iPhone safe-areas, desktop split layout, smooth scrolling, reduced-motion support
- [x] Spam honeypot, formula-injection protection, input length limits
- [x] Event time: Akad 13.00–14.30, Resepsi 14.30–17.00 WIB (calendar event 13.00–17.00)
- [ ] Replace placeholder photos, add video and music (see "Adding your media")
- [ ] Apps Script deployed + `scriptUrl` filled in (Step 2)
- [ ] WhatsApp numbers (Step 3)
