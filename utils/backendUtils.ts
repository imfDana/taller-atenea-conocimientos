import { APIRequestContext, Page, expect, request } from '@playwright/test';

// Utility class for backend API operations
export class BackendUtils {

    // Create a new user via API with unique email
    static async createUserByAPI(request: APIRequestContext, user: any) {

        // Generate unique email using timestamp
        const email = (user.email.split('@')[0] + Date.now().toString() + '@' + user.email.split('@')[1]);

        // Make POST request to signup endpoint
        const response = await request.post('http://localhost:6007/api/auth/signup', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: email,
                password: user.password
            }
        });
        // Verify user was created successfully
        expect(response.status()).toBe(201);
        // Return user credentials for login
        return { email: email, password: user.password };

    }

    // static async createBankAccountByAPI(request: APIRequestContext) {
    //     const response = await request.post('http://localhost:6007/api/accounts', {
    //         headers: {
    //             'Accept': 'application/vnd.github.v3+json',
    //             'Content-Type': 'application/json'
    //         },
    //         data: {
    //             "type": "debit",
    //             "initialAmount": 1000
    //         }
    //     });
    //     expect(response.status()).toBe(201);
    //     const responseBody = await response.json();
    //     return responseBody;
    // }

}