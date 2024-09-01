import { expect } from "@playwright/test";
import { test } from "../test-utils/custom-fixtures";
import {
  sortByPrice,
  getFirstItem,
  getItemByTitle,
  addToCartQuick,
  addBundleToCart,
  removeFirstItemFromCart,
  addLastItemFromCartSuggestions,
} from "../test-utils/scenario-two-specific-utils";
import {
  verifyCountInCart,
  goToCart,
  proceedToCheckout,
  fillInOrderForm,
  placeOrder,
} from "../test-utils/shared-utils";
import { itemsToBuy, itemsInScenario2, shopper } from "../test-data/test-data";

test.beforeEach(async ({ landingPage }) => {
  await landingPage;
});

test.describe("navigate to women's pants section and verify display is sorted by cheapest", () => {
  test("should navigate to 'Women' > 'Bottoms' > 'Pants' section", async ({
    womenPantsPage,
  }) => {
    await expect(womenPantsPage.locator("h1")).toHaveText("Pants");
    await expect(
      womenPantsPage.locator("div.products-grid > ol.product-items")
    ).toBeVisible();
  });

  test("should sort pants by price > ascending", async ({ womenPantsPage }) => {
    await sortByPrice(womenPantsPage);
    const numberOfItems = await womenPantsPage
      .locator("div.products-grid > ol.product-items > li.product-item")
      .count();
    const prices = [];
    for (let i = 0; i < Number(numberOfItems); i++) {
      const itemPrice = await womenPantsPage
        .locator("div.products-grid > ol.product-items > li.product-item")
        .nth(i)
        .locator("span[data-price-amount]")
        .getAttribute("data-price-amount");
      prices.push(Number(itemPrice));
    }
    const isAscending = () => {
      for (let i = 1; i < prices.length; i++) {
        if (prices[i] < prices[i - 1]) {
          return false;
        }
        return true;
      }
    };
    expect(isAscending()).toBe(true);
  });
});

test.describe("select pants and add them to cart", () => {
  test.beforeEach(async ({ womenPantsPage }) => {
    await womenPantsPage;
    await sortByPrice(womenPantsPage);
  });

  test("should select cheapest pants, add to cart and see the cart icon update with item count", async ({
    womenPantsPage,
  }) => {
    const cheapestPants = await getFirstItem(womenPantsPage);
    const chepestPantsName = await cheapestPants
      .locator("strong.product-item-name")
      .textContent();
    expect(chepestPantsName).toMatch(itemsToBuy[1].title);
    await addToCartQuick(cheapestPants, itemsToBuy[1]);
    await verifyCountInCart(womenPantsPage, itemsToBuy[1]);
  });

  test("should add two more pairs of pants to cart and verify count", async ({
    womenPantsPage,
  }) => {
    let itemInCartCount = 0;
    const cheapestPants = await getFirstItem(womenPantsPage);
    await addToCartQuick(cheapestPants, itemsToBuy[1]);
    itemInCartCount += Number(itemsToBuy[1].quantity);
    await verifyCountInCart(womenPantsPage, itemInCartCount.toString());
    const secondPair = await getItemByTitle(womenPantsPage, itemsToBuy[2]);
    await addToCartQuick(secondPair, itemsToBuy[2]);
    itemInCartCount += Number(itemsToBuy[2].quantity);
    await verifyCountInCart(womenPantsPage, itemInCartCount.toString());
    const thirdPair = await getItemByTitle(womenPantsPage, itemsToBuy[3]);
    await addToCartQuick(thirdPair, itemsToBuy[3]);
    itemInCartCount += Number(itemsToBuy[3].quantity);
    await verifyCountInCart(womenPantsPage, itemInCartCount.toString());
  });
});

test.describe("verify pants removal from cart and addition from suggestions", () => {
  test.beforeEach(async ({ womenPantsPage }) => {
    await womenPantsPage;
    await sortByPrice(womenPantsPage);
    await addBundleToCart(
      womenPantsPage,
      itemsToBuy[1],
      itemsToBuy[2],
      itemsToBuy[3]
    );
    await verifyCountInCart(womenPantsPage, itemsInScenario2);
    await goToCart(womenPantsPage);
  });

  test("should go to cart and remove the first pair of pants", async ({
    womenPantsPage,
  }) => {
    const cartTable = await womenPantsPage.getByRole("table", {
      name: "Shopping Cart Items",
    });
    const numberOfItems = await cartTable.locator("tbody").count();
    await removeFirstItemFromCart(womenPantsPage);
    await cartTable.waitFor();
    await expect(cartTable.locator("tbody")).toHaveCount(numberOfItems - 1);
  });

  test("should add last item from suggestions", async ({ womenPantsPage }) => {
    const cartTable = await womenPantsPage.getByRole("table", {
      name: "Shopping Cart Items",
    });
    const numberOfItems = await cartTable.locator("tbody").count();
    const numberExpected = Number(itemsInScenario2);
    await addLastItemFromCartSuggestions(womenPantsPage);
    await cartTable
      .locator("tbody")
      .nth(numberExpected - 1)
      .waitFor();
    await expect(cartTable.locator("tbody")).toHaveCount(numberOfItems + 1);
  });
});

test.describe("complete the order of pants", async () => {
  test.beforeEach(async ({ womenPantsPage }) => {
    await womenPantsPage;
    await sortByPrice(womenPantsPage);
    await addBundleToCart(
      womenPantsPage,
      itemsToBuy[1],
      itemsToBuy[2],
      itemsToBuy[3]
    );
    await verifyCountInCart(womenPantsPage, itemsInScenario2);
    await goToCart(womenPantsPage);
    await removeFirstItemFromCart(womenPantsPage);
    await addLastItemFromCartSuggestions(womenPantsPage);
  });

  test("should proceed to checkout, fill in form and place pants order", async ({
    womenPantsPage,
  }) => {
    await proceedToCheckout(womenPantsPage);
    await fillInOrderForm(womenPantsPage, shopper);
    await placeOrder(womenPantsPage);
  });
});
