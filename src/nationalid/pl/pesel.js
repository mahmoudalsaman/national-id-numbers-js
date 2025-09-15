import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{11})$/;

export class PESEL {
  static METADATA = {
    iso3166_alpha2: 'PL',
    min_length: 11,
    max_length: 11,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['PESEL', 'Polish National Identification Number', 'Universal Electronic System for Registration of Population'],
    links: ['https://en.wikipedia.org/wiki/PESEL'],
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
    
    // Extract birth date and gender from PESEL
    const year = parseInt(digits.slice(0, 2));
    const month = parseInt(digits.slice(2, 4));
    const day = parseInt(digits.slice(4, 6));
    const genderDigit = parseInt(digits[9]);
    
    // Determine century based on month
    let century = 1900;
    if (month >= 81 && month <= 92) {
      century = 1800;
      month -= 80;
    } else if (month >= 21 && month <= 32) {
      century = 2000;
      month -= 20;
    } else if (month >= 41 && month <= 52) {
      century = 2100;
      month -= 40;
    } else if (month >= 61 && month <= 72) {
      century = 2200;
      month -= 60;
    }
    
    const fullYear = century + year;
    const birthDate = `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Determine gender based on 10th digit
    const gender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;

    return {
      number: idNumber,
      gender: gender,
      birthDate: birthDate,
      year: fullYear,
      month: month,
      day: day,
    };
  }

  static checksum(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return false;
    }

    // Apply Polish PESEL checksum algorithm (Modulo 10)
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 11) {
      return false;
    }

    // Modulo 10 algorithm for Polish PESEL
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    
    const remainder = sum % 10;
    const checkDigit = remainder === 0 ? 0 : 10 - remainder;
    
    return checkDigit === parseInt(digits[10]);
  }
}

export const NationalID = aliasOf(PESEL);
