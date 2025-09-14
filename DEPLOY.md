# GitHub Actions Deployment Setup

This guide explains how to set up automated deployment to Firebase when pushing to GitHub.

## GitHub Secrets Setup

You only need to add ONE secret to your GitHub repository:

### Firebase Service Account Key

You need to generate a Firebase service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/project/nakevlink/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire JSON content
5. Add it as a secret named `FIREBASE_SERVICE_ACCOUNT` in GitHub

## Alternative: Use Firebase CLI

You can also set up the service account using Firebase CLI:

```bash
# Generate service account key
firebase init hosting:github

# Follow the prompts to:
# - Connect to your GitHub repository (guyaluk/nakevlink)
# - Set up GitHub Actions workflow
# - Configure secrets automatically
```

## Why Only One Secret?

The Firebase configuration (API keys, project ID, etc.) is already included in the `build:prod` script in `package.json`, so we don't need to add them as separate GitHub secrets.

## Workflow Details

The GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`) will:

1. **Trigger**: On push to `master` branch
2. **Setup**: Node.js 20 (required for Firebase CLI 14+)
3. **Build**:
   - Install web app and functions dependencies
   - Build production web app with `npm run build:prod` (includes Firebase config)
   - Build functions with TypeScript compilation
4. **Deploy**: Deploy hosting, functions, and Firestore to Firebase
   - Web app at https://nakevlink.web.app
   - All 6 Firebase Functions for authentication and punch cards
   - Firestore database with security rules for data storage

## Recent Updates

- **Node.js 20**: Updated from Node.js 18 to support Firebase CLI 14+
- **Functions Deployment**: Now deploys hosting, functions, AND Firestore automatically
- **Firestore Database**: Created and configured with security rules
- **Firebase CLI**: Pinned to v13.20.2 for stability

## Manual Deployment

If you need to deploy manually:

```bash
cd web-app
npm run build:prod
cd ..
firebase deploy --only hosting
```

## Verification

After setting up the secrets and pushing to master:

1. Check GitHub Actions tab in your repository
2. Verify deployment at https://nakevlink.web.app
3. Monitor Firebase Console for deployment status