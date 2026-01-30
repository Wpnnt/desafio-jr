import { test, expect } from '@playwright/test';

test.describe('Pet CRUD', () => {

    test('should create a new pet', async ({ page }) => {
        const uniqueId = Date.now();
        const email = `petuser${uniqueId}@example.com`;
        const password = 'Password@123';

        // Register
        await page.goto('/register');
        await page.fill('input[name="name"]', 'Pet Tester');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000); // Wait for potential async operations

        // Login
        await page.goto('/login');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/');

        await page.click('text=Novo Pet');

        const petName = `Buddy ${uniqueId}`;
        await page.fill('input[name="name"]', petName);
        await page.fill('input[name="age"]', '3');
        // Type is defaulted to DOG, let's keep it
        await page.fill('input[name="breed"]', 'Golden Retriever');
        await page.fill('input[name="ownerName"]', 'Pet Owner');
        await page.fill('input[name="ownerContact"]', '(11) 99999-9999');

        await page.click('button:has-text("Cadastrar")');

        // Wait for dialog to close (implies success)
        await expect(page.locator('div[role="dialog"]')).not.toBeVisible();

        // Wait for network idle or just a small buffer for server re-render
        await page.waitForTimeout(1000);
        await page.reload(); // Force reload to ensure data is fetched

        // Check if pet appears in list
        // Use specific matching to avoid strict mode violations (multiple "Buddy" elements)
        await expect(page.getByText(petName)).toBeVisible({ timeout: 10000 });

        // Scope the check to the specific element containing the unique name
        await expect(page.locator('div').filter({ hasText: petName }).filter({ hasText: 'Golden Retriever' }).first()).toBeVisible();
    });
});
