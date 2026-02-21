# 🏦 Athena Bank - E2E Test Automation

[![CI - cloning app and running tests](https://github.com/imfDana/workshop-athenabank/actions/workflows/test.yml/badge.svg)](https://github.com/imfDana/workshop-athenabank/actions/workflows/test.yml)

A robust End-to-End (E2E) test automation framework for the **Athena Bank** web application, built with **Playwright** and **TypeScript**. This project demonstrates modern QA engineering practices, integrating seamlessly into a CI/CD pipeline.

## 🚀 Key Features & Skills Demonstrated

- **Page Object Model (POM):** Scalable and maintainable test architecture.
- **Hybrid Testing (API + UI):** Utilizes backend API endpoints for fast test data setup (e.g., creating users), reducing UI flakiness and test execution time.
- **CI/CD Integration:** Automated test execution via GitHub Actions on every push/pull request.
- **Dynamic Test Data:** Handles dynamic system responses and randomized data securely using Playwright's state management (`.auth`).

## 🛠️ Tech Stack

- **Framework:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **CI/CD:** GitHub Actions
- **Reporting:** Playwright HTML Reporter & GitHub Pages

## 📦 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/imfDana/workshop-athenabank.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## ▶️ Running Tests

Use the following npm scripts to execute the tests:

- **Run all tests (headless):** `npm run test`
- **Run tests with UI mode:** `npm run test:ui`
- **View HTML Report:** `npm run report`

## 📊 Test Reports

Test reports are automatically generated and deployed via GitHub Actions. 
[View Latest Test Report on GitHub Pages](https://imfDana.github.io/workshop-athenabank/)