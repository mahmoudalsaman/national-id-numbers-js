import { validateRegexp } from '../util.js';

const REGEXP = /^\d{11}$/;

export class OIB {
  static METADATA = {
    iso3166_alpha2: 'HR',
    min_length: 11,
    max_length: 11,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Osobni identifikacijski broj', 'OIB', 'Personal Identification Number'],
    links: ['https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }

    let a = 10;
    for (let i = 0; i < 10; i++) {
      a = a + parseInt(idNumber[i]);
      a = a % 10;
      if (a === 0) {
        a = 10;
      }
      a *= 2;
      a = a % 11;
    }

    let checkDigit = 11 - a;
    if (checkDigit === 10) {
      checkDigit = 0;
    }

    return checkDigit === parseInt(idNumber[10]);
  }
}