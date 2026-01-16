import { test, expect } from '@playwright/test';

test('TC-01 Visiblidad de los campos iniciales', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByTestId('boton-registrarse')).toBeVisible();
    // await page.waitForTimeout(5000);
});

test('TC-02 Boton de Registrarse deshabilitado por defecto', async ({ page }) => {

    await page.goto('http://localhost:3000/');
    await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC- 03 Habilitacion del boton con el completado de los campos obligatorios', async ({ page }) => {

    await page.goto('http://localhost:3000');
    await page.locator('input[name="firstName"]').fill('Dana');
    await page.locator('input[name="lastName"]').fill('Imfeld');
    await page.locator('input[name="email"]').fill('pepe@email.com')
    await page.locator('input[name="password"]').fill('Curs0deTesting');
    await expect(page.getByTestId('boton-registrarse')).toBeEnabled();

});

test('TC-04 Redireccion al Login desde el header', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByTestId('boton-login-header-signup').click();
    await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-05 Registro exitoso de nuevo usuario', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[name="firstName"]').fill('Dana');
    await page.locator('input[name="lastName"]').fill('Imfeld');
    await page.locator('input[name="email"]').fill('pepeargento'+Date.now().toString()+'@email.com')
    await page.locator('input[name="password"]').fill('Curs0deTesting');
    await page.getByTestId('boton-registrarse').click();
    await expect(page.getByText('Registro exitoso')).toBeVisible();

});

test('TC-06 Mensaje de error por email duplicado', async ({ page }) => {
    const email = 'pepeargento'+ Date.now().toString() +'@email.com';
    await page.goto('http://localhost:3000');
    await page.locator('input[name="firstName"]').fill('Dana');
    await page.locator('input[name="lastName"]').fill('Imfeld');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('Curs0deTesting123');
    await page.getByTestId('boton-registrarse').click();
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    await page.goto('http://localhost:3000');
    await page.locator('input[name="firstName"]').fill('Dana');
    await page.locator('input[name="lastName"]').fill('Imfeld');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('Curs0deTesting123');
    await page.getByTestId('boton-registrarse').click()
    await expect(page.getByText('Email already in use')).toBeVisible();
    await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});