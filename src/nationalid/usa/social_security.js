import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;

export class SocialSecurityNumber {
  static METADATA = {
    iso3166_alpha2: 'US',
    min_length: 9,
    max_length: 9,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['Social Security number', 'SSN'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#United_States'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}

export const NationalID = aliasOf(SocialSecurityNumber);
