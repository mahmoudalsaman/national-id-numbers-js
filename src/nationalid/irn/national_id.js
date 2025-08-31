import { validateRegexp, weightedModulusDigit } from '../util.js';

const REGEXP = /^\d{3}-?\d{6}-?\d$/;
const MULTIPLIER = [10, 9, 8, 7, 6, 5, 4, 3, 2];

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'IR',
    min_length: 10,
    max_length: 10,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'kart-e-meli', 'کارت ملی'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Iran,_Islamic_Republic_of',
    ],
    deprecated: false,
  };

  static normalize(idNumber) {
    return idNumber.replace(/-/g, '');
  }

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const normalized = this.normalize(idNumber);
    const checksum = this.checksum(idNumber);
    return checksum !== null && checksum === Number(normalized.slice(-1));
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const digits = this.normalize(idNumber)
      .split('')
      .map((d) => Number(d));
    const modulus = weightedModulusDigit(
      digits.slice(0, -1),
      MULTIPLIER,
      11,
      true,
    );
    return modulus < 2 ? modulus : 11 - modulus;
  }
}
