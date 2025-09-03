import { validateRegexp } from '../util.js';

const REGEXP = /^\d{4}-?\d{4}-?\d{5}$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'AF',
    min_length: 13,
    max_length: 13,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'Tazkira', '\u062a\u0630\u06a9\u0631\u0647'],
    links: ['https://en.wikipedia.org/wiki/Afghan_identity_card'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}
