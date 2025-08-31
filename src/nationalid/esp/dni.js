const MAGIC_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Validate Spain Documento Nacional de Identidad (DNI).
 * @param {string} idNumber - The national ID number to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validate(idNumber) {
  const match = idNumber.match(/^(\d{8})([A-Z])$/);
  if (!match) {
    return false;
  }
  const [, digits, letter] = match;
  const index = parseInt(digits, 10) % 23;
  return MAGIC_LETTERS[index] === letter;
}
