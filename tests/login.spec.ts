import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData  from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitLoginPage();
});

test('TC-07 Successful Login', async ({ page }) => {
    await loginPage.completeLogin(TestData.validUser);
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
});