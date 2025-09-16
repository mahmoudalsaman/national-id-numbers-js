import { validateRegexp } from '../util.js';

const REGEXP = /^\d{8,9}$/;

const WEIGHTS = [1, 4, 3, 7, 5, 8, 6, 9, 10];

export class TaxFileNumber {
  static METADATA = {
    iso3166_alpha2: 'AU',
    min_length: 8,
    max_length: 9,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Tax File Number', 'TFN'],
    links: ['https://en.wikipedia.org/wiki/Tax_file_number'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }

    const digits = idNumber.split('').map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * WEIGHTS[i];
    }

    return sum % 11 === 0;
  }
}