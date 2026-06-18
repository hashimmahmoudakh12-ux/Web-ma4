# Al Maqam Al Mahmoud — Website

A premium, bespoke website for **Al Maqam Al Mahmoud (المقام المحمود)**, a devotional Islamic nasheed group.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Home page (hero, story, video, gallery, CTA) |
| `booking.html` | Interactive calendar + booking enquiry form |
| `contact.html` | Contact info card + message form |
| `style.css` | All styles — no framework, no build step |
| `script.js` | Navigation, scroll-reveal, calendar, form logic |

---

## Deployment (GitHub Pages)

1. Push all five files to the root of a GitHub repository.
2. Go to **Settings → Pages** and set Source to `main` branch, `/ (root)`.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

No build step, no npm, no dependencies — it just works.

---

## Connecting a Contact / Booking Email Service

The forms show an elegant Arabic confirmation message by default. To actually receive submissions by email, choose one of these options:

### Option A — Formspree (easiest)

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and copy your endpoint URL (e.g. `https://formspree.io/f/abcd1234`).
3. In `booking.html`, change `<form id="booking-form" ...>` to:
   ```html
   <form id="booking-form" class="booking-form" action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
4. In `script.js`, uncomment the **Formspree block** inside `initBookingForm()`.
5. Repeat for `contact.html` / `initContactForm()`.

### Option B — EmailJS

1. Create a free account at [emailjs.com](https://emailjs.com).
2. Add the EmailJS CDN to the `<head>` of `booking.html` and `contact.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
3. In `script.js`, uncomment the **EmailJS block** and fill in your `SERVICE_ID`, `TEMPLATE_ID`, and `USER_ID`.

### Option C — Netlify Forms (if hosted on Netlify)

Add `data-netlify="true"` and `name="contact"` to the `<form>` element. Netlify captures submissions automatically — no code change needed.

---

## Customisation Guide

### Updating Unavailable Dates

Open `script.js` and find the `UNAVAILABLE_DATES` Set near the top of `initCalendar()`:

```js
const UNAVAILABLE_DATES = new Set([
  '2026-07-04',
  '2026-08-15',
  // add more dates in YYYY-MM-DD format
]);
```

Add or remove dates to mark them red (unavailable) on the calendar. Past dates are greyed out automatically.

### Embedding Your Instagram Reel

In `index.html`, find the `.video-embed` div and replace its contents with the embed snippet from Instagram:

1. Go to your reel on Instagram.
2. Tap the three-dot menu → **Embed**.
3. Copy the `<blockquote>` + `<script>` snippet.
4. Paste it inside `.video-embed`.

Alternatively, embed a YouTube Short `<iframe>` — see the comment in `index.html`.

### Changing the Email Address

In `contact.html`, find:
```html
<a href="mailto:contact@almaqamalmahmoud.com">
  contact@almaqamalmahmoud.com
</a>
```
Replace both instances with your actual email address.

### Updating Brand Copy

All text is real and written in the Islamic tradition — edit directly in the HTML files. No template engine or CMS is involved.

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--green-deep` | `#0B3D2E` | Page background |
| `--green-dark` | `#071F17` | Darker sections, nav |
| `--gold` | `#D4AF37` | Accents, borders, buttons |
| `--gold-light` | `#E8C84A` | Hover states |
| `--cream` | `#F8F3E7` | Primary text |
| `--cream-body` | `#C8BFA8` | Body / secondary text |

---

*May Allah accept this work and bless every gathering it serves.*
