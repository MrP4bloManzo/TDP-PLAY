import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => { await page.goto('/'); await expect(page.getByText('TDP PLAY')).toBeVisible(); await expect(page.getByText('Vive el fútbol de una nueva forma.')).toBeVisible(); });

test('demo login works', async ({ page }) => { await page.goto('/login'); await page.getByRole('button', { name:'Entrar' }).click(); await expect(page).toHaveURL(/dashboard|admin/); });
