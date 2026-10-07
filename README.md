# Stitchcraft website

A static one-page site (HTML, CSS and a little JavaScript, with no build step) for hosting on GitHub Pages.

## Files
- `index.html`: the page
- `styles.css`: styling (black, white and gold, mobile-first)
- `script.js`: enquiry form (AJAX submit to Formspree, with an email fallback)
- `assets/`: logo, product photos, favicons and the social share image (`og-image.jpg`)
- `CNAME`: your custom domain (placeholder)
- `robots.txt`, `sitemap.xml`, `favicon.ico`, `.nojekyll`

## Placeholders to replace
1. **Domain:** already set to `stitchcraftclothing.com` in `CNAME`, `index.html`, `robots.txt` and `sitemap.xml`.
2. **Formspree form ID:** in `index.html`, replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"`.
   Until you do this, the form shows a message offering to send the enquiry by email instead.

## 1. Create the GitHub repo and push
```bash
cd stitchcraft-site
git init
git add .
git commit -m "Stitchcraft site"
git branch -M main
git remote add origin https://github.com/Darohx/stitchcraft-site.git
git push -u origin main
```
(Create the empty repo on github.com first: **New repository**, set it to Public, and don't add a README.)

## 2. Turn on GitHub Pages
Open the repo's **Settings → Pages**. Under **Source**, choose *Deploy from a branch*, then pick branch `main` and folder `/ (root)` and click **Save**.

## 3. Custom domain DNS
At your domain registrar's DNS settings, add:

| Type  | Name / Host | Value                    |
|-------|-------------|--------------------------|
| A     | @           | 185.199.108.153          |
| A     | @           | 185.199.109.153          |
| A     | @           | 185.199.110.153          |
| A     | @           | 185.199.111.153          |
| CNAME | www         | Darohx.github.io  |

Remove any other A or AAAA records on `@` (for example the registrar's "parking" page). Then go to **Settings → Pages**, enter your domain under **Custom domain**, wait for the DNS check to pass (it can take anywhere from a few minutes to 24 hours), and tick **Enforce HTTPS**.

## 4. Set up the enquiry form (Formspree)
1. Sign up free at https://formspree.io using **stitchcraftdesignuk@gmail.com**, so enquiries land in that inbox.
2. Click **New form**, name it "Stitchcraft quotes", and copy the form ID (the part after `/f/`, e.g. `xyzabcd`).
3. Paste the ID into `index.html` in place of `YOUR_FORM_ID`, then commit and push.
4. Send a test enquiry from the live site. The first submission may ask you to confirm your email.

**File uploads:** Formspree only accepts file attachments on a **paid plan**. On the free plan, an enquiry with a file attached will fail. The site already tells people under the upload box that they can WhatsApp or email their logo instead, and the error message offers the same options. You can either upgrade Formspree, or remove the upload field (the `<div class="field">` containing `f-upload` in `index.html`) and rely on WhatsApp or email for logos. The free plan also has a monthly submission limit (currently 50).

## 5. QR code for the flyer
Once the site is live on your domain, generate a QR code that points to `https://stitchcraftclothing.com` (your real domain). Free options include https://www.qrcode-monkey.com or https://qr.io, or on the command line: `qrencode -o qr.png -s 12 "https://yourdomain.co.uk"`.
Use a **static** QR code (not a "dynamic" or trackable one that depends on a subscription), download it as PNG or SVG, and test it with your phone before printing.

## Editing tips
- Prices are in the table in `index.html` (search for `£13.49`).
- Colours are defined at the top of `styles.css` (`--gold` and the others).
- The privacy note is in the footer of `index.html`. Adjust the retention period (currently 12 months) if you need to.
