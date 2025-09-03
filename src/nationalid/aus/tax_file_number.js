import { validateRegexp, weightedModulusDigit, aliasOf } from '../util.js';

const REGEXP = /^\d{8,9}$/;
const WEIGHTS = [1, 4, 3, 7, 5, 8, 6, 9, 10];

function normalize(idNumber) {
  return idNumber.replace(/ /g, '');
}

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
    if (!validateRegexp(normalize(idNumber), REGEXP)) {
      return false;
    }
    return this.checksum(idNumber);
  }

  static checksum(idNumber) {
    const normalized = normalize(idNumber);
    if (!validateRegexp(normalized, REGEXP)) {
      return false;
    }
    const digits = normalized.padStart(9, '0').split('').map((d) => Number(d));
    const modulus = weightedModulusDigit(digits, WEIGHTS, 11, true);
    return modulus === 0;
  }
}

export const NationalID = aliasOf(TaxFileNumber);
