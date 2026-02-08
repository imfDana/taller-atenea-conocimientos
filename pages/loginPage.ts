import { Page, Locator } from '@playwright/test';
import TestData from '../data/testData.json';

// Page Object Model for Login page
export class LoginPage {
    readonly page: Page;
    // Login form elements
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    //  readonly dashboardTitle: Locator;

    // Initialize page elements using locators
    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
        //  this.dashboardTitle = page.getByTestId('dashboard-title');
    }

    // Navigate to login page and wait for network to be idle
    async visitLoginPage() {
        await this.page.goto('http://localhost:3000/login');
        await this.page.waitForLoadState('networkidle');
    }

    // Fill login form with user credentials
    async fillLoginForm(user: { email: string, password: string }) {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
    }

    // Click the login button
    async makeClickOnLoginButton() {
        await this.loginButton.click();
    }

    // Complete login process: fill form and submit
    async completeLogin(user: { email: string, password: string }) {
        await this.fillLoginForm(user);
        await this.makeClickOnLoginButton();
    }
}
