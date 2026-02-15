import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { SentMoneyModal } from '../pages/sentMoneyModal';
import TestData from '../data/testData.json';
import fs from 'fs/promises';

// Page object instances
let dashboardPage: DashboardPage;
let sentMoneyModal: SentMoneyModal;

// Test context with sender user authentication
const senderTest = test.extend({
    storageState: require.resolve('../playwright/.auth/sender.json')
});

// Test context with receiver user authentication
const receiverTest = test.extend({
    storageState: require.resolve('../playwright/.auth/receiver.json')
});

// Setup before each test: navigate to dashboard and initialize page objects
test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.visitDashboardPage();
    sentMoneyModal = new SentMoneyModal(page);
});

senderTest('TC-14 Sending money via UI as a sender user', async ({ page }) => {

    senderTest.info().annotations.push({
        type: 'Receiver user information',
        description: TestData.validUser.email
    })
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.sentMoneyBtn.click();
    await sentMoneyModal.completeSendMoneyProcess(TestData.validUser.email, '100');
    await expect(page.getByText('Transferencia enviada a ' + TestData.validUser.email)).toBeVisible();
});

receiverTest('TC-15 Receiver sees the incoming transaction in the UI', async ({ page }) => {
    // Load sender user data from file
    const senderData = require.resolve('../playwright/.auth/sender.data.json');
    const senderDataContent = await fs.readFile(senderData, 'utf-8');
    const dataSenderUser = JSON.parse(senderDataContent);
    const senderEmail = dataSenderUser.email;

    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByText('Transferencia de ' + senderEmail).first()).toBeVisible();
});


receiverTest('TC-16 Receiver sends money via API', async ({ page, request }) => {
    // Step 1: Read sender data and authentication token
    // Load sender user data from file
    const senderData = require.resolve('../playwright/.auth/sender.data.json');
    const senderDataContent = await fs.readFile(senderData, 'utf-8');
    const dataSenderUser = JSON.parse(senderDataContent);
    const senderEmail = dataSenderUser.email;
    expect(senderEmail, "El email del usuario no se leyo correctamente").toBeDefined()

    // Load sender authentication file
    const senderAuthFile = require.resolve('../playwright/.auth/sender.json');
    const senderAuthFileContent = await fs.readFile(senderAuthFile, 'utf-8');
    const dataSenderAuthFile = JSON.parse(senderAuthFileContent);

    // Extract JWT token from localStorage
    const senderJWT = dataSenderAuthFile.origins[0]?.localStorage.find((item: any) => item.name === 'jwt');
    expect(senderJWT, "El JWT del usuario no se leyo correctamente desde el archivo").toBeDefined()
    const jwt = senderJWT.value;

    // Step 2: Get sender account via API
    // Fetch sender's accounts to get account ID

    const accountResponse = await request.get('http://localhost:6007/api/accounts', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    // Verify API response is successful
    expect(accountResponse.ok(), `La API para obtener cuentas falló: ${accountResponse.status()}`).toBeTruthy();
    const accounts = await accountResponse.json();
    expect(accounts.length, 'No se encontraron cuentas para el usuario').toBeGreaterThan(0);
    const senderAccountId = accounts[0]._id; // Use first account as source

    // Generate random amount between 1 and 100
    const aleatoryAmount = Math.floor(Math.random() * 100) + 1;
    console.log(`Enviando transferencia de $${aleatoryAmount} a ${senderAccountId} a ${TestData.validUser.email}`)

    // Step 3: Send transfer via API
    const TransferResponse = await request.post('http://localhost:6007/api/transactions/transfer', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        data: {
            fromAccountId: senderAccountId,
            toEmail: TestData.validUser.email, // Fixed receiver email
            amount: aleatoryAmount
        }
    })

    // Verify transfer was successful
    expect(TransferResponse.ok(), `La API para enviar transferencias falló: ${TransferResponse.status()}`).toBeTruthy();

    // Step 4: Verify transaction appears in receiver's UI

    // Reload page to get latest transactions
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(dashboardPage.dashboardTitle).toBeVisible();

    // Verify sender email appears in transaction
    // await expect(dashboardPage.transactionsListItems.first()).toContainText(senderEmail);

    // Verify correct amount is displayed
    const regexAmount = new RegExp(String(aleatoryAmount.toFixed(2)));
    await expect(dashboardPage.amountTransactionsListItems.first()).toContainText(regexAmount);

});
