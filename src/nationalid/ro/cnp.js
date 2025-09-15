import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{13})$/;

export class CNP {
  static METADATA = {
    iso3166_alpha2: 'RO',
    min_length: 13,
    max_length: 13,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['CNP', 'Cod Numeric Personal', 'Romanian Personal Numeric Code'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Romania'],
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

    const digits = idNumber;
    
    // Extract birth date and gender from CNP
    const year = parseInt(digits.slice(1, 3));
    const month = parseInt(digits.slice(3, 5));
    const day = parseInt(digits.slice(5, 7));
    const genderDigit = parseInt(digits[0]);
    
    // Determine century based on gender digit
    let century = 1900;
    if (genderDigit >= 5 && genderDigit <= 6) {
      century = 2000;
    } else if (genderDigit >= 7 && genderDigit <= 8) {
      century = 1800;
    }
    
    const actualYear = century + year;
    const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Determine gender based on first digit
    const gender = (genderDigit === 1 || genderDigit === 3 || genderDigit === 5 || genderDigit === 7) ? Gender.MALE : Gender.FEMALE;

    return {
      number: idNumber,
      gender: gender,
      birthDate: birthDate,
      year: actualYear,
      month: month,
      day: day,
    };
  }

  static checksum(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return false;
    }

    // Apply Romanian CNP checksum algorithm (Modulo 11)
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 13) {
      return false;
    }

    // Modulo 11 algorithm for Romanian CNP
    const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return checkDigit === parseInt(digits[12]);
  }
}

export const NationalID = aliasOf(CNP);
