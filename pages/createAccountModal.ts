import { Page, Locator } from '@playwright/test';

// Page Object Model for Create Account modal
export class CreateAccountModal {
    readonly page: Page;
    readonly modalTitle: Locator;
    readonly accountType: Locator;
    readonly initialAmountInput: Locator;
    readonly createAccountBtn: Locator;
    readonly cancelBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalTitle = page.getByTestId('titulo-dashboard');
        this.accountType = page.getByRole('combobox', { name: 'Tipo de cuenta *' });
        this.initialAmountInput = page.getByRole('spinbutton', { name: 'Monto inicial *' })
        this.createAccountBtn = page.getByTestId('boton-crear-cuenta');
        this.cancelBtn = page.getByTestId('boton-cancelar-crear-cuenta');
    };

    // Select account type from dropdown (e.g., 'Débito', 'Crédito')
    async selectAccountType(accountType: string) {
        await this.accountType.click();
        await this.page.getByRole('option', { name: accountType }).click();
    };

    // Enter initial amount for the new account
    async completeAmountInput(amount: string) {
        await this.initialAmountInput.fill(amount);
        await this.page.waitForTimeout(1000);
    };
};
