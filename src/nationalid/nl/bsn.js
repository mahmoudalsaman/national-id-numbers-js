import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{9})$/;

export class BSN {
  static METADATA = {
    iso3166_alpha2: 'NL',
    min_length: 9,
    max_length: 9,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['BSN', 'Burgerservicenummer', 'Dutch Social Security Number'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Netherlands'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    return this.parse(idNumber) !== null;
  }

  static parse(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return null;
    }

    // Validate checksum
    if (!this.checksum(idNumber)) {
      return null;
    }

    return {
      number: idNumber,
      gender: Gender.UNKNOWN, // BSN doesn't encode gender
    };
  }

  static checksum(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return false;
    }

    // Apply Dutch BSN checksum algorithm (Modulo 11)
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 9) {
      return false;
    }

    // Modulo 11 algorithm for Dutch BSN
    const weights = [9, 8, 7, 6, 5, 4, 3, 2, -1];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    return sum % 11 === 0;
  }
}

export const NationalID = aliasOf(BSN);
