# LeonjAI site setup

## Folders
```
CNAME, index.html, robots.txt, sitemap.xml
app/
  account/ login/ reset/ pay-peso/ pages
  assets/css  assets/img  assets/js   styles, images, scripts
  database/                           schema.sql, migration.sql to migration8.sql
  docs/                               this file
```

## Supabase
1. Create a project at supabase.com.
2. SQL Editor: run `schema.sql`, then `migration.sql`, `migration2.sql`, `migration3.sql`, `migration4.sql`, `migration5.sql`, `migration6.sql`, `migration7.sql`, `migration8.sql`, in that order.
3. Project Settings > API: copy the Project URL and the **anon** key into `app/assets/js/config.js`. Never use the `service_role` key.
4. Authentication > URL Configuration: set Site URL to your domain and add `https://your-domain.example/app/account/` and `https://your-domain.example/app/reset/` to Redirect URLs. The site uses clean folder URLs; each folder's `index.html` is served as its default page.
5. Authentication > Providers > Email: choose whether people must confirm their email.

## Peso payments
Fill in `PAY_PESO` in `config.js` with your GCash and bank details. When someone pays, they enter the reference from their receipt. Check your account, then set the row to `confirmed` in Table Editor > peso_payments. Amounts come from the browser, so match them to the money you received.

## Before launch
- Replace `your-domain.example` in `CNAME`, `index.html`, `sitemap.xml`, `robots.txt` and `config.js`.
- Replace `hello@leonjai.example` in `config.js` and the footer of `index.html`.
- Read quote requests in Table Editor > quote_requests.
