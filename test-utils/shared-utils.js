import { expect } from "@playwright/test";

exports.verifyCountInCart = async (page, data) => {
  const expectedCount = typeof data === "object" ? data.quantity : data;
  const cart = await page
    .getByRole("link", { name: /My Cart/ })
    .locator("span.counter-number");
  await cart.waitFor();
  await expect(cart).toContainText(expectedCount);
  await page.waitForLoadState();
};

exports.goToCart = async (page) => {
  const cart = await page.getByRole("link", { name: /My Cart/ });
  await cart.waitFor();
  await cart.click();
  const viedAndEditBtn = await page.getByRole("link", {
    name: "View and Edit Cart",
  });
  await expect(viedAndEditBtn).toBeVisible();
  await viedAndEditBtn.click();
  await page.waitForURL(/cart/);
  await expect(page).toHaveTitle("Shopping Cart");
};

exports.proceedToCheckout = async (page) => {
  const cartSummary = await page.locator("div.cart-summary");
  await page.waitForLoadState("networkidle");
  const proceedBtn = await cartSummary.getByRole("button", {
    name: "Proceed to Checkout",
  });
  await expect(proceedBtn).toBeVisible();
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await page.waitForURL(/shipping/);
  await expect(page).toHaveTitle("Checkout");
  await expect(page.locator("div#checkout")).toBeVisible();
};

exports.fillInOrderForm = async (page, data) => {
  await page
    .getByRole("textbox", {
      name: "Email Address",
    })
    .fill(data.email);
  await page.getByLabel("First Name").fill(data.firstName);
  await page.getByLabel("Last Name").fill(data.lastName);
  await page.getByLabel("Street Address").nth(0).fill(data.streetAdrress);
  await page.getByLabel("City").fill(data.city);
  await page.locator('select[name="region_id"]').selectOption(data.state);
  await page.getByLabel("Zip/Postal Code").fill(data.zip);
  await page.getByLabel("Country").selectOption(data.country);
  await page.getByLabel("Phone Number").fill(data.phone);
  await page.getByLabel("Table Rate").setChecked(true);
  await page.waitForLoadState();
  await page.getByRole("button", { name: "Next" }).click();
  await page.waitForURL(/payment/);
  const paymentCheckbox = await page.getByLabel(
    "My billing and shipping address are the same"
  );
  await paymentCheckbox.waitFor();
  await paymentCheckbox.setChecked(true);
  await expect(
    page.getByLabel("My billing and shipping address are the same")
  ).toBeChecked();
};

exports.placeOrder = async (page) => {
  await page.getByRole("button", { name: "Place Order" }).click();
  await page.waitForURL(/success/);
  await expect(page).toHaveTitle("Success Page");
  await expect(page.locator("h1")).toHaveText("Thank you for your purchase!");
};
