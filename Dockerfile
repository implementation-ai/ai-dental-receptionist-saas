# Base de Node para build y runtime
FROM node:20-alpine AS base

# Builder: instalar dependencias (incluyendo dev) y compilar la aplicación
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
# Usamos `npm install` para evitar problemas cuando no existe package-lock.json
RUN npm install
COPY . .
# `next.config.ts` debe tener `output: "standalone"`
RUN npm run build

# Runner: imagen mínima para ejecutar la app en producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copiar únicamente los artefactos necesarios desde la etapa builder
COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next/static/ ./.next/static/
COPY --from=builder /app/public/ ./public/

USER nextjs
ENV PORT=8080 HOSTNAME=0.0.0.0
EXPOSE 8080

# server.js se encuentra en el bundle standalone
CMD ["node", "server.js"]
