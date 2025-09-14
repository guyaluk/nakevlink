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
2. **Build**: Install dependencies and run `npm run build:prod` (which has all Firebase config built-in)
3. **Deploy**: Deploy to Firebase Hosting at https://nakevlink.web.app

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