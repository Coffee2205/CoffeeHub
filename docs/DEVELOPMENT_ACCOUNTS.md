# Development accounts

Task 07 browser verification uses two Supabase Auth accounts in the development project. Never commit their credentials or reuse production accounts.

## Required personas

- **Admin**: confirmed email/password account with `app_metadata.role` set to `admin`.
- **User**: confirmed email/password account without the Admin role.

Add credentials only to the ignored `.env.local` file:

```dotenv
E2E_ADMIN_EMAIL="development-admin@example.test"
E2E_ADMIN_PASSWORD="replace-locally"
E2E_USER_EMAIL="development-user@example.test"
E2E_USER_PASSWORD="replace-locally"
```

If a database password contains URL-reserved characters, URL-encode the password segment in `DATABASE_URL` and `DIRECT_URL`. In particular, encode `$` as `%24` so Next.js does not expand it as an environment-variable reference.

After changing `app_metadata.role`, sign out and sign in again so Supabase issues a refreshed JWT.

## Verification flow

1. Anonymous opens `/` and cannot open `/admin/preview`.
2. User signs in through `/login`, can open `/app/dashboard`, and is redirected to `/unauthorized` from `/admin/preview`.
3. Admin signs in, edits content under `/admin`, opens `/admin/preview`, publishes it, then confirms the result in an anonymous window.

Do not put passwords, tokens, database URLs or screenshots containing personal information in Git.
