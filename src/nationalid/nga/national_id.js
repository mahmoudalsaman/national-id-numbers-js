import { validateRegexp } from '../util.js';

const REGEXP = /^\d{11}$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'NG',
    min_length: 11,
    max_length: 11,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National Identification Number', 'NIN'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Nigeria'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}
