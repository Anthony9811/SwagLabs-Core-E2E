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

* **SCEE-1: Standard User Login**
  * **Objective**: Validate the primary "Happy Path" for user entry.
  * **Technical Implementation**: Utilized `page.getByTestId()` for resilient locators. Verified state transition via URL regex matching.
  * **Status**: 🟢 **Complete**

* **SCEE-2: Locked Out User**
  * **Objective**: Verify the application handles unauthorized access gracefully.
  * **Technical Implementation**: Used Web-First Assertions (`toContainText`) to validate dynamic error messages without brittle `hard-waits`.
  * **Status**: 🟢 **Complete**

* **SCEE-3: Successful User Logout**
  * **Objective**: Ensure session termination and redirection from the Inventory page.
  * **Technical Implementation**: Demonstrated **POM Inheritance**. Called the `logout()` method inherited from `BasePage` to handle the multi-step sidebar interaction.
  * **Status**: 🟢 **Complete**

* **SCEE-18: UI Anomalies (Problem User)**
  * **Objective**: Detect visual regressions and broken image assets.
  * **Technical Implementation**: Used `getByTestId('inventory-item')` combined with `.filter({ hasText: '...' })` and `getByRole('img')` to avoid brittle CSS selectors.

    * **Validation Logic**: Chose **Attribute Inspection** over pixel-comparison. This is significantly faster, less flaky, and allows the test to run across different resolutions or environments while still catching the underlying data failure.

    * **Failure Management**: Implemented `test.fail()` to explicitly mark this as a **Known Bug**. This ensures the suite remains green while documenting that the application is not currently meeting the expected image source requirements.
  * **Status**: 🟢 **Complete (Marked as Known Failure)**

* **SCEE-19: Functional Failures (Error User)**

  * **Objective**: Identify "silent" failures where UI actions do not trigger the expected state change.
  * **Technical Implementation**: Used `test.fail()` to document known functional bugs. Implemented `getButtonByProductName()` to encapsulate the `filter` and `getByRole` logic for cleaner, multi-product assertions.
  * **Status**: 🟢 **Complete (Marked as Known Failure)**

  ### 🔐 Product Inventory Suite (Project Code: SCEE)

  * **SCEE-4: Verify total product count on inventory page**

  * **Objective**: Ensure the product grid correctly loads all items from the database.
  * **Technical Implementation**: Utilized the `inventoryItem` locator within a `standard_user` session to perform a `.toHaveCount(6)` assertion. Established a `beforeEach` hook for consistent Page Object instantiation.
  * **Status**: 🟢 **Complete**

* **SCEE-5: Sort products by price in ascending order**

  * **Objective**: Validate that selecting "Price (low to high)" correctly reorders the product grid with the first item at $7.99 and the last at $49.99.

  * **Technical Implementation**: Used `.selectOption()` for sorting and encapsulated price retrieval in the POM via `getProductPriceByIndex()`. Performed index-based assertions to verify the $7.99 and $49.99 price boundaries.

  * **Status**: 🟢 **Complete**

* **SCEE-6: View individual product details**

  * **Objective**: Verify that clicking a product name redirects to the correct details page with matching name and price data.

  * **Status**: 🟡 **Pending**

* **SCEE-7: Reset application state via sidebar**

  * **Objective**: Validate that the "Reset App State" functionality clears the shopping cart and resets the UI without requiring a logout.

  * **Status**: 🟡 **Pending**
  
* **SCEE-8: Verify Twitter social link in footer**

  * **Objective**: Ensure the Twitter icon correctly opens a new tab pointing to the official Sauce Labs social page.

  * **Status**: 🟡 **Pending**

* **SCEE-16: Verify "Back to products" button functionality**

  * **Objective**: Validate that the navigation link on the product detail page correctly returns the user to the main inventory list.

  * **Status**: 🟡 **Pending**

* **SCEE-17: Verify Burger Menu functionality in mobile viewport**

  * **Objective**: Ensure the navigation menu is accessible, interactive, and can be closed when the application is viewed on a mobile-sized screen.

  * **Status**: 🟡 **Pending**

* **SCEE-20: Verify sorting failure with Problem User**

  * **Objective**: Document the functional bug where the "Sort" dropdown fails to reorder items for the problem_user.

  * **Status**: 🟡 **Pending**

* **SCEE-22: Verify broken links on Product Detail page**

  * **Objective**: Validate that certain product links redirect to incorrect pages or "404" states when using the problem_user account.

  * **Status**: 🟡 **Pending**