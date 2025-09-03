import { validateRegexp } from '../util.js';

const REGEXP = /^\d{18}$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'DZ',
    min_length: 18,
    max_length: 18,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National Identification Number', "Numéro d'identification nationale", '\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062a\u0639\u0631\u064a\u0641\u064a \u0627\u0644\u0648\u0637\u0646\u064a'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number_(Algeria)'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}
