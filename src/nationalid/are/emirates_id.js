import { aliasOf } from '../util.js';
import { luhnDigit, validateRegexp } from '../util.js';

const REGEXP = /^784[ -]?(?<yyyy>\d{4})[ -]?(?<sn>\d{7})[ -]?(?<checksum>\d)$/;

export class EmiratesIDNumber {
  static METADATA = {
    iso3166_alpha2: 'AE',
    min_length: 15,
    max_length: 15,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Emirates ID', 'Resident ID', 'رقم الهوية'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#United_Arab_Emirates'],
    deprecated: false,
  };

  static normalize(idNumber) {
    return idNumber.replace(/[ \-/]/g, '');
  }

  static validate(idNumber) {
    if (!idNumber || typeof idNumber !== 'string') {
      return false;
    }
    return this.parse(idNumber) !== null;
  }

  static parse(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return null;
    }
    const checksum = this.checksum(idNumber);
    if (checksum === null || checksum !== Number(match.groups.checksum)) {
      return null;
    }
    return {
      yyyy: Number(match.groups.yyyy),
      sn: match.groups.sn,
      checksum,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const digits = this.normalize(idNumber)
      .split('')
      .map((d) => Number(d));
    return luhnDigit(digits.slice(0, -1));
  }
}

export const NationalID = aliasOf(EmiratesIDNumber);
