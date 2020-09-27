const index = require("./index");

test("adds 1 + 2 to equals 3", () => {
  expect(index(1, 2)).toBe(3);
});
