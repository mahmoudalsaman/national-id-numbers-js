import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(\d{4}[ -]?\d{7}[ -]?\d)$/;

export class PhilID {
  static METADATA = {
    iso3166_alpha2: 'PH',
    min_length: 12,
    max_length: 12,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['PhilID Card Number', 'PCN', 'PhilSys'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Philippines',
      'https://en.wikipedia.org/wiki/Philippine_national_identity_card',
    ],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}

export const NationalID = aliasOf(PhilID);
