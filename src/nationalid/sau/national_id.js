import { Citizenship } from '../constant.js';
import { luhnDigit, validateRegexp } from '../util.js';

const REGEXP = /^(?<type>[12])(?<sn>\d{8})(?<checksum>\d)$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'SA',
    min_length: 10,
    max_length: 10,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'Iqama', '\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Saudi_Arabia'],
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
    const checksum = this.checksum(idNumber);
    if (checksum === null || checksum !== Number(match.groups.checksum)) {
      return null;
    }
    return {
      type: match.groups.type === '1' ? Citizenship.CITIZEN : Citizenship.RESIDENT,
      sn: match.groups.sn,
      checksum,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const digits = idNumber
      .slice(0, -1)
      .split('')
      .map((d) => Number(d));
    return luhnDigit(digits);
  }
}
