import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{6})(\d{5})$/;

export class Fodselsnummer {
  static METADATA = {
    iso3166_alpha2: 'NO',
    min_length: 11,
    max_length: 11,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Fødselsnummer', 'Norwegian Personal Number', 'Birth Number'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Norway'],
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

    const birthDate = match[1];
    const individualNumber = match[2];
    
    // Extract gender from individual number (3rd digit)
    const genderDigit = parseInt(individualNumber[2]);
    const gender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;

    return {
      number: birthDate + individualNumber,
      gender: gender,
      birthDate: birthDate,
      individualNumber: individualNumber,
    };
  }

  static checksum(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return false;
    }

    // Apply Norwegian Fødselsnummer checksum algorithm (Modulo 11)
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 11) {
      return false;
    }

    // Modulo 11 algorithm for Norwegian Fødselsnummer
    const weights = [3, 7, 6, 1, 8, 9, 4, 5, 2];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : 11 - remainder;
    
    // Handle special case where check digit should be 0
    if (checkDigit === 11) {
      return parseInt(digits[9]) === 0;
    }
    
    return checkDigit === parseInt(digits[9]);
  }
}

export const NationalID = aliasOf(Fodselsnummer);
