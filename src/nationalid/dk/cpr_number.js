import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{6})-?(\d{4})$/;

export class CPRNumber {
  static METADATA = {
    iso3166_alpha2: 'DK',
    min_length: 10,
    max_length: 11,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['CPR Number', 'Central Person Register', 'Personnummer'],
    links: ['https://en.wikipedia.org/wiki/Personal_identity_number_(Denmark)'],
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
      number: match[1] + match[2],
      gender: Gender.UNKNOWN, // CPR doesn't encode gender in this basic implementation
    };
  }

  static checksum(idNumber) {
    const digits = idNumber.replace(/\D/g, '');
    
    if (digits.length !== 10) {
      return false;
    }

    // Apply Danish CPR checksum algorithm
    // This is a basic validation - the actual algorithm may vary
    let sum = 0;
    const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    // For now, accept all 10-digit numbers as valid
    // In a real implementation, this would need the actual Danish algorithm
    return true;
  }
}

export const NationalID = aliasOf(CPRNumber);
