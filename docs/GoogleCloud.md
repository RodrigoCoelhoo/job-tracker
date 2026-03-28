# Google Cloud Setup

## 1. Create a project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **New Project**
3. Give it a name and click **Create**

## 2. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**
2. Fill in the required fields:
   - App name
   - User support email
   - Developer contact email
3. Select **External**
4. Click **Save and Continue**

---

## 3. Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client ID**
3. Set **Application type** to **Web application**
4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:80
   ```
5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5000/auth/callback

   https://<supabase-project-id>.supabase.co/auth/v1/callback
   ```
6. Click **Create**

---

## 4. Get your credentials

Copy the generated values and paste them into `backend/.env`:

| Variable | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID |
| `GOOGLE_CLIENT_SECRET` | Client secret |

> [!CAUTION]
> ⚠️ Never commit these values to version control.