# ServicAI Final Configuration Guide

## 1. ✅ Frontend API Integration (COMPLETE)

Updated `src/app/landing/page.tsx` to use the Firebase Functions API:

- Form submits to `/api/submit-lead`
- Correct data format for API
- Success/error handling

## 2. 📞 Twilio Webhook Configuration

### Step 1: Access Twilio Console

1. Go to <https://console.twilio.com>
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your phone number: **+34623455155**

### Step 2: Configure Voice Webhook

In the "Voice & Fax" section:

**A Call Comes In:**

```
Webhook: https://ai-dental-receptionist-saas.web.app/api/voice/webhook
HTTP: POST
```

**Primary Handler Fails:**

```
Fallback URL: https://ai-dental-receptionist-saas.web.app/api/health
HTTP: GET
```

### Step 3: Save Configuration

Click **Save** at the bottom of the page

### Step 4: Test

Call **+34623455155** and you should hear:
> "Bienvenido a ServicAI, su recepcionista virtual para clínicas dentales..."

---

## 3. 🌐 Custom Domain Configuration (servicai.app)

### Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/project/ai-dental-receptionist-saas/hosting)
2. Click **Hosting** in left menu
3. Click **Add custom domain**
4. Enter: `servicai.app`
5. Click **Continue**

Firebase will provide DNS records like:

```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195

Type: TXT
Name: @
Value: [verification string]
```

### Step 2: IONOS DNS Configuration

1. Log in to [IONOS](https://www.ionos.es)
2. Go to **Domains** → **servicai.app** → **DNS Settings**
3. Add the following records:

**A Records (for root domain):**

```
Type: A
Hostname: @
Points to: 151.101.1.195
TTL: 3600

Type: A
Hostname: @
Points to: 151.101.65.195
TTL: 3600
```

**TXT Record (for verification):**

```
Type: TXT
Hostname: @
Value: [paste the verification string from Firebase]
TTL: 3600
```

**Optional - WWW Subdomain:**

```
Type: CNAME
Hostname: www
Points to: ai-dental-receptionist-saas.web.app
TTL: 3600
```

### Step 3: Wait for Propagation

- DNS changes can take 24-48 hours
- Usually works within 1-2 hours
- Check status: <https://dnschecker.org>

### Step 4: Verify in Firebase

1. Return to Firebase Console
2. Click **Verify** on the domain setup page
3. Once verified, Firebase will provision SSL certificate
4. Your site will be live at `https://servicai.app`

---

## 4. 🔐 Firebase Authentication Setup

### Step 1: Enable Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com/project/ai-dental-receptionist-saas/authentication)
2. Click **Authentication** → **Get Started**
3. Click **Sign-in method** tab

### Step 2: Enable Email/Password

1. Click **Email/Password**
2. Toggle **Enable**
3. Click **Save**

### Step 3: Create Admin User (Optional)

**Via Firebase Console:**

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Add user**

**Via Command Line:**

```powershell
firebase auth:import users.json
```

### Step 4: Update Frontend for Auth

Create `src/lib/firebase-client.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Step 5: Add Login Functionality

Update `src/app/landing/page.tsx`:

```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    toast({
      title: "Error de autenticación",
      description: "Email o contraseña incorrectos",
      variant: "destructive",
    });
  }
};
```

### Step 6: Protect Dashboard Routes

Create `src/app/dashboard/layout.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.Node }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/landing');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
```

---

## 5. 🔒 Protect API Endpoints (Optional)

Update `functions/index.js` to require authentication:

```javascript
// Add auth middleware
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protect dashboard endpoints
app.get('/dashboard/stats', verifyAuth, async (req, res) => {
  // Only authenticated users can access
  // ...
});
```

---

## Quick Checklist

### Immediate Actions

- [x] Frontend updated to use API
- [ ] Configure Twilio webhook
- [ ] Add custom domain DNS records
- [ ] Enable Firebase Authentication

### Optional (Can do later)

- [ ] Add protected routes
- [ ] Implement user registration flow
- [ ] Add password reset functionality
- [ ] Set up email verification

---

## Testing

### Test API

```powershell
curl -X POST https://ai-dental-receptionist-saas.web.app/api/submit-lead `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@test.com\",\"phone\":\"+34600000000\"}'
```

### Test Twilio

Call **+34623455155** after configuring webhook

### Test Domain

Visit `https://servicai.app` after DNS propagation

### Test Auth

Try logging in at `/landing` after enabling Firebase Auth

---

## Support Links

- **Firebase Console**: <https://console.firebase.google.com/project/ai-dental-receptionist-saas>
- **Twilio Console**: <https://console.twilio.com>
- **IONOS DNS**: <https://www.ionos.es>
- **DNS Checker**: <https://dnschecker.org>

---

## Estimated Time

- Twilio webhook: **5 minutes**
- Custom domain: **5 minutes** (setup) + 1-24 hours (propagation)
- Firebase Auth: **15 minutes** (basic setup)
- Protected routes: **30 minutes** (full implementation)

**Total active work**: ~1 hour
