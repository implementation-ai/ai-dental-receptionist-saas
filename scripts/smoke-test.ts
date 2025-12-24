import assert from 'assert'

async function check(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return { status: res.status, contentType, body: await res.text() }
}

async function main() {
  try {
    console.log('Checking app prompt API...')
    const promptRes = await check('http://localhost:3000/api/prompts/demo-tenant/greeting')
    assert(promptRes.contentType.includes('application/json'), 'Prompts API did not return JSON')
    console.log('Prompts API OK')

    console.log('Checking voice service /health...')
    const voiceRes = await check('http://localhost:3003/health')
    assert(voiceRes.contentType.includes('application/json') || voiceRes.status === 200, 'Voice service health check failed')
    console.log('Voice service OK')

    console.log('All smoke checks passed ✅')
    process.exit(0)
  } catch (err) {
    console.error('Smoke test failed:', err)
    process.exit(1)
  }
}

main()
