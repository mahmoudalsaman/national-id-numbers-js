import { validateRegexp } from '../util.js';

const REGEXP = /^\d{10}$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'JO',
    min_length: 10,
    max_length: 10,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National Number', 'الرقم الوطني'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Jordan'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}
