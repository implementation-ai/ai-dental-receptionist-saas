# AI Dental Receptionist - SaaS Multi-tenant

🤖 **Sistema de Captación Automática 24/7 + Booking Inteligente para Clínicas Dentales**

## 🎯 Propuesta de Valor

- **100% captura de llamadas** (vs 20-30% actual con voicemail)
- **85-95% automatización** de primeros contactos
- **ROI garantizado**: 300-500% en 12 meses, payback en 3 meses
- **Implementación simple**: No requiere integración compleja

## 💰 Modelo de Negocio

- **Setup**: €2,000 (configuración inicial)
- **Mensual**: €600/retainer
- **ROI**: Recuperación de inversión en 3-4 días con solo 2-3 pacientes nuevos

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 15** con App Router
- **TypeScript** para tipado robusto
- **Tailwind CSS + shadcn/ui** para UI consistente
- **Responsive design** mobile-first

### Backend
- **Next.js API Routes** (serverless functions)
- **Prisma ORM** con SQLite para desarrollo
- **PostgreSQL** para producción (Supabase)
- **NextAuth.js** para autenticación multi-tenant

### AI Voice Service
- **Node.js + Express** (mini-servicio independiente)
- **Socket.io** para comunicación real-time
- **z-ai-web-dev-sdk** para LLM
- **Twilio/Retell AI** para telefonía

### Base de Datos
- **Multi-tenant** con Row-Level Security (RLS)
- **Escalable** con read replicas
- **Segura** con encriptación AES-256

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── calls/        # Webhook llamadas
│   │   │   ├── appointments/ # Gestión citas
│   │   │   └── dashboard/   # Métricas
│   │   └── page.tsx         # Dashboard principal
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   └── dashboard/        # Dashboard components
│   └── lib/
│       └── db.ts             # Prisma client
├── mini-services/
│   └── voice-service/        # AI Voice Service
├── prisma/
│   └── schema.prisma         # Database schema
└── README.md
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd ai-dental-receptionist

# Instalar dependencias principales
npm install

# Instalar dependencias del voice service
cd mini-services/voice-service
npm install
cd ../..
```

### Configuración
```bash
# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# - For local dev using SQLite, set: DATABASE_URL="file:./dev.db"
# - Keep secrets out of source control!
nano .env
```

### Local development with SQLite (recommended)
1. Copy `.env.example` to `.env` and ensure `DATABASE_URL="file:./dev.db"`.
2. Generate Prisma client and push schema to the SQLite DB:
```bash
npx prisma generate
npm run db:push
```
3. (Optional) Reset DB if you need a fresh schema:
```bash
npm run db:reset
```
4. (Optional) Seed demo data for local development:
```bash
npm run db:seed
```

5. Verify the seed and inspect demo data:
```bash
npm run test:seed   # simple check that demo tenant & prompts exist
npm run print-demo  # prints tenant id and prompts for quick inspection
```

6. Start the application and the voice service in separate terminals:
```bash
# Terminal 1: App (http://localhost:3000)
npm run dev

# Terminal 2: Voice Service (http://localhost:3003)
cd mini-services/voice-service
npm run dev
```

### Iniciar Base de Datos (CI / Manual)
```bash
# Inicializar Prisma (client + schema push)
npx prisma generate
npm run db:push
```

La aplicación estará disponible en:
- **Dashboard**: http://localhost:3000
- **AI Voice Service**: http://localhost:3003

## 📊 Funcionalidades Principales

### Dashboard
- **ROI Widget**: Costo de inacción vs ahorro generado
- **Métricas en tiempo real**: Llamadas, citas, pacientes nuevos
- **Actividad reciente**: Historial de llamadas y transcripciones
- **Gestión de citas**: Vista diaria con estados y urgencias

### Configuración
- **Datos de clínica**: Nombre, contacto, horarios
- **Servicios**: Tipos de tratamiento, duración, precios
- **Prompts IA**: Personalización del lenguaje y tono
- **Integraciones**: Google Calendar, Twilio, SMS/Email

### AI Voice Service
- **Flujo completo**: Saludo → Cualificación → Agendado → Confirmación
- **Streaming real-time**: STT → LLM → TTS
- **Multi-tenant**: Prompts personalizados por clínica
- **Integración calendar**: Consulta disponibilidad y crea citas

## 🔒 Seguridad y Cumplimiento

- **GDPR/LOPD**: Registro de actividades, consentimientos, DSAR
- **Encriptación**: AES-256 en reposo y tránsito
- **Multi-tenant**: Aislamiento de datos por tenant
- **Audit logs**: Registro completo de accesos y acciones

## 📈 Métricas y ROI

### KPIs Principales
- **Tasa de respuesta**: % llamadas atendidas vs totales
- **Tasa de conversión**: % citas agendadas vs llamadas
- **Pacientes nuevos**: Captación mensual
- **Costo de inacción**: Ingresos perdidos por no implementar

### Cálculo ROI
```
Costo de Inacción Mensual: €2,487
Ahorro Generado: €2,288
ROI: 1,150%
Payback: 2.4 días
```

## 🚀 Despliegue

### Producción
- **Frontend**: Vercel (serverless functions)
- **Base de datos**: Supabase (PostgreSQL + RLS)
- **Voice Service**: Railway (Node.js)
- **Monitoring**: Vercel Analytics + custom dashboard

### Variables de Entorno Producción
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=production_secret
GOOGLE_CLIENT_ID=production_client_id
ZAI_API_KEY=production_api_key
```

## Despliegue en Google Cloud Run

### Prerrequisitos

- Google Cloud CLI instalado y autenticado:
  - `gcloud auth login`
  - `gcloud config set project ai-dental-receptionist-saas`
- APIs habilitadas (una sola vez por proyecto):
  - `gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com`

### Build de la app (local / CI)

```bash
npm install
npm run build
```

La build genera la salida en modo `output: "standalone"` dentro de `.next/standalone`.

### Pipeline de CI (Cloud Build) con verificación post-despliegue

Se añade un archivo de configuración `cloudbuild.yaml` que realiza:
- Build de la imagen Docker y push a Artifact Registry
- Deploy a Cloud Run
- Healthcheck: intenta `curl` la URL pública hasta 3 minutos y falla el build si la URL no responde

Ejecutar localmente (usa los valores por defecto definidos en `cloudbuild.yaml`):
```bash
gcloud builds submit --config=cloudbuild.yaml .
```
Si quieres sustituir valores por defecto:
```bash
gcloud builds submit --config=cloudbuild.yaml --substitutions=_IMAGE=us-central1-docker.pkg.dev/ai-dental-receptionist-saas/nextjs/ai-dental-receptionist-saas,_SERVICE=ai-dental-receptionist-saas,_REGION=us-central1,_URL=https://ai-dental-receptionist-saas-504425939294.us-central1.run.app .
```

### Build de imagen y push a Artifact Registry

```bash
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/ai-dental-receptionist-saas/nextjs/ai-dental-receptionist-saas .
```

### Deploy a Cloud Run

```bash
gcloud run deploy ai-dental-receptionist-saas \
  --image us-central1-docker.pkg.dev/ai-dental-receptionist-saas/nextjs/ai-dental-receptionist-saas \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

Al finalizar, Cloud Run muestra una URL pública donde se sirve la app.

## 🧪 Testing

### Pruebas Unitarias
```bash
npm run test
```

### Pruebas E2E
```bash
npm run test:e2e
```

### Pruebas de Carga
```bash
npm run test:load
```

## 📝 API Documentation

### Endpoints Principales

#### Dashboard Metrics
```
GET /api/dashboard/metrics
POST /api/dashboard/metrics
```

#### Calls Management
```
GET /api/calls
POST /api/calls (webhook)
```

#### Appointments
```
GET /api/appointments
POST /api/appointments
```

### Voice Service API

#### Incoming Call Webhook
```
POST /calls/incoming
Body: { CallSid, From, To, CallStatus }
```

#### Speech Processing
```bash
#### Transcript Endpoint
```
POST /calls/transcript
Body: { CallSid, transcript }
```

#### Call Status
```
GET /calls/status/:callSid
```

### CI Smoke Check

Add `scripts/smoke-test.ts` to verify both services are running and the prompts API responds:

```bash
npm run smoke-test
```

This runs a quick health check:
- Confirms main app is up on `http://localhost:3000`
- Confirms voice service is up on `http://localhost:3003`
- Verifies `/api/prompts/:tenantId/:promptType` returns 200 with valid JSON

### Browser E2E Test (Playwright)

Add `e2e/configuration-panel.spec.ts` to test the dashboard configuration flow:

```bash
npm run test:e2e
```

This test verifies:
- Configuration panel loads
- Fetches prompts via API
- User can edit and save prompt changes
- API returns updated prompt with correct version

### GitHub Actions Workflow

Add `.github/workflows/smoke-test.yml` to run on every push:

```yaml
name: Smoke Tests
on: [push, pull_request]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run db:push
      - run: npm run db:seed
      - run: npm run dev &
      - run: cd mini-services/voice-service && npm install && npm run dev &
      - run: sleep 5 && npm run smoke-test
```
WebSocket: /?XTransformPort=3003
Events: speech-input, ai-response
```

## 🤝 Contribución

1. Fork del repositorio
2. Feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Email**: support@aidentalreceptionist.com
- **Documentation**: https://docs.aidentalreceptionist.com
- **Status**: https://status.aidentalreceptionist.com

---

**🎯 Empieza a capturar el 100% de tus llamadas hoy mismo!**
