import { test, expect } from '@playwright/test'

const TENANT = 'demo-tenant'
const PROMPT_TYPE = 'greeting'

test('configuration panel loads, edits and saves prompt', async ({ page, request }) => {
  // Open debug page that mounts the ConfigurationPanel component
  await page.goto('/debug/configuration')

  // Ensure the label and textarea are present
  await expect(page.getByText('Prompts - Configuration (Demo)')).toBeVisible()
  const textarea = page.locator('textarea')
  await expect(textarea).toBeVisible()

  // Read original value
  const original = await textarea.inputValue()

  const newValue = `Playwright test ${Date.now()}`
  await textarea.fill(newValue)

  // Capture dialog (alert) from save
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('Saved')
    await dialog.dismiss()
  })

  // Click save
  await page.getByRole('button', { name: 'Save' }).click()

  // Verify backend now returns the updated prompt
  const res = await request.get(`/api/prompts/${TENANT}/${PROMPT_TYPE}`)
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json.template_content).toBe(newValue)

  // Cleanup: restore original value if it changed
  if (original !== newValue) {
    await request.post(`/api/prompts/${TENANT}/${PROMPT_TYPE}`, {
      data: { template_content: original }
    })
  }
})
