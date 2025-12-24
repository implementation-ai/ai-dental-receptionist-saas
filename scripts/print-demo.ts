import { db } from '../src/lib/db'

async function printDemo() {
  const tenant = await db.tenant.findFirst({ where: { slug: 'demo-tenant' } })
  if (!tenant) {
    console.log('No demo tenant found')
    process.exit(1)
  }

  console.log('Tenant:')
  console.log({ id: tenant.id, name: tenant.name, slug: tenant.slug, phone: tenant.phone })

  const prompts = await db.aiPrompt.findMany({ where: { tenantId: tenant.id }, orderBy: { version: 'desc' } })
  console.log('Prompts:')
  prompts.forEach(p => console.log({ id: p.id, type: p.promptType, version: p.version, active: p.isActive }))

  await db.$disconnect()
}

printDemo().catch((e) => {
  console.error('Error printing demo data', e)
  process.exit(1)
})
