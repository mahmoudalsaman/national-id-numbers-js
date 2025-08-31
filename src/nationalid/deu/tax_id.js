import { aliasOf, validateRegexp, mnModulusDigit, modulusOverflowMod10 } from '../util.js';

const REGEXP = /^\d{2} ?\d{3} ?\d{3} ?\d{3}$/;

function normalize(idNumber) {
  return idNumber.replace(/ /g, '');
}

export class TaxID {
  static METADATA = {
    iso3166_alpha2: 'DE',
    min_length: 11,
    max_length: 11,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: [
      'Tax ID',
      'Steuerliche Identifikationsnummer',
      'Persönliche Identificationsnummer',
      'Identifikationsnummer',
      'Steuer-IdNr.',
      'IdNr',
      'Steuer-ID',
    ],
    links: ['https://allaboutberlin.com/guides/german-tax-id-steuernummer'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    if (!this.checkMultipleOccurrence(idNumber)) {
      return false;
    }
    if (!this.checkConsecutivePosition(idNumber)) {
      return false;
    }
    return this.checksum(idNumber);
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const numbers = normalize(idNumber).split('').map((c) => Number(c));
    const check = numbers.pop();
    return check === this.getCheckdigit(numbers);
  }

  static getCheckdigit(numbers) {
    return modulusOverflowMod10(mnModulusDigit(numbers, 10, 11));
  }

  static checkMultipleOccurrence(idNumber) {
    const normalized = normalize(idNumber).slice(0, -1).split('').sort();
    let firstMultiple = null;
    for (let i = 1; i < normalized.length; i++) {
      const digit = normalized[i];
      if (!firstMultiple && digit === normalized[i - 1]) {
        firstMultiple = digit;
      } else if (digit === normalized[i - 1] && digit !== firstMultiple) {
        return false;
      }
    }
    return true;
  }

  static checkConsecutivePosition(idNumber) {
    const normalized = normalize(idNumber).split('');
    for (let i = 0; i < normalized.length - 2; i++) {
      if (
        normalized[i] === normalized[i + 1] &&
        normalized[i] === normalized[i + 2]
      ) {
        return false;
      }
    }
    return true;
  }
}

export const NationalID = aliasOf(TaxID);
export const IdNr = aliasOf(TaxID);
