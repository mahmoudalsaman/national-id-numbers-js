import { Gender } from '../constant.js';
import { validateRegexp, luhnDigit, aliasOf } from '../util.js';

const REGEXP = /^(\d{3})-(\d{3})-(\d{3})$/;

export class SocialInsuranceNumber {
  static METADATA = {
    iso3166_alpha2: 'CA',
    min_length: 9,
    max_length: 9,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Social Insurance Number', 'SIN', 'Numéro d\'assurance sociale', 'NAS'],
    links: ['https://en.wikipedia.org/wiki/Social_Insurance_Number'],
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

    const digits = idNumber.replace(/\D/g, '');
    
    // Check for invalid sequences (all zeros, all ones, etc.)
    if (/^(\d)\1{8}$/.test(digits)) {
      return null;
    }

    // Check for invalid first digits (000, 666, 900-999)
    const firstThree = digits.substring(0, 3);
    if (firstThree === '000' || firstThree === '666' || /^9\d{2}$/.test(firstThree)) {
      return null;
    }

    // Validate checksum using Luhn algorithm
    if (!this.checksum(idNumber)) {
      return null;
    }

    return {
      area: match[1],
      group: match[2],
      serial: match[3],
      gender: Gender.UNKNOWN, // SIN doesn't encode gender
    };
  }

  static checksum(idNumber) {
    const digits = idNumber.replace(/\D/g, '');
    
    if (digits.length !== 9) {
      return false;
    }

    // Check for invalid sequences
    if (/^(\d)\1{8}$/.test(digits)) {
      return false;
    }

    // Check for invalid first digits
    const firstThree = digits.substring(0, 3);
    if (firstThree === '000' || firstThree === '666' || /^9\d{2}$/.test(firstThree)) {
      return false;
    }

    // Apply Luhn algorithm
    const digitsArray = digits.split('').map(d => parseInt(d));
    return luhnDigit(digitsArray) === 0;
  }
}

export const NationalID = aliasOf(SocialInsuranceNumber);
