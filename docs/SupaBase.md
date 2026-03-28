# Supabase Setup

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose a name, database password, and region


## 2. Get your credentials


### Project ID
1. Go to **Project Settings → General Settings**
3. Get **Project ID**

### Service Role Key
1. Go to **Project Settings → API Keys**
2. Change to **"Legacy anon, service_role API keys"**
3. Reveal **service_role**

> [!WARNING]  
> The `service_role` key has admin privileges - never expose it on the frontend.

---

### Paste credentials into `backend/.env`.
| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | https://`<project-id>`.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` |

---

## 3. Create the database tables

Go to **SQL Editor** and run the following:

```sql
CREATE TYPE application_status AS ENUM ('Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted');

CREATE TYPE application_type AS ENUM ('Full-time', 'Internship', 'Contract', 'Part-time');

create table public.users (
  id UUID primary key default gen_random_uuid (),
  email TEXT unique not null,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT unique,
  created_at timestamp with time zone default NOW()
);

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    location TEXT,
    role TEXT NOT NULL,
    type application_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status application_status NOT NULL DEFAULT 'Applied',
    notes TEXT
);

CREATE TABLE interviews (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT
);
```

---

## 4. Enable Row Level Security (RLS)

Run this to ensure users can only access their own data:

```sql
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
```

> [!NOTE]  
> The backend uses the `service_role` key which bypasses RLS, so no additional policies are needed for this setup.

