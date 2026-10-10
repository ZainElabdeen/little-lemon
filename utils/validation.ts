const ALLOWED_CHARACTERS = /^[0-9+()\-.\s]*$/;

export const isValidUSPhoneNumber = (value: string): boolean => {
  if (!value || !ALLOWED_CHARACTERS.test(value)) {
    return false;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return true;
  }

  return digits.length === 11 && digits.startsWith("1");
};
