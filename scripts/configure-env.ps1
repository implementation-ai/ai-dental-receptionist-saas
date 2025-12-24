# ServicAI Environment Configuration Script
# This script will update .env.production and backend.env.yaml with your credentials

Write-Host "🔧 ServicAI Environment Configuration" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Load Firebase Admin SDK JSON
$adminSdkPath = "c:\Users\HATIM\Downloads\ai-dental-receptionist-saas-firebase-adminsdk-fbsvc-aa0f8335b27.json"

if (-not (Test-Path $adminSdkPath)) {
    Write-Host "❌ Firebase Admin SDK file not found at: $adminSdkPath" -ForegroundColor Red
    Write-Host "Please ensure the file exists and update the path in this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "📄 Loading Firebase Admin SDK credentials..." -ForegroundColor Green
$adminSdk = Get-Content $adminSdkPath | ConvertFrom-Json

# Extract values
$projectId = $adminSdk.project_id
$clientEmail = $adminSdk.client_email
$privateKey = $adminSdk.private_key

Write-Host "✅ Loaded credentials for project: $projectId" -ForegroundColor Green
Write-Host ""

# Prompt for Gemini API Key
Write-Host "🤖 Please paste your Gemini API Key (from clipboard):" -ForegroundColor Yellow
$geminiKey = Read-Host "Gemini API Key"

if ([string]::IsNullOrWhiteSpace($geminiKey)) {
    Write-Host "❌ Gemini API Key is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Updating .env.production..." -ForegroundColor Green

# Create .env.production content
$envProduction = @"
# ============================================
# ServicAI Production Environment Variables
# ============================================
# Auto-generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# ============================================
# Firebase Configuration (Public - Client Side)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAeNmlLEJ7LZFIKuy991tuNl8-_3c7vWI0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-dental-receptionist-saas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-dental-receptionist-saas
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-dental-receptionist-saas.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=504425939294
NEXT_PUBLIC_FIREBASE_APP_ID=1:504425939294:web:345be17930beac65cacfcf
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-02JVQVLQD7

# ============================================
# API URLs (Public - Client Side)
# ============================================
NEXT_PUBLIC_API_URL=https://servicai.app
NEXT_PUBLIC_VOICE_API_URL=https://voice.servicai.app

# ============================================
# Firebase Admin SDK (Server Side Only)
# ============================================
FIREBASE_ADMIN_PROJECT_ID=$projectId
FIREBASE_ADMIN_CLIENT_EMAIL=$clientEmail
FIREBASE_ADMIN_PRIVATE_KEY="$privateKey"

# ============================================
# Gemini API (Server Side Only)
# ============================================
GEMINI_API_KEY=$geminiKey

# ============================================
# Application Settings
# ============================================
NODE_ENV=production
PORT=8080
"@

# Write .env.production
Set-Content -Path ".env.production" -Value $envProduction -Encoding UTF8
Write-Host "✅ Created .env.production" -ForegroundColor Green

Write-Host ""
Write-Host "📝 Updating backend.env.yaml..." -ForegroundColor Green

# Create backend.env.yaml content
# Note: YAML requires proper escaping of newlines in private key
$privateKeyYaml = $privateKey -replace '\\n', '\n'

$backendEnv = @"
# ============================================
# Backend Voice Service Environment Variables
# ============================================
# Auto-generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Twilio Configuration (TODO: Add your Twilio credentials)
TWILIO_ACCOUNT_SID: "YOUR_TWILIO_ACCOUNT_SID"
TWILIO_AUTH_TOKEN: "YOUR_TWILIO_AUTH_TOKEN"
TWILIO_PHONE_NUMBER: "+34XXXXXXXXX"

# Gemini API
GEMINI_API_KEY: "$geminiKey"

# Firebase Configuration
FIREBASE_PROJECT_ID: "$projectId"
FIREBASE_CLIENT_EMAIL: "$clientEmail"
FIREBASE_PRIVATE_KEY: "$privateKeyYaml"

# Application Settings
NODE_ENV: "production"
PORT: "8080"
HOST: "0.0.0.0"

# Logging
LOG_LEVEL: "info"
"@

# Write backend.env.yaml
Set-Content -Path "backend.env.yaml" -Value $backendEnv -Encoding UTF8
Write-Host "✅ Created backend.env.yaml" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  - .env.production: ✅ Configured" -ForegroundColor White
Write-Host "  - backend.env.yaml: ⚠️  Configured (Twilio credentials needed)" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Update Twilio credentials in backend.env.yaml" -ForegroundColor Yellow
Write-Host "   If you don't have Twilio yet, you can deploy without it." -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review the generated files" -ForegroundColor White
Write-Host "  2. Add Twilio credentials (optional)" -ForegroundColor White
Write-Host "  3. Run: npm run build" -ForegroundColor White
Write-Host "  4. Deploy with deployment scripts" -ForegroundColor White
Write-Host ""
