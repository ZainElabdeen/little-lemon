import { isValidUSPhoneNumber } from "./validation";

describe("isValidUSPhoneNumber", () => {
  test("accepts ten digits with no separators", () => {
    expect(isValidUSPhoneNumber("5551234567")).toBe(true);
  });

  test("accepts hyphenated numbers", () => {
    expect(isValidUSPhoneNumber("555-123-4567")).toBe(true);
  });

  test("accepts parenthesised area codes", () => {
    expect(isValidUSPhoneNumber("(555) 123-4567")).toBe(true);
  });

  test("accepts a leading country code 1", () => {
    expect(isValidUSPhoneNumber("1-555-123-4567")).toBe(true);
    expect(isValidUSPhoneNumber("+1 555 123 4567")).toBe(true);
  });

  test("rejects too few digits", () => {
    expect(isValidUSPhoneNumber("555-1234")).toBe(false);
  });

  test("rejects too many digits", () => {
    expect(isValidUSPhoneNumber("555-123-45678")).toBe(false);
  });

  test("rejects non-numeric input", () => {
    expect(isValidUSPhoneNumber("abc")).toBe(false);
  });

  test("rejects letters mixed into a digit string", () => {
    expect(isValidUSPhoneNumber("555abc1234567")).toBe(false);
  });

  test("rejects an empty string", () => {
    expect(isValidUSPhoneNumber("")).toBe(false);
  });
});
