import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, luhnDigit } from '../util.js';

const REGEXP = /^(\d{12})$/;

export class CIN {
  static METADATA = {
    iso3166_alpha2: 'DZ',
    min_length: 12,
    max_length: 12,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['CIN', 'Carte d\'Identité Nationale', 'Algerian National ID'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Algeria'],
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
    
    // Extract birth date and gender from CIN
    const year = parseInt(digits.slice(0, 2));
    const month = parseInt(digits.slice(2, 4));
    const day = parseInt(digits.slice(4, 6));
    
    // Determine century based on year range
    let century = 2000;
    if (year >= 0 && year <= 30) {
      century = 2000;
    } else if (year >= 31 && year <= 99) {
      century = 1900;
    }
    
    const actualYear = century + year;
    const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Determine gender based on last digit of serial number
    const serialNumber = parseInt(digits.slice(6, 11));
    const gender = (serialNumber % 2 === 0) ? Gender.FEMALE : Gender.MALE;
    
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

    // Apply Luhn algorithm for Algerian CIN
    const digits = idNumber.replace(/\D/g, '');
    if (digits.length !== 12) {
      return false;
    }

    // Calculate Luhn check digit
    const workingDigits = digits.slice(0, 11).split('').map(d => parseInt(d));
    const checkDigit = luhnDigit(workingDigits);
    return checkDigit === parseInt(digits[11]);
  }
}

export const NationalID = aliasOf(CIN);
