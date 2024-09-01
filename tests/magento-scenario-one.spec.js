import { expect } from "@playwright/test";
import { test } from "../test-utils/custom-fixtures";
import {
  pickQualitiesFromDetailsPage,
  addToCart,
} from "../test-utils/scenario-one-specific-utils";
import {
  verifyCountInCart,
  goToCart,
  proceedToCheckout,
  fillInOrderForm,
  placeOrder,
} from "../test-utils/shared-utils";
import { itemsToBuy, shopper } from "../test-data/test-data";

test.beforeEach(async ({ landingPage }) => {
  await landingPage;
});

test.describe("navigate to men's hoodies section and verify display", () => {
  test("should navigate to 'Men' > 'Tops' > 'Hoodies & Sweatshirts' section", async ({
    menHoodiesPage,
  }) => {
    await expect(menHoodiesPage.locator("h1")).toHaveText(
      "Hoodies & Sweatshirts"
    );
    await expect(
      menHoodiesPage.locator("div.products-grid > ol.product-items")
    ).toBeVisible();
  });

  test("should display number of men hoodies matching with the number per page", async ({
    menHoodiesPage,
  }) => {
    const perPageSelector = await menHoodiesPage.getByLabel("Show");
    const perPageValue = await perPageSelector.inputValue();
    const perPageNumber = Number(perPageValue);
    await expect(
      menHoodiesPage.locator(
        "div.products-grid > ol.product-items > li.product-item"
      )
    ).toHaveCount(perPageNumber);
  });
});

test.describe("access 'Frankie Sweatshirt' from the product list and add to cart", () => {
  test.beforeEach(async ({ frankieSweatshirtPage }) => {
    await frankieSweatshirtPage;
  });

  test("should have 'Frankie Sweatshirt' details visible", async ({
    frankieSweatshirtPage,
  }) => {
    await expect(frankieSweatshirtPage.locator("h1")).toHaveText(
      "Frankie Sweatshirt"
    );
    await expect(
      frankieSweatshirtPage.locator("[data-gallery-role='gallery']")
    ).toBeVisible();
    await expect(
      frankieSweatshirtPage.locator(
        "[data-role='priceBox'][data-product-id='110']"
      )
    ).toBeVisible();
    await expect(
      frankieSweatshirtPage.getByTitle("Availability")
    ).toBeVisible();
    await expect(frankieSweatshirtPage.getByLabel("Details")).toBeVisible();
    await frankieSweatshirtPage
      .getByRole("link", { name: "More Information" })
      .click();
    await expect(
      frankieSweatshirtPage.getByLabel("More Information")
    ).toBeVisible();
    await frankieSweatshirtPage.getByRole("link", { name: "Reviews" }).click();
    await expect(frankieSweatshirtPage.getByLabel("Reviews")).toBeVisible();
  });

  test("should select the size, colour and quantity for 'Frankie Sweatshirt' and add it to cart", async ({
    frankieSweatshirtPage,
  }) => {
    await pickQualitiesFromDetailsPage(frankieSweatshirtPage, itemsToBuy[0]);
    await expect(
      frankieSweatshirtPage.getByLabel(itemsToBuy[0].size)
    ).toHaveClass(/selected/);
    await expect(
      frankieSweatshirtPage.getByLabel(itemsToBuy[0].colour)
    ).toHaveClass(/selected/);
    await expect(
      frankieSweatshirtPage.getByRole("spinbutton", { name: "Qty" })
    ).toHaveValue(itemsToBuy[0].quantity);
    await addToCart(frankieSweatshirtPage);
  });

  test("should have the cart icon updated with the number of 'Frankie Sweatshirt' added", async ({
    frankieSweatshirtPage,
  }) => {
    await pickQualitiesFromDetailsPage(frankieSweatshirtPage, itemsToBuy[0]);
    await addToCart(frankieSweatshirtPage);
    await verifyCountInCart(frankieSweatshirtPage, itemsToBuy[0]);
  });
});

test.describe("verify the details of 'Frankie Sweatshirt' inside the cart and complete the order", () => {
  test.beforeEach(async ({ frankieSweatshirtPage }) => {
    await frankieSweatshirtPage;
    await pickQualitiesFromDetailsPage(frankieSweatshirtPage, itemsToBuy[0]);
    await addToCart(frankieSweatshirtPage);
    await verifyCountInCart(frankieSweatshirtPage, itemsToBuy[0]);
    await goToCart(frankieSweatshirtPage, itemsToBuy[0].quantity);
  });

  test("should open the cart and have the same 'Frankie Sweatshirt' details as selected when adding to cart", async ({
    frankieSweatshirtPage,
  }) => {
    const cartTable = await frankieSweatshirtPage.locator("td[data-th='Item']");
    await expect(cartTable.getByRole("strong")).toContainText(
      "Frankie Sweatshirt"
    );
    await expect(
      cartTable.locator("dl.item-options > dd").nth(0)
    ).toContainText(itemsToBuy[0].size);
    await expect(
      cartTable.locator("dl.item-options > dd").nth(1)
    ).toContainText(itemsToBuy[0].colour);
    await expect(
      frankieSweatshirtPage.getByRole("spinbutton", { name: "Qty" })
    ).toHaveValue(itemsToBuy[0].quantity);
  });

  test("should proceed to checkout, fill in form and place 'Frankie Sweatshirt' order", async ({
    frankieSweatshirtPage,
  }) => {
    await proceedToCheckout(frankieSweatshirtPage);
    await fillInOrderForm(frankieSweatshirtPage, shopper);
    await placeOrder(frankieSweatshirtPage);
  });
});
