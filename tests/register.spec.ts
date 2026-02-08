// Import Playwright test framework and page objects
import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import TestData from '../data/testData.json';

// Page object instance
let registerPage: RegisterPage;

// Setup before each test: navigate to registration page
test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.visitRegisterPage();
});

// TC-05: Verify all registration form fields are visible
test('TC-05 Visibility of initial fields', async ({ page }) => {
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();

});

// TC-06: Verify register button is disabled when form is empty
test('TC-06 Sign Up button disabled by default', async ({ page }) => {
    await expect(registerPage.registerButton).toBeDisabled();
});

// TC-07: Verify register button is enabled when all fields are filled
test('TC-07 Enable button when mandatory fields are completed', async ({ page }) => {
    await registerPage.fillRegistrationForm(TestData.validUser);
    await expect(registerPage.registerButton).toBeEnabled();

});

// TC-08: Verify navigation to login page from header link
test('TC-08 Redirect to Login from header', async ({ page }) => {
    await registerPage.loginButton.click();
    await expect(page).toHaveURL('http://localhost:3000/login');
});

// TC-09: Test successful user registration with unique email
test('TC-09 Successful registration of new user', async ({ page }) => {
    // Generate unique email using timestamp
    const email = (TestData.validUser.email.split('@')[0] + 'pepeargento' + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
    TestData.validUser.email = email;
    await registerPage.completeFormAndRegister(TestData.validUser);
    // Verify success message
    await expect(page.getByText('Registro exitoso')).toBeVisible();
});

// TC-10: Test error message when registering with duplicate email
test('TC-10 Error message for duplicate email', async ({ page }) => {
    // Generate unique email
    const email = (TestData.validUser.email.split('@')[0] + 'pepeargento' + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
    TestData.validUser.email = email;
    // First registration - should succeed
    await registerPage.completeFormAndRegister(TestData.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    // Second registration with same email - should fail
    await registerPage.visitRegisterPage();
    await registerPage.completeFormAndRegister(TestData.validUser);
    await expect(page.getByText('Email already in use')).toBeVisible();
    await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});

// TC-11: Test registration API response structure and token validation
test('TC-11 Successful login: verify API response structure and token', async ({ page }) => {

    // Step 1: Fill registration form with unique email
    await test.step('complete the register form with valid data', async () => {
        const email = (TestData.validUser.email.split('@')[0] + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
        TestData.validUser.email = email;
        await registerPage.fillRegistrationForm(TestData.validUser);
    });

    // Set up listener for the API response
    const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/signup');
    // Trigger the signup request
    await registerPage.makeClickOnRegisterButton();
    // Wait for and capture the response
    const response = await responsePromise;
    const responseBody = await response.json();

    // Verify HTTP status
    expect(response.status()).toBe(201);

    // Verify response has required top-level properties
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.validUser.firstName,
        lastName: TestData.validUser.lastName,
        email: TestData.validUser.email,
    }));
    await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});

// TC-12: Test user registration via direct API call
test('TC-12 Generate signup from the API', async ({ page }) => {
    // Generate unique email
    const email = (TestData.validUser.email.split('@')[0] + 'pepeargento' + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);
    // Make direct API call to signup endpoint
    const response = await page.request.post('http://localhost:6007/api/auth/signup', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        data: {
            firstName: TestData.validUser.firstName,
            lastName: TestData.validUser.lastName,
            email: email,
            password: TestData.validUser.password,
        },
    });

    // Validate API response
    const responseBody = await response.json();
    expect(response.status()).toBe(201);
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.validUser.firstName,
        lastName: TestData.validUser.lastName,
        email: email,
    }));
});

// TC-13: Test frontend error handling for 500 server error
test('TC-13 Verify frontend reaction to 500 error on registration', async ({ page }) => {
    const email = (TestData.validUser.email.split('@')[0] + Date.now().toString() + '@' + TestData.validUser.email.split('@')[1]);;

    // Intercept the signup request and return a 500 error
    await page.route('**/api/auth/signup', (route) => {
        route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Internal Server Error' }),
        });
    });

    // Attempt registration
    await registerPage.fillRegistrationForm(TestData.validUser);
    await registerPage.makeClickOnRegisterButton();

    // Verify that an error message appears
    await expect(page.getByText('Internal Server Error')).toBeVisible();
});