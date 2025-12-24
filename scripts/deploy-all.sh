#!/bin/bash
set -e

echo "🚀 Full ServicAI Deployment"
echo "=================================================="
echo ""

# Deploy backend first (voice service)
echo "Step 1/2: Deploying Backend Voice Service..."
./scripts/deploy-backend.sh

echo ""
echo "=================================================="
echo ""

# Then deploy frontend
echo "Step 2/2: Deploying Frontend Application..."
./scripts/deploy-frontend.sh

echo ""
echo "=================================================="
echo "✅ Full deployment complete!"
echo ""
echo "🎉 ServicAI is now live:"
echo "   - Main App: https://servicai.app"
echo "   - Voice API: https://voice.servicai.app (configure custom domain)"
echo ""
echo "📋 Post-deployment checklist:"
echo "   [ ] Configure custom domains in Firebase Console and Cloud Run"
echo "   [ ] Update DNS records in IONOS"
echo "   [ ] Test all routes and API endpoints"
echo "   [ ] Configure Twilio webhook URLs"
echo "   [ ] Set up monitoring and alerts"
echo "   [ ] Deploy Firestore rules: firebase deploy --only firestore:rules"
echo "   [ ] Deploy Firestore indexes: firebase deploy --only firestore:indexes"
echo "=================================================="
