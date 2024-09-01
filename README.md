# Project Overview

This project contains my first ever automation tests written to test a [demo e-commerce page](https://magento.softwaretestingboard.com/) created to allow people practice writing automated tests. The tests are written using Playwright and JavaScript and aim to cover the following functionalities of the page:

- Navigating through product categories.
- Viewing product details.
- Adding items to and removing them from cart.
- Checking out by submitting shipping and payment details via a form.
- Completing the order.

This is done throughout two scenarios using three default Playwright browsers (chromium, firefox, webkit).

## Project Structure

There are four major folders:

1. **test-data**, containing the shopper's personal details (not real) and the size, colour and quantity of products to be bought.
2. **test-utils**, containing custom fixtures and functions used across the tests.
3. **test**, containing the actual tests: one file per scenario (2);

## Requirements

- **[Node.js](https://nodejs.org/en)**: Version 16 or later.
- **[Playwright](https://playwright.dev/docs/intro)**: The test framework used. (Installation details below)

## Installation

1. Clone the repository using the command line:

```
git clone https://github.com/GintarePav/e-commerce-testing-playwright.git
cd magento-playwright-js
```

2. Install Playwright

```
npm init playwright@latest
```

You will be asked a series of questions and will need to select the following options:

```
JavaScript
tests
false
true
```

## Configuration

No additional steps are needed to configure the test. The project uses Playwright's default configs (see _playwright.config.js_ in the root folder) that has been eddited to include custom timeout for firefox and webkit.

## Running the Tests

Tests can be run using various commands.

To run all tests using all browsers, type this comamnd:

```
npx playwright test
```

To run tests using debugger, add this:

```
npx playwright test --debug
```

To run tests using a selected browser, indicate it like this (replace chromium with firefox or webkit if needed):

```
npx playwright test --project=chromium
```

To run only one file, use the name of one of the files inside the tests directory:

```
npx playwright test tests/file-name.spec.js
```

To run a specific test, type this:

```
npx playwright test -g "title"
```

As an example, you can use this title: _should select the size, colour and quantity for 'Frankie Sweatshirt' and add it to cart_.

You can also join these commands, e.g.:

```
npx playwright test -g "title" --project=chromium
```

This will run the selected test using only chromium browser.

## Improvements Needed

Since the tests were written under time constrains, there are definite areas for improvement.

1. The biggest issue faced is the prolonged load time when running tests on firefox and webkit, which has a tendency to end in failures, so this should be researched and addressed first.

1. Another issue is the availability of elements during full-speed testing. Sometimes a test may end in failure because the UI is not able to catch up with the actions a test carries out. This should be solved by spending more time on learning locator selection and ensuring their availability.

1. Once the issues above have been covered, it would be possible to move on to implementing [page object models](https://playwright.dev/docs/pom);
