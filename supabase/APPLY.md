# Applying the Phase 2 database

These migrations create the entire schema, security, and storage for INK &
PAPER on a **fresh** Supabase project. No book content is inserted — only the
schema, policies, buckets, and the single seeded `site_settings` row.

Files run in filename order:

```
supabase/migrations/
  20250101000001_enums.sql                  enums
  20250101000002_tables.sql                 tables + indexes + front-matter guards
  20250101000003_functions_triggers_view.sql  helpers + reading_sequence view
  20250101000004_rls_policies.sql            Row Level Security
  20250101000005_storage.sql                 buckets + storage policies
  20250101000006_grants.sql                  role privileges
  20250101000007_seed_site_settings.sql      seed the public settings row
```

## Option A — Supabase SQL Editor (simplest)

1. Open your project → **SQL Editor** → **New query**.
2. Open each migration file **in the order above**, paste its contents, and
   **Run**. Do them one at a time, top to bottom.
3. After all seven run without error, check **Table Editor**: you should see
   `books`, `chapters`, `testimonials`, `profiles`, `site_settings`, and one
   row in `site_settings`. Under **Storage** you should see the `book-covers`
   and `testimonial-photos` buckets.

## Option B — Supabase CLI

```bash
# once, at the repo root
npx supabase init            # creates supabase/config.toml if not present
npx supabase login
npx supabase link --project-ref <YOUR-PROJECT-REF>

# push all migrations
npx supabase db push
```

## Create the author account (one time)

Public sign-up stays disabled. Create the single author user, then elevate it:

1. Dashboard → **Authentication** → **Users** → **Add user** → create the
   author's email + password. (The `handle_new_user` trigger auto-creates a
   matching `profiles` row with `role = null`.)
2. Copy that user's UUID, then in the SQL Editor run:

   ```sql
   update public.profiles set role = 'author' where id = '<AUTH-USER-UUID>';
   ```

That single row with `role = 'author'` is what `is_author()` checks, and what
every author-only policy depends on. No other account has write access.

## Regenerate the TypeScript types (recommended)

The committed `src/lib/database.types.ts` matches this schema. Once the project
exists you can regenerate it from the live database to stay perfectly in sync:

```bash
npx supabase gen types typescript \
  --project-id <YOUR-PROJECT-REF> --schema public \
  > src/lib/database.types.ts
```

## Set the Instagram URL (optional, when you have it)

Either edit `20250101000007_seed_site_settings.sql` before running, or update
it live (must be `https://`):

```sql
update public.site_settings
set instagram_url = 'https://instagram.com/your-handle'
where id = 1;
```
