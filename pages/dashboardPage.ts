import { Page, Locator } from '@playwright/test';

// Page Object Model for Dashboard page 
export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly addAccountBtn: Locator;
    readonly sentMoneyBtn: Locator;
    readonly transactionsListItems: Locator;
    readonly amountTransactionsListItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.addAccountBtn = page.getByTestId('tarjeta-agregar-cuenta');
        this.sentMoneyBtn = page.getByTestId('boton-enviar');
        this.transactionsListItems = page.getByTestId('descripcion-transaccion');
        this.amountTransactionsListItems = page.getByTestId('monto-transaccion');
    }

    async visitDashboardPage() {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }
    async visitLoginPage() {
        await this.page.goto('http://localhost:3000/login');
        await this.page.waitForLoadState('networkidle');
    }
}
