# Setup for jeisaru.com

1. Email forwarding (Porkbun): Domain Management > envelope icon next to jeisaru.com > Create a New Forwarding Address.
2. Login database: create a free Supabase project, run database/schema.sql, paste URL and anon key into assets/js/config.js.
   In Supabase > Authentication > URL Configuration, set Site URL to https://jeisaru.com.
3. Payments: in Stripe, create a Payment Link per product and paste each link into assets/js/config.js.
4. Hosting: upload this folder to Cloudflare Pages, Netlify or Vercel, then point jeisaru.com to it in Porkbun DNS.

## Paid member workstation

Run `database/migration5.sql` in the Supabase SQL Editor after the existing profile migrations. After a subscription payment has been confirmed, grant access to that member from the SQL Editor:

```sql
update public.profiles
set subscription_active = true
where id = (select id from auth.users where email = 'member@example.com');
```

When the subscription ends or is refunded, set `subscription_active = false` for that profile. The profile page shows **My workstation** only when this flag is true. Row and storage policies also check the flag, so hiding the control is not the only access check. Subscription payments currently use external payment links and do not automatically update this status; confirm payment before granting access.
