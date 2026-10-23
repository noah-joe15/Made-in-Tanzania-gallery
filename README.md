# Tantrade - Made in Tanzania Gallery

An official gallery website showcasing products proudly Made in Tanzania, built for the Tanzania Trade Development Authority (Tantrade).

## Live Site

Deployed on Cloudflare Pages.

## Features

- Product Gallery: Browse Tanzanian products by category (Textiles, Food, Crafts, Agriculture, Manufacturing)
- Bilingual Support: Full English (EN) and Swahili (SW) language toggle
- Product Registration: Call-to-action section for manufacturers to register their products
- Documentary Section: Dedicated placeholder for the "Made in Tanzania" documentary
- Fully Responsive: Optimized for mobile, tablet, and desktop devices
- Fast and Lightweight: Pure HTML, CSS, and JavaScript with no external framework dependencies

## Project Structure

tantrade-gallery/
├── index.html      # Main page structure
├── style.css       # All styling and responsive design
├── script.js       # Gallery data, language switching, and interactions
├── _redirects      # Cloudflare Pages redirect configuration
└── README.md       # Project documentation

## Deployment on Cloudflare Pages

### Step 1: Create a GitHub Repository
1. Go to github.com and create a new repository named `tantrade-gallery`.
2. Upload all project files (`index.html`, `style.css`, `script.js`, `_redirects`, `README.md`).

### Step 2: Connect to Cloudflare Pages
1. Log in to the Cloudflare Dashboard (dash.cloudflare.com).
2. Navigate to Workers & Pages > Create > Pages.
3. Click "Connect to Git".
4. Select your `tantrade-gallery` repository.
5. Configure build settings:
   - Framework preset: None
   - Build command: Leave empty
   - Build output directory: / (root)
6. Click "Save and Deploy".

### Step 3: Custom Domain (Optional)
1. In the Cloudflare Pages dashboard, navigate to "Custom domains".
2. Add your domain (e.g., gallery.tantrade.go.tz).
3. Cloudflare will automatically configure the DNS records.

## How to Update Content

### Adding New Products
Open `script.js` and add a new object to the `galleryProducts` array. Ensure you use an inline SVG string for the `icon` property to maintain visual consistency.
