import { test, expect } from '@playwright/test'
test('el inicio muestra el aviso de simulación', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('simulador de entretenimiento')).toBeVisible()
})
