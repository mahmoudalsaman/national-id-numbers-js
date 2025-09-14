import { Gender } from '../constant.js';
import { validateRegexp } from '../util.js';

const REGEXP = /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'BR',
    min_length: 11,
    max_length: 11,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['CPF', 'Cadastro de Pessoas Físicas'],
    links: ['https://en.wikipedia.org/wiki/CPF_number'],
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
    
    // Check for invalid sequences
    if (/^(\d)\1{10}$/.test(digits)) {
      return null;
    }

    // Validate checksum
    if (!this.checksum(idNumber)) {
      return null;
    }

    return {
      region: match[1],
      sequence: match[2],
      check_digits: match[4],
      gender: Gender.UNKNOWN, // CPF doesn't encode gender
    };
  }

  static checksum(idNumber) {
    const digits = idNumber.replace(/\D/g, '');
    
    if (digits.length !== 11) {
      return false;
    }

    // Check for invalid sequences
    if (/^(\d)\1{10}$/.test(digits)) {
      return false;
    }

    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * (10 - i);
    }
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10) firstCheck = 0;

    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits[i]) * (11 - i);
    }
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10) secondCheck = 0;

    return firstCheck === parseInt(digits[9]) && secondCheck === parseInt(digits[10]);
  }
}
