# Love Landing for Simran — A Small Surprise

This is a personal, single-page website gift designed for Simran. It features a particle-animated background, a photo carousel, a typewriter love note, and a hidden message section.

## Features
- **Responsive Design**: Works on mobile and desktop.
- **Dreamy Aesthetics**: Floating particles, glassmorphism, and soft gradients.
- **Interactive**: "Open Gift" reveal, confetti burst, and music player.
- **Personalized**: Easy to update name, photos, and messages.

## Quick Start (Run Locally)

If you have Python installed (most Windows/Macs do):
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

Or if you have Node.js:
```bash
npx serve
```

## How to Personalize

### 1. Change the Name
Open `index.html` and change:
```html
<html lang="en" data-her-name="Simran" data-theme="dreamy">
```
And inside `scripts/main.js`, update the `herName` default if you like.

### 2. Replace Photos
Replace the files in `assets/images/` with your own (Keep names `photo1.jpg`, `photo2.jpg`, `photo3.jpg` for easiest swap, or update `index.html`).

### 3. Change Messages
Open `scripts/main.js` and edit the `messages` array:
```javascript
messages: [
    "Your message here...",
    "Another line...",
]
```

### 4. Background Music
Replace `assets/audio/ambient.mp3` with your preferred track.

## Deployment (GitHub Pages)

To publish this on the internet for free:

1.  **Create a new Repository** on GitHub (e.g., `simran-birthday`).
2.  **Push your code**:
    ```bash
    git remote add origin https://github.com/<your-username>/simran-birthday.git
    git branch -M main
    git add .
    git commit -m "Ready for Simran"
    git push -u origin main
    ```
3.  **Wait for Action**: The included `.github/workflows/deploy.yml` will automatically build and publish your site.
4.  **Enable Pages**: Go to Repo Settings > Pages > Source is "gh-pages" branch (if not auto-selected).

## Final Checklist before Sharing
- [ ] Replaced `HER_NAME` if different from Simran.
- [ ] Replaced the 3 placeholder photos.
- [ ] Added real music to `assets/audio/ambient.mp3`.
- [ ] Tested the "Secret Message" modal.
- [ ] Verified on Mobile.
- [ ] Sent the link!

---
*Created with Love & Code.*
