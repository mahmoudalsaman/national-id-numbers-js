import { validateRegexp, weightedModulusDigit } from '../util.js';

const REGEXP = /^[1-9]\d{10}$/;
const MULTIPLIERS = [7, -1, 7, -1, 7, -1, 7, -1, 7];

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'TR',
    min_length: 11,
    max_length: 11,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: [
      'National ID Number',
      'Türkiye Cumhuriyeti Kimlik Numarası',
      'T.C. Kimlik No.',
    ],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Turkey'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    return this.checksum(idNumber) === idNumber.slice(-2);
  }

  static checksum(idNumber) {
    const numbers = idNumber.split('').map((c) => Number(c));
    const digitTen = weightedModulusDigit(numbers.slice(0, -2), MULTIPLIERS, 10, true);
    const digitEleven = numbers.slice(0, -1).reduce((a, b) => a + b, 0) % 10;
    return `${digitTen}${digitEleven}`;
  }
}
