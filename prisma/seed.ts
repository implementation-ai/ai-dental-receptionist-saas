import { db } from '../src/lib/db'
import { PromptType } from '@prisma/client'

async function seed() {
  console.log('🔧 Seeding demo tenant and sample data...')

  const tenantSlug = 'demo-tenant'

  const tenant = await db.tenant.upsert({
    where: { slug: tenantSlug },
    update: {
      name: 'Clínica Demo',
      city: 'Madrid',
      phone: '+34900123456'
    },
    create: {
      name: 'Clínica Demo',
      slug: tenantSlug,
      city: 'Madrid',
      phone: '+34900123456'
    }
  })

  console.log('✅ Tenant:', tenant.id)

  // Clinic configuration
  await db.clinicConfiguration.upsert({
    where: { tenantId: tenant.id },
    update: {
      workingHours: JSON.stringify({ monday: { open: '09:00', close: '18:00' } }),
      services: JSON.stringify([{ name: 'Limpieza Dental', duration: 30 }, { name: 'Revisión General', duration: 45 }])
    },
    create: {
      tenantId: tenant.id,
      workingHours: JSON.stringify({ monday: { open: '09:00', close: '18:00' } }),
      services: JSON.stringify([{ name: 'Limpieza Dental', duration: 30 }, { name: 'Revisión General', duration: 45 }])
    }
  })

  // Sample prompts (versioned)
  const prompts = [
    {
      promptType: PromptType.GREETING,
      templateContent: 'Hola, has llamado a [[CLINICA_NOMBRE]] en [[CIUDAD]]. Soy la recepcionista virtual. ¿En qué puedo ayudarte?',
      variables: null
    },
    {
      promptType: PromptType.QUALIFICATION,
      templateContent:
        'Para ayudarte mejor: ¿Eres paciente nuevo o ya nos has visitado antes? ¿Cuál es el motivo de la consulta? ¿Es urgente?',
      variables: null
    },
    {
      promptType: PromptType.FAREWELL,
      templateContent:
        'Gracias por llamar a [[CLINICA_NOMBRE]]. Tu cita está confirmada. Si necesitas cambiar o cancelar tu cita, por favor contáctanos. ¡Que tengas un buen día!',
      variables: null
    }
  ]

  for (const p of prompts) {
    await db.aiPrompt.create({
      data: {
        tenantId: tenant.id,
        promptType: p.promptType,
        templateContent: p.templateContent,
        variables: p.variables ? JSON.stringify(p.variables) : null,
        isActive: true
      }
    })
  }

  console.log('✅ Sample prompts created')

  // Sample patient
  const patient = await db.patient.upsert({
    where: { tenantId_phone: { tenantId: tenant.id, phone: '+34 600 123 456' } },
    update: { name: 'María García', email: 'maria@example.com' },
    create: { tenantId: tenant.id, name: 'María García', phone: '+34 600 123 456', email: 'maria@example.com', isNewPatient: true }
  })

  // Sample appointment
  const start = new Date()
  start.setDate(start.getDate() + 1)
  start.setHours(10, 30, 0, 0)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + 30)

  await db.appointment.upsert({
    where: { id: 'demo-apt-1' },
    update: {},
    create: {
      id: 'demo-apt-1',
      tenantId: tenant.id,
      patientId: patient.id,
      title: `Limpieza Dental - ${patient.name}`,
      startTime: start,
      endTime: end,
      serviceType: 'Limpieza Dental',
      urgencyLevel: 'LOW',
      status: 'SCHEDULED'
    }
  })

  console.log('✅ Demo appointment created')

  // Optional: create a demo call and transcript
  const call = await db.call.create({
    data: {
      tenantId: tenant.id,
      callSid: `demo_${Date.now()}`,
      phoneFrom: patient.phone,
      phoneTo: tenant.phone,
      status: 'COMPLETED',
      durationSeconds: 180,
      startedAt: new Date(),
      endedAt: new Date()
    }
  })

  await db.callLog.create({
    data: {
      callId: call.id,
      eventType: 'TRANSCRIPTION',
      content: 'Paciente nueva solicita limpieza dental para mañana por la mañana. Prefiere mañana por la mañana.',
      timestamp: new Date()
    }
  })

  console.log('✅ Demo call and transcript created')

  console.log('🎉 Seeding finished!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
