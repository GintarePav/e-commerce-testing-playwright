import { expect } from "@playwright/test";

exports.sortByPrice = async (page) => {
  const sortDirectionBtn = await page.getByRole("link", {
    name: "Set Descending Direction",
  });
  const sortDirection = await sortDirectionBtn.getAttribute("data-value");
  expect(sortDirection).toBe("desc"); // the button indicates the direction that would take effect after it's clicked? So if dsc now, means direction asc now?
  await page.getByLabel("Sort By").selectOption("Price");
  await page.waitForURL(/price/);
  await expect(
    page.locator("div.products-grid > ol.product-items")
  ).toBeVisible();
};

exports.getFirstItem = async (page) => {
  const firstItem = await page
    .locator("div.products-grid > ol.product-items > li.product-item")
    .first();
  return firstItem;
};

const getItemByTitle = async (page, data) => {
  const listCount = await page
    .locator("div.products-grid > ol.product-items > li.product-item")
    .count();

  for (let i = 0; i < listCount; i++) {
    const itemLocator = await page
      .locator("div.products-grid > ol.product-items > li.product-item")
      .nth(i)
      .locator("a.product-item-link");

    const itemName = await itemLocator.textContent();
    if (itemName.includes(data.title)) {
      const finalLocator = await page
        .locator("div.products-grid > ol.product-items > li.product-item")
        .nth(i);

      return finalLocator;
    }
  }
  return null;
};
exports.getItemByTitle = getItemByTitle;

const addToCartQuick = async (page, data) => {
  const size = await page.getByRole("option", {
    name: data.size,
  });
  await size.waitFor();
  await size.click();
  await expect(size).toHaveClass(/selected/);
  const colour = await page.getByRole("option", {
    name: data.colour,
  });
  await colour.waitFor();
  await colour.click();
  await expect(colour).toHaveClass(/selected/);
  await page.getByRole("button", { name: "Add to Cart" }).click();
};
exports.addToCartQuick = addToCartQuick;

exports.addBundleToCart = async (page, ...data) => {
  for (const item of data) {
    const itemToBuy = await getItemByTitle(page, item);
    await addToCartQuick(itemToBuy, item);
  }
};

exports.removeFirstItemFromCart = async (page) => {
  await page.getByRole("link", { name: "Remove item" }).first().click();
};

exports.addLastItemFromCartSuggestions = async (page) => {
  const lastSuggestedItemBtn = await page
    .getByLabel("More Choices")
    .getByRole("button", {
      name: "Add to Cart",
    })
    .nth(-1);
  await lastSuggestedItemBtn.click();
};
