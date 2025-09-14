import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, luhnDigit } from '../util.js';

const REGEXP = /^(\d{6})[+-](\d{4})$/;

export class Personnummer {
  static METADATA = {
    iso3166_alpha2: 'SE',
    min_length: 11,
    max_length: 11,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Personnummer', 'Swedish Personal Number', 'Personal Identity Number'],
    links: ['https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)'],
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

    // Apply Swedish Personnummer checksum algorithm (Luhn)
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      return false;
    }

    // Use Luhn algorithm for Swedish Personnummer
    const workingDigits = digits.slice(0, 9).split('').map(d => parseInt(d));
    const checkDigit = luhnDigit(workingDigits);
    return checkDigit === parseInt(digits[9]);
  }
}

export const NationalID = aliasOf(Personnummer);
