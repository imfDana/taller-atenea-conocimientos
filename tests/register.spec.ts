import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import TestData  from '../data/testData.json';

let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.visitRegisterPage();
});

test('TC-01 Visibility of initial fields', async ({ page }) => {
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
    
});

test('TC-02 Sign Up button disabled by default', async ({ page }) => {
    await expect(registerPage.registerButton).toBeDisabled();
});

test('TC- 03 Enable button when mandatory fields are completed', async ({ page }) => {
    await registerPage.fillRegistrationForm(TestData.validUser);
    await expect(registerPage.registerButton).toBeEnabled();

});

test('TC-04 Redirect to Login from header', async ({ page }) => {
    await registerPage.loginButton.click();
    await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-05 Successful registration of new user', async ({ page }) => {
    const email = (TestData.validUser.email.split('@')[0] + 'pepeargento' + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
    TestData.validUser.email = email;
    await registerPage.completeFormAndRegister(TestData.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-06 Error message for duplicate email', async ({ page }) => {
    const email = (TestData.validUser.email.split('@')[0] + 'pepeargento' + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
    TestData.validUser.email = email;
    await registerPage.completeFormAndRegister(TestData.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    await registerPage.visitRegisterPage();
    await registerPage.completeFormAndRegister(TestData.validUser);
    await expect(page.getByText('Email already in use')).toBeVisible();
    await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});