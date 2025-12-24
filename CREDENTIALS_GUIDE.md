# ServicAI Credential Gathering Guide

## ✅ Environment Files Created

I've created the following files for you:

- `.env.production` (Frontend environment variables)
- `backend.env.yaml` (Backend environment variables)

Now you need to fill in the credentials. Follow this guide step-by-step.

---

## 🔑 Step 1: Firebase Frontend Credentials

**What you need:** Firebase configuration for your web app

**How to get it:**

1. **Open Firebase Console** (I've already opened it for you in the browser)
2. **Click on "AI Dental Receptionist SaaS" project**
3. **Click the ⚙️ gear icon** next to "Project Overview" → Select "Project settings"
4. **Scroll down to "Your apps"** section
5. **If you don't have a web app yet:**
   - Click "Add app" → Select Web (</> icon)
   - Give it a nickname: "ServicAI Web"
   - Click "Register app"
6. **Copy the configuration values:**

```javascript
const firebaseConfig = {
  apiKey: "...",           // Copy this
  authDomain: "...",       // Copy this
  projectId: "...",        // Copy this
  storageBucket: "...",    // Copy this
  messagingSenderId: "...", // Copy this
  appId: "..."             // Copy this
};
```

7. **Open `.env.production` and fill in:**

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<paste apiKey here>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<paste authDomain here>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<paste projectId here>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<paste storageBucket here>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<paste messagingSenderId here>
NEXT_PUBLIC_FIREBASE_APP_ID=<paste appId here>
```

---

## 🔐 Step 2: Firebase Admin SDK (Service Account)

**What you need:** Private key for server-side Firebase operations

**How to get it:**

1. **In Firebase Console** → Project Settings (⚙️)
2. **Click "Service accounts" tab**
3. **Click "Generate new private key"** button
4. **Click "Generate key"** in the confirmation dialog
5. **A JSON file will download** (e.g., `ai-dental-receptionist-saas-xxxxx.json`)

6. **Open the downloaded JSON file** and find these values:

```json
{
  "project_id": "ai-dental-receptionist-saas",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@ai-dental-receptionist-saas.iam.gserviceaccount.com"
}
```

7. **Fill in `.env.production`:**

```bash
FIREBASE_ADMIN_PROJECT_ID=ai-dental-receptionist-saas
FIREBASE_ADMIN_CLIENT_EMAIL=<paste client_email here>
FIREBASE_ADMIN_PRIVATE_KEY="<paste entire private_key here, including -----BEGIN and -----END>"
```

8. **Fill in `backend.env.yaml`:**

```yaml
FIREBASE_PROJECT_ID: "ai-dental-receptionist-saas"
FIREBASE_CLIENT_EMAIL: "<paste client_email here>"
FIREBASE_PRIVATE_KEY: "<paste entire private_key here>"
```

**⚠️ Important:** Keep the quotes around the private key!

---

## 🤖 Step 3: Gemini API Key

**What you need:** API key for Gemini AI

**How to get it:**

1. **Go to:** <https://makersuite.google.com/app/apikey>
2. **Click "Create API Key"**
3. **Select project:** "ai-dental-receptionist-saas"
4. **Click "Create API key in existing project"**
5. **Copy the API key** (starts with `AIza...`)

6. **Fill in `.env.production`:**

```bash
GEMINI_API_KEY=<paste your key here>
```

7. **Fill in `backend.env.yaml`:**

```yaml
GEMINI_API_KEY: "<paste your key here>"
```

---

## 📞 Step 4: Twilio Credentials (Optional - for Voice)

**What you need:** Twilio Account SID, Auth Token, and Phone Number

**How to get it:**

1. **Go to:** <https://console.twilio.com>
2. **Log in** to your Twilio account
3. **On the Dashboard**, you'll see:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "Show" to reveal)
4. **Go to Phone Numbers** → Active Numbers
5. **Copy your Twilio phone number** (e.g., `+34XXXXXXXXX`)

6. **Fill in `backend.env.yaml`:**

```yaml
TWILIO_ACCOUNT_SID: "<paste Account SID here>"
TWILIO_AUTH_TOKEN: "<paste Auth Token here>"
TWILIO_PHONE_NUMBER: "<paste phone number here>"
```

**Note:** If you don't have Twilio yet, you can skip this and add it later.

---

## ✅ Verification Checklist

Before proceeding to deployment, verify:

- [ ] `.env.production` has all Firebase credentials filled in
- [ ] `.env.production` has Gemini API key
- [ ] `backend.env.yaml` has Firebase Admin credentials
- [ ] `backend.env.yaml` has Gemini API key
- [ ] `backend.env.yaml` has Twilio credentials (or marked as TODO)
- [ ] No placeholder values like "your_key_here" remain
- [ ] Private keys include the full `-----BEGIN PRIVATE KEY-----` header

---

## 🚀 Next Steps

Once all credentials are filled in:

1. **Save both files** (`.env.production` and `backend.env.yaml`)
2. **Verify the files:**

   ```powershell
   Get-Content .env.production | Select-String "your_"
   Get-Content backend.env.yaml | Select-String "your_"
   ```

   (Should return nothing if all placeholders are replaced)

3. **Tell me when ready**, and I'll proceed with:
   - Deploying Firestore rules
   - Building and testing locally
   - Deploying to Cloud Run and Firebase Hosting

---

## 📝 Quick Reference

**Files to edit:**

- `C:\Users\HATIM\Downloads\AI Dental Receptionist\.env.production`
- `C:\Users\HATIM\Downloads\AI Dental Receptionist\backend.env.yaml`

**Links:**

- Firebase Console: <https://console.firebase.google.com/project/ai-dental-receptionist-saas>
- Gemini API Keys: <https://makersuite.google.com/app/apikey>
- Twilio Console: <https://console.twilio.com>

**Need help?** Let me know which credential you're stuck on!
