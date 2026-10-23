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

# Tantrade Gallery Admin Panel

A secure, claymorphism-styled administrative interface for managing the "Made in Tanzania" product gallery. This panel allows authorized users to upload images, videos, or YouTube directive links, which are then displayed on the public-facing gallery site.

## Architecture

- Hosting: Cloudflare Pages (Fast, global CDN)
- Database: Supabase (PostgreSQL)
- File Storage: Supabase Storage (Handles PNG, JPG, WEBP, MP4, WEBM)

## Features

- Claymorphism UI Design: Soft shadows, rounded corners, and a clean, modern aesthetic.
- Multi-format Media Support: Upload local image/video files or paste YouTube directive links.
- Bilingual Data Entry: Dedicated fields for both English and Swahili content.
- Real-time Management: View, add, and delete gallery items instantly.
- Zero Emojis: Professional SVG icons used exclusively throughout the interface.

## Project Structure

tantrade-admin/
├── admin.html      # Admin interface structure
├── admin.css       # Claymorphism styling
├── admin.js        # Supabase integration and form logic
└── README.md       # Documentation

## Setup Instructions

### 1. Supabase Configuration
1. Create a new project at supabase.com.
2. Navigate to the Table Editor and create a table named `gallery_products` with the following columns:
   - id (int8, primary key)
   - created_at (timestamp)
   - title_en (text)
   - title_sw (text)
   - category (text)
   - description_en (text)
   - description_sw (text)
   - media_type (text)
   - media_url (text)
3. Navigate to Storage and create a new public bucket named `gallery-media`.
4. Go to Project Settings > API and copy your Project URL and anon public key.

### 2. Local Configuration
1. Open `admin.js`.
2. Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase credentials.

### 3. Deployment
1. Push this repository to GitHub.
2. Log in to Cloudflare Dashboard > Workers & Pages > Create > Pages.
3. Connect to your GitHub repository.
4. Set Build command to empty, and Output directory to `/`.
5. Deploy.

## Security Note

For production environments, ensure Row Level Security (RLS) is enabled on the `gallery_products` table and the `gallery-media` storage bucket in Supabase. Configure authentication (e.g., Supabase Auth) to restrict access to the `admin.html` page to authorized personnel only.

## License

Copyright 2026 Tantrade - Tanzania Trade Development Authority. All rights reserved.
