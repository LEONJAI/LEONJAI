# Getting customers and sales from this site

The site can now capture leads and measure which ads and links make money. It cannot create traffic by itself: visitors come from search, social posts and paid ads, and results depend on your offer, your prices and your ad spend.

## One-time setup (about 30 minutes)

1. **Save leads.** In Supabase, open the SQL editor and run `database/migration4.sql`. Quote requests then appear under Table Editor > `leads`, with the ad or link each one came from. Reply to new leads the same day: speed wins most small design jobs.
2. **Measure traffic and ads.** Create a Google Analytics 4 property and paste its ID (`G-...`) into `GA4_ID` in `assets/js/config.js`. For Facebook and Instagram ads, create a Meta pixel and paste its ID into `META_PIXEL_ID`. A cookie notice appears only when one of these is set, and tracking starts only after a visitor accepts.
3. **Add click-to-chat.** Put your WhatsApp number (digits only, with country code, for example `639161234567`) in `WHATSAPP`, and/or your Facebook page username in `MESSENGER`. A chat button then shows on every screen size.
4. **Use real Stripe links.** Replace the test links in `assets/js/config.js` (`PAY_LINKS`, including each `vault-...` item) with live ones, or buyers cannot pay you.
5. **Get found on Google.** Add the site in Google Search Console and submit `https://jeisaru.com/sitemap.xml`. Create a free Google Business Profile for local searches.

## Tag every ad and post link

Add `?utm_source=facebook&utm_campaign=logo-offer` (change the words) to each link you share. The form stores these with every lead, so you can see which ads bring paying customers and stop paying for the rest.

## What to advertise first

- Start with one clear offer, such as "Logo design, 3 concepts, from $300", not the whole menu.
- Facebook and Instagram ads work well for local small businesses. Begin with a small daily budget, one audience (business owners in your area) and two or three different images. Keep the ones that bring leads and pause the rest after a few days.
- Post finished work and before/after shots on Instagram, Facebook and Behance, with a link to the site in your bio.
- Ask every happy client for a short review and add it to the site (only real ones).
- Offer the gallery monthly subscription once you have enough items; recurring revenue is steadier than one-off jobs.
