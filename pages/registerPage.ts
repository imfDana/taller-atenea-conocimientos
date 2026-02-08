import { Page, Locator } from '@playwright/test';
import TestData from '../data/testData.json';

// Page Object Model for Registration page
export class RegisterPage {
    readonly page: Page;
    // Registration form elements
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;
    readonly loginButton: Locator;

    // Initialize page elements using locators
    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerButton = page.getByTestId('boton-registrarse');
        this.loginButton = page.getByTestId('boton-login-header-signup');
    }

    // Navigate to registration page (home page)
    async visitRegisterPage() {
        await this.page.goto('http://localhost:3000/');
        await this.page.waitForLoadState('networkidle');
    }

    // Fill all registration form fields
    async fillRegistrationForm(user: { firstName: string, lastName: string, email: string, password: string }) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
    }

    // Click the register button
    async makeClickOnRegisterButton() {
        await this.registerButton.click();
    }

    // Complete registration process: fill form and submit
    async completeFormAndRegister(user: { firstName: string, lastName: string, email: string, password: string }) {
        await this.fillRegistrationForm(user);
        await this.makeClickOnRegisterButton();
    }
}
