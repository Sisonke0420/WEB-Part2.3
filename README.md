# Free State Animal Rescue

A responsive multi-page website for a fictional animal rescue organisation in the Free State, South Africa.

## Project overview

This project includes a landing page and supporting pages for:

- Home
- Our story
- How to help
- Happy tails
- Contact

The site uses semantic HTML, modern CSS styling, and a small JavaScript enhancement for the theme toggle and mobile navigation.

## Features

- Responsive layout for desktop and mobile devices
- Fixed navigation bar with mobile menu
- Dark/light theme toggle
- Google Fonts typography
- Story, service, testimonial, and contact sections
- Simple content-focused design for a non-profit animal rescue brand

## SEO

- Each page has a unique title and meta description, plus Open Graph and
  summary-card metadata for social sharing.
- The document language is set to South African English (`en-ZA`).
- Replace `example.com` in `robots.txt` and `sitemap.xml` with the production
  domain before deployment. Publish both files at the site root, then submit
  the sitemap in Google Search Console.
- Replace fictional organisation details, statistics, and stories with
  verified information before publishing.

## Performance and security

- Below-the-fold photographs use lazy loading and asynchronous decoding; the
  homepage hero and first splash photo are prioritised.
- `_headers` configures a restrictive Content Security Policy and common
  browser security headers for static hosts that support the Netlify/Cloudflare
  Pages `_headers` format. Confirm the deployed response headers with the host.
- Use HTTPS in production. Configure a redirect from the host's default URL
  to the chosen canonical domain before adding canonical tags or submitting
  the sitemap.

## Project structure

- `home.html` — homepage
- `about.html` — mission and story page
- `services.html` — volunteer and donation opportunities
- `Testimonial.html` — success stories and adoption highlights
- `contact.html` — contact information and support details
- `styles.css` — shared styling and layout
- `app.js` — theme toggle, menu toggle, and interactive effects
- `robots.txt` and `sitemap.xml` — crawler access and page discovery
- `_headers` — security and cache headers for compatible static hosts
- `assets/` — images and other static media
- `references.md` — supporting references and inspiration list

## How to run

Open `home.html` in a browser, or use a local preview extension such as Live Server in VS Code.

## Validation

Install the development tools with `npm install`, then run `npm run validate` to
check all HTML pages with html-validate and check `app.js` with ESLint. Run
`npm run validate:html` or `npm run validate:js` to run either check separately.
GitHub Actions runs the combined validation on every push and pull request.

## References

See [references.md](references.md) for the design, technical, and learning references used for this project.
