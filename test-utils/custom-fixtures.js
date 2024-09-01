import { test as base, expect } from "@playwright/test";

exports.test = base.extend({
  landingPage: async ({ page }, use) => {
    await page.goto("https://magento.softwaretestingboard.com/");
    await use(page);
  },
  menHoodiesPage: async ({ page }, use) => {
    await page.getByRole("menuitem", { name: /Men/ }).hover(); // test generator indicates this name: " Men"; Fails without "" because woMEN.
    await page.getByRole("menuitem", { name: "Tops" }).hover();
    await page.getByRole("menuitem", { name: "Hoodies & Sweatshirts" }).click();
    await page.waitForURL(/.*men.*hoodies.*sweatshirts.*/);
    await expect(page).toHaveTitle(/Hoodies & Sweatshirts/);
    await use(page);
  },
  frankieSweatshirtPage: async ({ page }, use) => {
    await page.getByRole("menuitem", { name: /Men/ }).hover();
    await page.getByRole("menuitem", { name: "Tops" }).hover();
    await page.getByRole("menuitem", { name: "Hoodies & Sweatshirts" }).click();
    await page.getByText("Frankie Sweatshirt").click();
    await page.waitForURL(/frankie-sweatshirt/);
    await expect(page).toHaveTitle("Frankie Sweatshirt");
    await use(page);
  },

  womenPantsPage: async ({ page }, use) => {
    await page.getByRole("menuitem", { name: "Women" }).hover();
    await page.getByRole("menuitem", { name: "Bottoms" }).hover();
    await page.getByRole("menuitem", { name: "Pants" }).click();
    await page.waitForURL(/.*women.*pants.*/);
    await page.locator("div.products-grid > ol.product-items").waitFor();
    await expect(page).toHaveTitle(/Pants/);
    await use(page);
  },
});
