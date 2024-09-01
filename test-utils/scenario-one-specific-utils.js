exports.pickQualitiesFromDetailsPage = async (page, data) => {
  const size = await page.getByLabel(data.size);
  await size.click();
  const colour = await page.getByLabel(data.colour);
  await colour.click();
  const quantity = await page.getByLabel("Qty");
  await quantity.fill(data.quantity);
};

exports.addToCart = async (page) => {
  await page.getByRole("button", { name: "Add to Cart" }).click();
};
