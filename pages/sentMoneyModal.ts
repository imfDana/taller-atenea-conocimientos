import { Page, Locator } from '@playwright/test';

// Page Object Model for Send Money modal
export class SentMoneyModal {
    readonly page: Page;
    readonly emailReceiverInput: Locator;
    readonly originAccountDropdown: Locator;
    readonly amountInput: Locator;
    readonly sendBtn: Locator;
    readonly cancelBtn: Locator;
    readonly originAccountOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailReceiverInput = page.getByRole('textbox', { name: 'Email del destinatario *' });
        this.originAccountDropdown = page.getByRole('combobox', { name: 'Cuenta origen *' });
        this.amountInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' });
        this.sendBtn = page.getByRole('button', { name: 'Enviar' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancelar' });
        this.originAccountOption = page.getByRole('option', { name: '••••' });
    };

    // Enter recipient's email address
    async fillEmailReceiverInput(email: string) {
        await this.emailReceiverInput.fill(email);
    };

    // Select origin account from dropdown
    async fillOriginAccountDropdown(account: string) {
        await this.originAccountDropdown.click();
        await this.page.getByRole('option', { name: account }).click();
    };

    // Enter amount to send
    async fillAmountInput(amount: string) {
        await this.amountInput.fill(amount);
    };

    // Click send button to submit transfer
    async clickSendBtn() {
        await this.sendBtn.click();
    };

    // Click cancel button to close modal
    async clickCancelBtn() {
        await this.cancelBtn.click();
    };

    // Complete entire send money process: fill all fields and submit
    async completeSendMoneyProcess(emailReceiverInput: string, amount: string) {
        await this.fillEmailReceiverInput(emailReceiverInput);
        await this.originAccountDropdown.click();
        await this.originAccountOption.click();
        await this.fillAmountInput(amount);
        await this.sendBtn.click();
    };

};
