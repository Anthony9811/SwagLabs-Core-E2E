# 🛍️ SwagLabs Core: Enterprise Testing Framework
A robust end-to-end automation suite for the **SauceLabs SwagLabs** application. This project demonstrates advanced automation patterns, including **Page Object Model (POM) inheritance, secure environment management,** and **Negative/Edge-case testing**.

# 🎯 Project Scope
The goal was to move beyond a simple "Happy Path" script. This framework validates:
* **State Management**: Verifying cart persistence across sessions.

* **Responsive Design**: Testing mobile-specific UI elements like the Burger Menu.

* **Known Anomalies**: Programmatically catching glitches from the `problem_user` and `error_user` profiles.

# 🚀 Continuous Integration
This project utilizes GitHub Actions to ensure code quality and cross-browser compatibility with every change.

* **Automated Runs**: Tests are triggered automatically on push to main and all pull_requests.

* **Environment**: Runs on ubuntu-latest using a clean Node.js environment.

* **Reporting**: On failure, the Playwright HTML report and Trace files are uploaded as artifacts for remote debugging.

# 🛠 Tech Stack
* **Language**: TypeScript
* **Framework**: Playwright Test
* **Pattern**: Page Object Model (POM)
* **Test Management**: QASE
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

  * **Technical Challenge & Solution:** Initial URL assertions failed due to the `?` character in the query string (`?id=4`) being interpreted as a Regex quantifier.
    * **Solution**: Escaped the reserved character (`\?`) and utilized the `\d+` wildcard to ensure the test remains valid regardless of which specific product ID is being tested.

  * **Status**: 🟢 **Complete**

* **SCEE-7: Reset application state via sidebar**

  * **Objective**: Validate that the "Reset App State" functionality clears the shopping cart and resets the UI without requiring a logout.

  * **Technical Challenge & Solution:** Cross-browser (Firefox/WebKit) failures where the item wasn't added to the cart before the sidebar opened.
    * **Solution**: Implemented a "State Buffer" by asserting the `cartBadgeNumber` is visible before triggering the reset. This ensures the "Add to cart" action is fully processed by the application's state manager before the UI is manipulated further.

  * **Status**: 🟢 **Complete**
  
* **SCEE-8: Verify Twitter social link in footer**

  * **Objective**: Ensure the Twitter icon correctly opens a new tab pointing to the official Sauce Labs social page.

  * Technical Implementation: Utilized a dynamic `goToSocials()` method using `getByTestId` for clean, decoupled locators.

    * Handled asynchronous tab creation using Playwright’s `Promise` pattern for browser contexts.

  * **Status**: 🟢 **Complete**

* **SCEE-16: Verify "Back to products" button functionality**

  * **Objective**: Validate that the navigation link on the product detail page correctly returns the user to the main inventory list.

  * **Technical Implementation**:

    * Implemented `openProductDetails()` and `backToProducts()` methods within the POM architecture.

    * Used a robust regex assertion `/.*inventory-item.html/` to verify the destination URL.

    * Validated successful navigation by asserting the existence of the "Products" page title.

  * **Status**: 🟢 **Complete**

* **SCEE-17: Verify Burger Menu functionality in mobile viewport**

  * **Objective**: Ensure the navigation menu is accessible, interactive, and can be closed when the application is viewed on a mobile-sized screen.

  * **Status**: 🟢 **Complete**

* **SCEE-20: Verify sorting failure with Problem User**

  * **Objective**: Document the functional bug where the "Sort" dropdown fails to reorder items for the `problem_user`.

  * **Technical Implementation**:

    * **Data Extraction**: Created a utility to scrape all prices from the UI, stripping currency symbols and converting them to floats for mathematical comparison.

    * **Reference Modeling**: Used the JavaScript spread operator `[...]` and a numeric comparator `(a, b) => a - b` to generate a "Perfect Order" array from the initial page state.

    * **Validation**: Compared the actual UI state after sorting against the reference model.
  
  * **Lessons Learned**: 
    * **Data Integrity in Assertions**: When testing sorting functionality, I implemented a non-destructive sorting logic using the spread operator. This ensures that the 'Initial State' data remains intact for comparison against the 'Post-Action' UI state, preventing false positives caused by reference-variable mutation.

    * Array Mutation: Learned the importance of shallow copying arrays before sorting to maintain the integrity of the original "Before" snapshot.

  * **Status**: 🟢 **Complete (Marked as Known Failure)**

* **SCEE-22: Verify broken links on Product Detail page**

  * **Objective**: Validate that certain product links redirect to incorrect pages or "404" states when using the `problem_user` account.

  * **Technical Implementation**:

    * Used `test.fail()` to explicitly mark the test as an expected failure.

    * Logged in as `problem_user` and attempted to view details for the "Sauce Labs Fleece Jacket".

    * Asserted that the page title matches the clicked product, which fails due to the application's internal "Problem User" logic.

  * **Status**: 🟢 **Complete (Marked as Known Failure)**

### 🔐 Cart & Checkout Suite (Project Code: SCEE)

* **SCEE-9: Add multiple items to cart and verify badge count**
  * **Objective**: Validate that the shopping cart correctly aggregates multiple different items and reflects the total count in the header badge.  
  * **Status**: 🟡 **Pending**

* **SCEE-10: Enter personal information in checkout flow**
  * **Objective**: Validate that the "Your Information" form accepts valid user data and allows progression to the checkout overview.
  * **Status**: 🟡 **Pending**

* **SCEE-11: Verify order overview and price calculations**
  * **Objective**: Ensure that the checkout overview page correctly displays the items, calculates the subtotal, adds the tax, and displays the final total.
  * **Status**: 🟡 **Pending**

* **SCEE-12: Complete purchase and verify success message**
  * **Objective**: Validate the final step of the checkout process, ensuring the order is submitted and the user receives a "Thank You" confirmation.
  * **Status**: 🟡 **Pending**

* **SCEE-13: Cancel checkout and return to inventory**
  * **Objective**: Ensure that the "Cancel" button on the checkout information page correctly aborts the transaction and returns the user to the cart or inventory without saving data.
  * **Status**: 🟡 **Pending**

* **SCEE-14: Attempt checkout with an empty cart**
  * **Objective**: Validate system behavior when a user attempts to proceed to checkout without any items in the shopping cart.
  * **Status**: 🟡 **Pending**

* **SCEE-15: Verify cart items persist after logout and login**
  * **Objective**: Ensure that items added to the cart remain saved when a user logs out and logs back in during the same session.
  * **Status**: 🟡 **Pending**

* **SCEE-21: Verify Last Name field "Lock" for Error User**
  * **Objective**: Document the specific functional defect where the "Last Name" field is non-interactive for the `error_user`.
  * **Status**: 🟡 **Pending**