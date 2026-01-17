import { Page, Locator } from '@playwright/test';
import TestData  from '../data/testData.json';

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerButton = page.getByTestId('boton-registrarse');
        this.loginButton = page.getByTestId('boton-login-header-signup');
    }

    async visitRegisterPage() {
        await this.page.goto('http://localhost:3000/');
        await this.page.waitForLoadState('networkidle');
    }

    async fillRegistrationForm( user: {firstName: string, lastName: string, email: string, password: string}) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
    }

    async makeClickOnRegisterButton() {
        await this.registerButton.click();
    }

    async completeFormAndRegister(user: {firstName: string, lastName: string, email: string, password: string}) {
        await this.fillRegistrationForm(user);
        await this.makeClickOnRegisterButton();
    }
}
