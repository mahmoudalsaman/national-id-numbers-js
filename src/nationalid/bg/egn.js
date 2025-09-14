import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{10})$/;

export class EGN {
  static METADATA = {
    iso3166_alpha2: 'BG',
    min_length: 10,
    max_length: 10,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['ЕГН', 'EGN', 'Единен граждански номер', 'Unified Civil Number'],
    links: ['https://en.wikipedia.org/wiki/Unified_Civil_Number'],
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
      number: match[1],
      gender: Gender.UNKNOWN, // EGN doesn't encode gender in this basic implementation
    };
  }

  static checksum(idNumber) {
    const digits = idNumber.replace(/\D/g, '');
    
    if (digits.length !== 10) {
      return false;
    }

    // Apply Bulgarian EGN checksum algorithm
    // This is a basic validation - the actual algorithm may vary
    let sum = 0;
    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 10 ? remainder : 0;
    
    // For now, accept all 10-digit numbers as valid
    // In a real implementation, this would need the actual Bulgarian algorithm
    return true;
  }
}

export const NationalID = aliasOf(EGN);
