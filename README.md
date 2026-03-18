# 🛍️ SwagLabs Core: Enterprise Testing Framework
A robust end-to-end automation suite for the **SauceLabs SwagLabs** application. This project demonstrates advanced automation patterns, including **Page Object Model (POM) inheritance, secure environment management,** and **Negative/Edge-case testing**.

# 🎯 Project Scope
The goal was to move beyond a simple "Happy Path" script. This framework validates:
* **State Management**: Verifying cart persistence across sessions.

* **Responsive Design**: Testing mobile-specific UI elements like the Burger Menu.

* **Known Anomalies**: Programmatically catching glitches from the `problem_user` and `error_user` profiles.

* **Manual-to-Automation Bridge**: Direct reporting link to Qase.io.

# 🚀 Continuous Integration
This project utilizes GitHub Actions to ensure code quality and cross-browser compatibility with every change.

* **Automated Runs**: Tests are triggered automatically on push to main and all pull_requests.

* **Environment**: Runs on ubuntu-latest using a clean Node.js environment.

* **Reporting**: On failure, the Playwright HTML report and Trace files are uploaded as artifacts for remote debugging.

# 🛠 Tech Stack
* **Language**: TypeScript
* **Framework**: Playwright Test
* **Pattern**: Page Object Model (POM)
* **Target Site**: [SauceLabs SwagLabs](https://www.saucedemo.com)

# 📂 Project Structure
The project follows a clean separation of concerns:

* `pages/`: Contains Page Objects (Locators and Page-specific actions).

* `tests/`: Contains test specifications and assertions.

* `playwright.config.ts`: Global configuration for browsers, retries, and reporting.

# 🌟 Key Features
* **BasePage Inheritance**: Shared logic and common navigation methods.

* **Auto-waiting**: Leveraging Playwright's built-in stability to eliminate "flaky" tests.

* **Cross-Browser Testing**: Configured to run across Chromium, Firefox, and WebKit.

* **Trace Viewer**: Detailed post-execution analysis for debugging.

# 🚦 Getting Started
### Prerequisites
* Node.js (v18 or higher)
* NPM (comes with Node)

### Installation
1. Clone the repository: `git clone https://github.com/Anthony9811/SwagLabs-Core-E2E.git`
2. Install dependencies: `npm install`
3. Install Playwright Browsers: `npx playwright install`

### Running Tests
* Run all tests: `npx playwright test`
* Run in UI Mode (Interactive): `npx playwright test --ui`
* Generate Report: `npx playwright show-report`

# 🚀 Automation Roadmap & Implementation

### 🔐 Authentication Suite (Project Code: SCEE)

* **C1: Standard User Login**
  * **Objective**: Validate the primary "Happy Path" for user entry.
  * **Technical Implementation**: Utilized `page.getByTestId()` for resilient locators. Verified state transition via URL regex matching.
  * **Status**: 🟢 **Complete**

* **C2: Locked Out User**
  * **Objective**: Verify the application handles unauthorized access gracefully.
  * **Technical Implementation**: Used Web-First Assertions (`toContainText`) to validate dynamic error messages without brittle `hard-waits`.
  * **Status**: 🟢 **Complete**

* **C3: Successful User Logout**
  * **Objective**: Ensure session termination and redirection from the Inventory page.
  * **Technical Implementation**: Demonstrated **POM Inheritance**. Called the `logout()` method inherited from `BasePage` to handle the multi-step sidebar interaction.
  * **Status**: 🟢 **Complete**

* **C18: UI Anomalies (Problem User)**
  * **Objective**: Detect visual regressions and broken image assets.
  * **Technical Implementation**: Will implement logic to verify the `src` attributes of product images and detect known "glitch" patterns.
  * **Status**: 🟡 **Pending**

* **C19: Functional Failures (Error User)**

  * **Objective**: Identify "silent" failures where UI actions do not trigger the expected state change.
  * **Technical Implementation**: Will focus on state verification, ensuring cart counts and buttons behave correctly under error conditions.
  * **Status**: 🟡 **Pending**