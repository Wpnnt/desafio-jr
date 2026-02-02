import { test, expect, request } from '@playwright/test';

test.describe('Security & Authorization', () => {

    // Helper to generate unique users
    const generateUser = () => {
        const id = Date.now() + Math.random().toString().slice(2, 6);
        return {
            name: `User ${id}`,
            email: `user${id}@security.test`,
            password: 'Password@123'
        };
    };

    test('User B should NOT be able to delete User A\'s pet via API', async ({ page }) => {
        test.setTimeout(60000); // Increase timeout for complex flow

        const userA = generateUser();
        const userB = generateUser();
        const uniqueId = Date.now();
        const petName = `Secured Pet ${uniqueId}`;
        let petId: string;

        // 1. Register User A
        await page.goto('/register');
        await page.fill('input[name="name"]', userA.name);
        await page.fill('input[name="email"]', userA.email);
        await page.fill('input[name="password"]', userA.password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/login/);

        // Wait for DB persistence before login attempt
        await page.waitForTimeout(3000);

        // 2. Login User A & Create Pet
        await page.goto('/login');
        await page.fill('input[name="email"]', userA.email);
        await page.fill('input[name="password"]', userA.password);
        await page.click('button[type="submit"]');

        // Use visual check instead of strict URL wait to avoid timeouts
        await expect(page.getByText('Sair')).toBeVisible({ timeout: 10000 });

        await page.getByRole('button', { name: 'Cadastrar Pet' }).first().click();
        await page.fill('input[name="name"]', petName);
        await page.fill('input[name="age"]', '2');
        await page.fill('input[name="breed"]', 'Security Breed');
        await page.fill('input[name="ownerName"]', 'Owner A');
        await page.fill('input[name="ownerContact"]', '123');
        // Target the button *inside* the dialog specifically to avoid clicking the open button or overlay
        await page.click('div[role="dialog"] button:has-text("Cadastrar Pet")');

        // Wait for dialog to close (implies success)
        await expect(page.locator('div[role="dialog"]')).not.toBeVisible();

        // Wait for pet to appear
        await expect(page.getByRole('heading', { name: petName })).toBeVisible();
        await page.click('text=Sair');
        // Wait for login page to be fully loaded and stable before navigating again
        await expect(page.getByRole('button', { name: 'Entrar' }).first()).toBeVisible();

        // 3. Register & Login User B
        await page.goto('/register');
        await page.fill('input[name="name"]', userB.name);
        await page.fill('input[name="email"]', userB.email);
        await page.fill('input[name="password"]', userB.password);
        await page.click('button[type="submit"]');

        await page.goto('/login');
        await page.fill('input[name="email"]', userB.email);
        await page.fill('input[name="password"]', userB.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/');

        // 4. Verify UI Security (Buttons hidden)
        await expect(page.getByRole('heading', { name: petName })).toBeVisible(); // User B sees the pet

        // The card for "Secured Pet" should NOT have visible/accessible edit/delete buttons
        // In our implementation, they are hidden by "isOwner" check
        // We can verify "Editar" text is NOT visible for this card
        const petCard = page.locator('div').filter({ hasText: petName }).filter({ hasText: 'Security Breed' }).first();
        await expect(petCard.getByText('Editar')).not.toBeVisible();

        // 5. Verify Backend Security (API Attack)
        // User B tries to DELETE the pet directly (Simulating an attack)

        // We need the Pet ID. Since we can't easily get it from UI, 
        // we'll fetch the list via API as User B to find it
        const context = await request.newContext();
        // Note: We need the session cookie for API access. 
        // Playwright's 'page' shares state, but 'request' context needs setup or we use page.request

        const petsResponse = await page.request.get('/api/pets');
        const pets = await petsResponse.json();
        const targetPet = pets.find((p: any) => p.name === petName);

        expect(targetPet).toBeDefined();
        petId = targetPet.id;

        // Perform DELETE attack
        const deleteResponse = await page.request.delete(`/api/pets/${petId}`);

        // Expect 403 Forbidden
        expect(deleteResponse.status()).toBe(403);
    });
});
