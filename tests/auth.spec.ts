import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    const uniqueId = Date.now();
    const email = `testuser${uniqueId}@example.com`;
    const password = 'Password@123';
    const name = `Test User ${uniqueId}`;

    test('should register a new user', async ({ page }) => {
        await page.goto('/register');
        await page.fill('input[name="name"]', name);
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');

        // Should expect redirection to login or success message
        await expect(page).toHaveURL(/\/login/);
    });

    test('should login with created user', async ({ page }) => {
        // Create user first if not running sequentially, but here we assume state or flow
        // Ideally we should create a user via API or separate setup, but for simple E2E flow:

        // Re-register to ensure existence if running independently (skipped for flow simplicity, relying on sequence or unique run)
        // Actually, let's just use the flow. 
        // NOTE: Playwright tests run in parallel by default unless configured otherwise.
        // For simplicity in this demo, let's register in the login test or use a "beforeAll" approach if we had API access.
        // Since we don't have easy API access without auth, we'll stick to UI flows.

        // Let's make this test self-contained for robustness
        const testEmail = `login${Date.now()}@example.com`;

        await page.goto('/register');
        await page.fill('input[name="name"]', 'Login Tester');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/login/);

        await page.goto('/login');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/');
        await expect(page.getByText('PetManager')).toBeVisible();
    });
});
