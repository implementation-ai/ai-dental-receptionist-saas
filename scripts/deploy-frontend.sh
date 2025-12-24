#!/bin/bash
set -e

echo "🚀 Deploying ServicAI Frontend to Firebase + Cloud Run"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# 1. Build Next.js app
echo ""
echo "📦 Step 1/4: Building Next.js application..."
npm run build

if [ ! -d ".next/standalone" ]; then
    echo "❌ Build failed: .next/standalone directory not found"
    exit 1
fi

# 2. Deploy to Cloud Run (for SSR routes and API)
echo ""
echo "☁️ Step 2/4: Deploying to Cloud Run..."
gcloud run deploy servicai-frontend \
  --source .next/standalone \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --port 8080

# Get Cloud Run URL
CLOUD_RUN_URL=$(gcloud run services describe servicai-frontend --region europe-west1 --format 'value(status.url)')
echo "✅ Cloud Run deployed at: $CLOUD_RUN_URL"

# 3. Export static pages for Firebase Hosting
echo ""
echo "📄 Step 3/4: Exporting static pages..."
# Create out directory if it doesn't exist
mkdir -p out

# Copy static files from .next/standalone
if [ -d ".next/standalone/public" ]; then
    cp -r .next/standalone/public/* out/ 2>/dev/null || true
fi

# Copy Next.js static files
if [ -d ".next/static" ]; then
    mkdir -p out/_next
    cp -r .next/static out/_next/ 2>/dev/null || true
fi

# Create a simple index.html for the root if it doesn't exist
if [ ! -f "out/index.html" ]; then
    cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=/landing">
    <title>ServicAI - Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="/landing">landing page</a>...</p>
</body>
</html>
EOF
fi

# 4. Deploy to Firebase Hosting
echo ""
echo "🔥 Step 4/4: Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "=================================================="
echo "✅ Frontend deployment complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   - Firebase Hosting: https://servicai.app"
echo "   - Cloud Run: $CLOUD_RUN_URL"
echo ""
echo "📊 Next steps:"
echo "   1. Configure custom domain in Firebase Console"
echo "   2. Test all routes (landing, dashboard, API)"
echo "   3. Monitor Cloud Run logs: gcloud run services logs read servicai-frontend --region europe-west1"
echo "=================================================="
