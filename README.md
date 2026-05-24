# Automation Framework Documentation

## Overview

This project is a hybrid automation framework built to validate both UI and API workflows.

- UI under test: `https://automationexercise.com`
- API under test: `https://reqres.in`

The framework is designed with maintainability, reusability, reporting, and scalability in mind. It uses Playwright for execution, Page Object Model for UI automation, and a service-layer approach for API automation.

## Technology Stack

### Playwright

Playwright is used because it provides:

- reliable browser automation
- strong locator support
- parallel execution
- built-in screenshots, videos, and traces
- native HTML reports
- support for both UI and API automation

### Node.js / JavaScript

Node.js with JavaScript is used because:

- Playwright is well supported in this ecosystem
- project setup is simple
- execution is fast
- JSON-based test data is easy to maintain

### Axios

Axios is used for API requests because:

- it is lightweight
- it supports interceptors
- it is easy to wrap inside reusable service classes

### Allure

Allure is used for reporting because it provides:

- rich visual reporting
- attachment support
- clear pass/fail visualization
- better historical and execution-level visibility

### Winston

Winston is used for logging because:

- it centralizes execution logs
- it helps with failure analysis
- it supports cleaner debugging and troubleshooting

## Framework Design

The framework follows separation of concerns:

- UI actions are implemented in page objects
- API calls are implemented in service classes
- assertions are centralized where needed
- test data is externalized
- execution configuration is centralized
- reports are generated separately for UI and API

This helps when:

- locators change
- endpoints change
- new test cases are added
- reporting needs grow

## Current Coverage

### API Coverage

Current API coverage includes:

- create user
- read user
- update user
- delete user
- invalid endpoint validation
- invalid payload handling
- non-existing user retrieval

File:

- [tests/api/users.spec.js](C:/Projects/SimeLabs/tests/api/users.spec.js)

### UI Coverage

Current UI coverage includes one end-to-end user journey:

- register a new user
- log in with the created account
- add a product to the cart
- proceed to checkout
- validate order summary details
- delete the account

File:

- [tests/web/RegisterUser.spec.js](C:/Projects/SimeLabs/tests/web/RegisterUser.spec.js)

## Project Structure

### `api/`

Contains API automation components.

- [ApiClient.js](C:/Projects/SimeLabs/api/ApiClient.js)
  Reusable HTTP client wrapper built on Axios
- [UserApiService.js](C:/Projects/SimeLabs/api/UserApiService.js)
  User endpoint service methods
- [ApiAssertions.js](C:/Projects/SimeLabs/api/ApiAssertions.js)
  Reusable API assertions

### `pages/`

Contains UI page objects.

- [BasePage.js](C:/Projects/SimeLabs/pages/BasePage.js)
  Shared UI actions, waits, navigation, and helpers
- [HomePage.js](C:/Projects/SimeLabs/pages/HomePage.js)
  Home page navigation and account-related actions
- [LoginPage.js](C:/Projects/SimeLabs/pages/LoginPage.js)
  Login page interactions
- [RegisterPage.js](C:/Projects/SimeLabs/pages/RegisterPage.js)
  Signup and registration flow
- [ProductsPage.js](C:/Projects/SimeLabs/pages/ProductsPage.js)
  Product listing and add-to-cart flow
- [CartPage.js](C:/Projects/SimeLabs/pages/CartPage.js)
  Cart validations and checkout entry
- [CheckOutPage.js](C:/Projects/SimeLabs/pages/CheckOutPage.js)
  Checkout and order summary validations

### `tests/`

Contains test specifications.

- `tests/api/`
  API test scenarios
- `tests/web/`
  UI test scenarios

### `fixtures/`

Contains Playwright fixtures.

- [apiFixtures.js](C:/Projects/SimeLabs/fixtures/apiFixtures.js)
  Injects shared API dependencies into tests

### `utils/`

Contains reusable utility modules.

- [Logger.js](C:/Projects/SimeLabs/utils/Logger.js)
  Framework logging
- [SchemaValidator.js](C:/Projects/SimeLabs/utils/SchemaValidator.js)
  API schema validation
- [TestDataGenerator.js](C:/Projects/SimeLabs/utils/TestDataGenerator.js)
  Generated data helper, currently used mainly for API scenarios

### `test-data/`

Contains external test data.

- [test-data/ui/register-user.json](C:/Projects/SimeLabs/test-data/ui/register-user.json)
  JSON-driven UI data source

### `reports/`

Contains generated reports.

- `reports/ui/`
  UI reports
- `reports/api/`
  API reports
- `reports/all/`
  combined execution reports

### `logs/`

Contains framework and execution logs.

### `.ENV`

Contains runtime configuration such as:

- application URLs
- browser settings
- headless mode
- API key
- logging configuration

File:

- [.ENV](C:/Projects/SimeLabs/.ENV)

## Important Files

### `playwright.config.js`

File:

- [playwright.config.js](C:/Projects/SimeLabs/playwright.config.js)

This is the main execution configuration file.

It controls:

- test discovery
- timeouts
- retries
- workers
- browser settings
- screenshots, videos, and traces
- UI/API project separation
- report generation

Key sections:

- `testDir`
  defines where Playwright looks for tests
- `projects`
  separates UI and API execution
- `reporter`
  generates HTML, Allure, and JSON reports
- `use`
  defines browser and execution defaults
- `outputDir`
  stores test artifacts

Why it matters:

- it centralizes framework behavior
- it avoids duplicate execution settings
- it keeps test files focused on business logic

### `package.json`

File:

- [package.json](C:/Projects/SimeLabs/package.json)

This file defines:

- project metadata
- dependencies
- dev dependencies
- reusable run scripts

Why it matters:

- it standardizes installation
- it standardizes execution
- it gives simple commands for running suites and reports

Examples:

- `npm run test:web`
- `npm run test:api`
- `npm run report:html:web`
- `npm run report:html:api`
- `npm run allure:generate:web`
- `npm run allure:open:web`

## Installation Prerequisites

Before using this project, ensure the following are installed:

- Node.js `18+`
- npm
- Playwright browser binaries
- Java
  Commonly required for Allure commandline usage

Optional:

- VS Code
- Git

## Setup

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

### Verify environment settings

Review [.ENV](C:/Projects/SimeLabs/.ENV), especially:

- `BASE_URL`
- `API_BASE_URL`
- `HEADLESS`
- `API_KEY`

## Execution

### Run all tests

```bash
npm test
```

### Run UI tests

```bash
npm run test:web
```

### Run API tests

```bash
npm run test:api
```

### Run in headed mode

```bash
npm run test:headed
```

### Run in debug mode

```bash
npm run test:debug
```

## Reporting

### Playwright HTML Report

UI:

```bash
npm run report:html:web
```

API:

```bash
npm run report:html:api
```

### Allure Report

UI:

```bash
npm run allure:generate:web
npm run allure:open:web
```

API:

```bash
npm run allure:generate:api
npm run allure:open:api
```

### Report Types

- Playwright HTML report
  Best for debugging and inspecting traces, screenshots, and videos
- Allure report
  Best for execution summaries and richer visual reporting
- JSON report
  Useful for integrations and machine-readable output

## Data-Driven Approach

For UI automation, test data is externalized to JSON:

- [test-data/ui/register-user.json](C:/Projects/SimeLabs/test-data/ui/register-user.json)

Benefits:

- data is separated from test logic
- maintenance is easier
- multiple datasets can be added later
- UI tests can scale toward broader data-driven coverage

Note:

- the registration email is made unique at runtime to avoid duplicate-account failures

## Reusability and Maintainability

This framework supports:

- reusable page methods
- reusable API services
- reusable assertions
- clear folder structure
- scalable reporting
- easier onboarding for new contributors

If the application changes:

- locator updates are usually limited to page objects
- endpoint updates are usually limited to service files
- test intent remains stable

## Limitations

- ReqRes is a mock API, so POST-created users are not truly persisted
- UI registration still requires a unique email for repeated execution
- legacy output folders may remain if old reports are not cleaned

## Future Improvements

Possible enhancements:

- multiple JSON datasets for UI tests
- Excel-driven data support if needed
- CI/CD pipeline integration
- smoke/regression tagging
- richer API attachments in Allure
- expanded cross-browser execution
- environment-based execution pipelines

## Command Reference

### Install

```bash
npm install
npx playwright install
```

### Run

```bash
npm run test:web
npm run test:api
```

### Reports

```bash
npm run report:html:web
npm run report:html:api
npm run allure:generate:web
npm run allure:open:web
npm run allure:generate:api
npm run allure:open:api
```

### Cleanup

```bash
npm run clean
```

## Summary

This project is a structured automation framework that combines:

- UI automation
- API automation
- reusable architecture
- data-driven support
- detailed reporting
- debugging artifacts

It is organized to support maintainability, execution clarity, and future scaling.

