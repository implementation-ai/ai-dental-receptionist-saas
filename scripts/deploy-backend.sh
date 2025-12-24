#!/bin/bash
set -e

echo "🚀 Deploying ServicAI Voice Backend to Cloud Run"
echo "=================================================="

# Configuration
PROJECT_ID="ai-dental-receptionist-saas"
SERVICE_NAME="servicai-voice-backend"
REGION="europe-west1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

# 1. Build Docker image
echo ""
echo "🐳 Step 1/3: Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# 2. Push to Google Container Registry
echo ""
echo "📤 Step 2/3: Pushing to Google Container Registry..."
docker push $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed. Make sure you're authenticated:"
    echo "   gcloud auth configure-docker"
    exit 1
fi

# 3. Deploy to Cloud Run
echo ""
echo "☁️ Step 3/3: Deploying to Cloud Run..."

# Check if backend.env.yaml exists
if [ ! -f "backend.env.yaml" ]; then
    echo "⚠️  Warning: backend.env.yaml not found. Creating template..."
    cat > backend.env.yaml << 'EOF'
# Twilio Configuration
TWILIO_ACCOUNT_SID: "your_twilio_sid"
TWILIO_AUTH_TOKEN: "your_twilio_token"
TWILIO_PHONE_NUMBER: "+34XXXXXXXXX"

# Gemini API
GEMINI_API_KEY: "your_gemini_key"

# Firebase Configuration
FIREBASE_PROJECT_ID: "ai-dental-receptionist-saas"
FIREBASE_CLIENT_EMAIL: "firebase-adminsdk@ai-dental-receptionist-saas.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Environment
NODE_ENV: "production"
PORT: "8080"
EOF
    echo "❌ Please configure backend.env.yaml with your credentials and run again"
    exit 1
fi

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --env-vars-file backend.env.yaml \
  --min-instances 1 \
  --max-instances 20 \
  --memory 1Gi \
  --cpu 2 \
  --timeout 300s \
  --port 8080

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "=================================================="
echo "✅ Backend deployment complete!"
echo ""
echo "🌐 Voice API URL: $SERVICE_URL"
echo ""
echo "📊 Next steps:"
echo "   1. Test health endpoint: curl $SERVICE_URL/api/health"
echo "   2. Configure custom domain: voice.servicai.app"
echo "   3. Update Twilio webhook URL to: $SERVICE_URL/api/voice/webhook"
echo "   4. Monitor logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
echo "=================================================="
