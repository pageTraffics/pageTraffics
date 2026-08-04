# Firebase Setup Guide

This guide will help you set up Firebase for the PageTraffics application.

## Prerequisites

- Node.js installed (v18 or higher)
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase account

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `pagetraffics` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll add rules later)
4. Choose a location (select closest to your users)
5. Click "Enable"

### Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **production mode**
4. Use the same location as Firestore
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `PageTraffics Web`
5. Copy the Firebase configuration object

## Step 4: Configure Frontend

1. Create `.env` file in `frontend/` directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. Or update `frontend/src/firebase/config.js` directly with your credentials

## Step 5: Initialize Firebase CLI

1. In project root, run:
```bash
firebase login
firebase init
```

2. Select:
   - ✅ Firestore
   - ✅ Functions
   - ✅ Storage
   - ✅ Hosting (optional)

3. Use existing project: Select your Firebase project

4. For Firestore:
   - Use existing `firestore.rules` file: **Yes**
   - Use existing `firestore.indexes.json`: **No**

5. For Functions:
   - Language: **JavaScript**
   - ESLint: **Yes**
   - Install dependencies: **Yes**

6. For Storage:
   - Use existing `storage.rules` file: **Yes**

## Step 6: Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 7: Set Up Cloud Functions

1. Install dependencies:
```bash
cd firebase/functions
npm install
```

2. Configure email settings:
```bash
firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
```

**Note:** For Gmail, you need to:
- Enable 2-Factor Authentication
- Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)

3. Deploy functions:
```bash
firebase deploy --only functions
```

## Step 8: Create Admin User

1. In Firebase Console, go to **Authentication** > **Users**
2. Manually add a user with admin email
3. Go to **Firestore Database**
4. Create a document in `users` collection:
   - Document ID: `{user-uid-from-auth}`
   - Fields:
     ```
     email: "admin@example.com"
     fullName: "Admin User"
     phoneNumber: "+1234567890"
     role: "admin"
     isBlocked: false
     createdAt: [timestamp]
     updatedAt: [timestamp]
     ```

## Step 9: Create Initial Data

### Create Services (Optional)
In Firestore, create a `services` collection with service documents:
```json
{
  "id": "web-dev",
  "name": "Web Development",
  "description": "Custom web development services"
}
```

### Create Payment Info
In Firestore, create a document in `paymentInfo` collection:
- Document ID: `default`
- Fields:
  ```
  upiId: "yourname@upi"
  bankDetails: "Bank Name: ...\nAccount: ...\nIFSC: ..."
  createdAt: [timestamp]
  ```

## Step 10: Deploy Frontend (Optional)

```bash
cd frontend
npm install
npm run build
firebase deploy --only hosting
```

## Firestore Collections Structure

### users
- `uid` (document ID)
  - `email`: string
  - `fullName`: string
  - `phoneNumber`: string
  - `role`: "user" | "admin"
  - `isBlocked`: boolean
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

### plans
- `planId` (document ID)
  - `serviceId`: string
  - `serviceName`: string
  - `name`: string
  - `price`: number
  - `description`: string
  - `isActive`: boolean
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

### meetings
- `meetingId` (document ID)
  - `userId`: string
  - `preferredDate`: timestamp
  - `preferredTime`: string
  - `message`: string
  - `status`: "pending" | "accepted" | "rejected"
  - `meetingUrl`: string (if accepted)
  - `adminMessage`: string (if accepted)
  - `selectedPlan`: object (optional)
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

### payments
- `paymentId` (document ID)
  - `userId`: string
  - `planId`: string
  - `planName`: string
  - `planPrice`: number
  - `transactionId`: string
  - `status`: "pending" | "verified" | "rejected"
  - `createdAt`: timestamp
  - `verifiedAt`: timestamp (if verified)

### projects
- `projectId` (document ID)
  - `userId`: string
  - `planId`: string
  - `planName`: string
  - `planPrice`: number
  - `status`: "pending" | "processing" | "completed"
  - `deliverables`: array of {name, url}
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
  - `completedAt`: timestamp (if completed)

### reviews
- `reviewId` (document ID)
  - `projectId`: string
  - `userId`: string
  - `writtenReview`: string
  - `videoReviewUrl`: string
  - `createdAt`: timestamp

### paymentInfo
- `default` (document ID)
  - `qrCodePath`: string (storage path)
  - `upiId`: string
  - `bankDetails`: string
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

## Security Rules

Security rules are already configured in:
- `firebase/firestore.rules` - Firestore security rules
- `firebase/storage.rules` - Storage security rules

Deploy them with:
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Testing

1. Start development server:
```bash
cd frontend
npm run dev
```

2. Test user registration and login
3. Test admin login (use admin credentials)
4. Test plan selection and payment flow
5. Test meeting scheduling
6. Test project lifecycle

## Troubleshooting

### Authentication Issues
- Ensure Email/Password provider is enabled
- Check Firebase config in `.env` file

### Firestore Permission Denied
- Verify security rules are deployed
- Check user role in Firestore

### Storage Upload Fails
- Verify storage rules are deployed
- Check file size limits (default: 5GB)

### Email Not Sending
- Verify Gmail credentials in Functions config
- Check Functions logs: `firebase functions:log`
- Ensure App Password is used (not regular password)

## Support

For issues or questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

