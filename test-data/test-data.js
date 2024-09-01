const itemsToBuy = [
  {
    title: "Frankie Sweatshirt",
    size: "XS",
    colour: "Green",
    quantity: "2",
    scenario: 1,
  },

  {
    title: "Karmen Yoga Pant",
    size: "29",
    colour: "Black",
    quantity: "1",
    scenario: 2,
  },
  {
    title: "Ida Workout Parachute Pant",
    size: "28",
    colour: "Blue",
    quantity: "1",
    scenario: 2,
  },
  {
    title: "Carina Basic Capri",
    size: "28",
    colour: "Purple",
    quantity: "1",
    scenario: 2,
  },
];
exports.itemsToBuy = itemsToBuy;

exports.itemsInScenario2 = itemsToBuy
  .filter((item) => item.scenario === 2)
  .reduce((accumulator, item) => accumulator + Number(item.quantity), 0)
  .toString();

exports.shopper = {
  email: "florida.man@email.com",
  firstName: "John",
  lastName: "Doe",
  streetAdrress: "1234 Collins Rd #4321",
  city: "Jacksonville",
  state: "Florida",
  zip: "123456",
  country: "United States",
  phone: "(111) 111-1111",
};
