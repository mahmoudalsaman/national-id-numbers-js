import { aliasOf } from '../util.js';
import { validateRegexp, verhoeffCheck } from '../util.js';

const REGEXP = /^[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}$/;

function normalize(idNumber) {
  return idNumber.replace(/[ -]/g, '');
}

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'IN',
    min_length: 12,
    max_length: 12,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'Unique Identification Number', 'UID'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#India',
      'https://archive.org/details/Aadhaar_numbering_scheme/page/n12/mode/1up?view=theater',
    ],
    deprecated: false,
  };

  static validate(idNumber) {
    return this.checksum(idNumber);
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const digits = normalize(idNumber)
      .split('')
      .map((d) => Number(d));
    return verhoeffCheck(digits);
  }
}

export const UID = aliasOf(NationalID);
