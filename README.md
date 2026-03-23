# The 1% Better Program - Website

A clean, properly structured static website for The 1% Better Program - AI Clone Marketing System.

## Project Structure

```
creatorsguide/
├── index.html              # Main HTML file
├── embed.html              # Embedded content (Instagram Reel)
├── css/
│   └── styles.css         # All styles and CSS
├── js/
│   └── main.js            # JavaScript functionality
├── images/                # All image assets
│   ├── logo.png
│   ├── hero-ai-clone.jpeg
│   ├── create-ai-clone.jpeg
│   ├── create-content-minutes.jpeg
│   ├── earn-affiliate.jpeg
│   ├── turn-content-income.jpeg
│   ├── step1-create-clone.jpeg
│   ├── step2-create-content.jpeg
│   ├── step3-post-system.jpeg
│   ├── step4-monetize.jpeg
│   └── why-works.jpeg
└── README.md              # This file
```

## Features

✅ **Clean Folder Structure** - Organized with separate folders for CSS, JS, and images
✅ **Responsive Design** - Mobile-first design that works on all devices
✅ **Modern Styling** - Using CSS with custom properties for maintainability
✅ **Smooth Scrolling** - Smooth navigation to anchor sections
✅ **Interactive FAQ** - Collapsible FAQ section with toggle functionality
✅ **Optimized Images** - Properly named and organized image assets
✅ **Performance** - Lightweight vanilla JavaScript, no frameworks needed

## Sections

1. **Header** - Sticky navigation with logo and menu
2. **Hero** - Main value proposition with CTA buttons
3. **What People Are Doing** - 4-column grid showcasing features
4. **How It Works** - 4-step process with visual guide
5. **What We'll Build** - Features with Instagram embed
6. **Why This Works** - Benefits and social proof
7. **What's Inside** - 6-feature grid of the system
8. **Pricing** - Value breakdown and pioneer pricing
9. **Vision** - Community and mission statement
10. **FAQ** - Frequently asked questions
11. **Footer** - Links and copyright

## Color Palette

- **Background**: #F5F0EB (Warm beige)
- **Ink**: #1A1A1A (Dark charcoal)
- **Muted**: #5A5A5A (Gray)
- **Accent**: #A0845C (Gold/Tan)
- **Accent Dark**: #8A6F48 (Dark gold)
- **Warm**: #C4A484 (Light tan)

## Typography

- **Headings**: Playfair Display (Google Fonts)
- **Body**: Inter (Google Fonts)

## How to Use

### Option 1: Direct File Opening
Simply double-click `index.html` to open in your browser.

### Option 2: Local Server (Recommended)
For the best experience, serve the files with a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Customization

### Editing Content
- Open `index.html` in any text editor
- Update text content, links, and meta tags
- Replace image files in the `images/` folder

### Editing Styles
- Open `css/styles.css`
- Modify colors in the `:root` variables
- Adjust spacing, typography, and layouts

### Editing Functionality
- Open `js/main.js`
- Add custom interactions
- Modify FAQ behavior
- Add analytics or tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Optimize Images**: Use tools like TinyPNG to compress images
2. **Enable Caching**: Set proper cache headers on your server
3. **Minify CSS/JS**: Use minified versions for production
4. **Use WebP**: Consider converting images to WebP format

## Deployment

This is a static website and can be deployed to:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect to Git repository
- **GitHub Pages**: Push to gh-pages branch
- **Any web host**: Upload via FTP

## License

© 2026 The 1% Better Program. All rights reserved.

## Contact

For questions or support, visit: https://nas.io/theonepercentbetterprogram

---

**Built with ❤️ using clean HTML, CSS, and vanilla JavaScript**
