import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';
import { BackendUtils } from '../utils/backendUtils';

// Page object instances
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
// Setup before each test: navigate to login page
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitLoginPage();
});

test('TC-01 Successful Login with valid credentials', async ({ page }) => {
    await loginPage.completeLogin(TestData.validUser);
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test('TC-02 New user created via API', async ({ page, request }) => {

    const newUser = await BackendUtils.createUserByAPI(request, TestData.validUser);
    const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
    await loginPage.completeLogin(newUser);

    const responseLogin = await responsePromiseLogin;
    const responseBodyLoginJson = await responseLogin.json();

    expect(responseLogin.status()).toBe(200);
    expect(responseBodyLoginJson).toHaveProperty('token');
    expect(responseBodyLoginJson.token).toEqual(expect.any(String));
    expect(responseBodyLoginJson).toHaveProperty('user');
    expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.validUser.firstName,
        lastName: TestData.validUser.lastName,
        email: newUser.email
    }));

    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();

});


