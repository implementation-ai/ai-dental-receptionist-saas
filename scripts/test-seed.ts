import { db } from '../src/lib/db'

async function testSeed() {
  console.log('🔎 Verifying demo seed data...')

  const tenant = await db.tenant.findFirst({ where: { slug: 'demo-tenant' } })
  if (!tenant) {
    console.error('❌ Demo tenant not found (slug: demo-tenant)')
    process.exit(1)
  }

  const prompts = await db.aiPrompt.findMany({ where: { tenantId: tenant.id } })
  if (!prompts || prompts.length === 0) {
    console.error('❌ No prompts found for demo tenant')
    process.exit(1)
  }

  console.log(`✅ Demo tenant found: ${tenant.id} (${tenant.name})`)
  console.log(`✅ ${prompts.length} prompts found. Types: ${prompts.map(p => p.promptType).join(', ')}`)

  await db.$disconnect()
  process.exit(0)
}

testSeed().catch((e) => {
  console.error('❌ Error verifying seed:', e)
  process.exit(1)
})
