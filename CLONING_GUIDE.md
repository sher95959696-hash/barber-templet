
# 🚀 Step-by-Step Rebranding Guide (Naye Client Ke Liye)

Agar aap kisi naye client ko ye app bech rahe hain, toh ye 5 kaam karein:

### Step 1: Firebase Project Setup
1. [Firebase Console](https://console.firebase.google.com/) pe naya project banayein.
2. **Firestore**: Enable karein aur rules mein `allow read, write: if true;` rakhein.
3. **Web App**: Project settings mein ja kar "Web App" add karein aur config keys copy karein.
4. **Cloud Messaging**: "Web Push certificates" mein VAPID key generate karein.
5. **Keys Update**: `firebase.ts` mein naye project ki keys aur VAPID key paste kar dein.

### Step 2: Branding Update
1. `constants.tsx` kholien.
2. `DEFAULT_BRANDING` mein client ki shop ka naam, logo aur primary color change karein.
3. Phone number aur WhatsApp number client ka dalein.

### Step 3: Android Build Config
1. `capacitor.config.ts` kholien.
2. `appId` ko unique banayein (e.g., `com.client_name.app`). **Ye boht zaroori hai**, warna ek hi phone pe doosra app install nahi hoga.
3. `appName` mein shop ka naam likhein jo icon ke niche nazar aaye.

### Step 4: Cloudinary Setup (For Images)
1. Client ke liye alag [Cloudinary](https://cloudinary.com/) account banayein.
2. Settings -> Upload mein ja kar ek **Unsigned Upload Preset** banayein.
3. Ye Cloud Name aur Preset name `constants.tsx` mein update kar dein ya direct App ke Admin Panel -> Setup tab mein save karein.

### Step 5: Generate APK
1. Code ko GitHub pe commit aur push karein.
2. GitHub repository mein **Actions** tab pe jayein.
3. Wahan "Build Android App" workflow automatically start ho jayega.
4. 5-7 minute baad "Artifacts" mein se APK download kar lein.

---
**Tip**: APK send karne se pehle client ko batayein ke unhein "Unknown Sources" enable karna hoga kyunki ye app abhi Play Store pe nahi hai.
