import { test as setup, expect } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import { LoginPage } from '../pages/loginPage';
import TestData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';
import { CreateAccountModal } from '../pages/createAccountModal';
import fs from 'fs/promises';
import path from 'path';

// Page object instances
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let createAccountModal: CreateAccountModal;

// Authentication state file paths
const senderAuthFile = 'playwright/.auth/sender.json';
const receiverAuthFile = 'playwright/.auth/receiver.json';
const senderDataFile = 'playwright/.auth/sender.data.json';

// Setup before each test: initialize page objects and navigate to login
setup.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createAccountModal = new CreateAccountModal(page);
    await loginPage.visitLoginPage();
});

setup('TC-03 Create sender user with account', async ({ page, request }) => {
    const newUser = await BackendUtils.createUserByAPI(request, TestData.validUser);
    await fs.writeFile(path.resolve(__dirname, '..', senderDataFile), JSON.stringify(newUser, null, 2));
    await loginPage.completeLogin(newUser);
    await dashboardPage.addAccountBtn.click();
    await createAccountModal.selectAccountType('Débito');
    await createAccountModal.completeAmountInput('1000');
    await createAccountModal.createAccountBtn.click();
    await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();
    // Save authentication state for sender user
    await page.context().storageState({ path: senderAuthFile });

});

setup('TC-04 Create and login with the receiver user', async ({ page, request }) => {
    const newUser = await BackendUtils.createUserByAPI(request, TestData.validUser, false);
    await loginPage.completeLogin(newUser);
    await dashboardPage.addAccountBtn.click();
    await createAccountModal.selectAccountType('Débito');
    await createAccountModal.completeAmountInput('1000');
    await createAccountModal.createAccountBtn.click();
    await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    // Save authentication state for receiver user
    await page.context().storageState({ path: receiverAuthFile });
});
