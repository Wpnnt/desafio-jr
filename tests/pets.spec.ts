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

        // Use the FAB or Desktop button - both trigger the dialog
        // Locate by aria-label or visible text. The FAB has a Plus icon.
        // Let's target the prominent "Cadastrar Pet" button on desktop or the Plus icon on mobile
        // For simplicity in this test environment (likely desktop viewport by default):
        await page.getByRole('button', { name: 'Cadastrar Pet' }).first().click();

        const petName = `Buddy ${uniqueId}`;
        await page.fill('input[name="name"]', petName);
        await page.fill('input[name="age"]', '3');
        // Type is defaulted to DOG, let's keep it
        await page.fill('input[name="breed"]', 'Golden Retriever');
        await page.fill('input[name="ownerName"]', 'Pet Owner');
        await page.fill('input[name="ownerContact"]', '(11) 99999-9999');

        // Target the button *inside* the dialog specifically to avoid clicking the open button or overlay
        await page.click('div[role="dialog"] button:has-text("Cadastrar Pet")');

        // Wait for dialog to close (implies success)
        await expect(page.locator('div[role="dialog"]')).not.toBeVisible();

        // Wait for network idle or just a small buffer for server re-render
        await page.waitForTimeout(1000);
        // Search for the pet to ensure it appears regardless of pagination
        await page.fill('input[placeholder*="Buscar"]', petName);
        await page.keyboard.press('Enter'); // Force submit just in case
        await page.waitForTimeout(2000); // Wait for debounce and network

        // Check if pet appears in list
        await expect(page.getByRole('heading', { name: petName })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Golden Retriever').first()).toBeVisible();
    });
});
