import { validateRegexp } from '../util.js';

const REGEXP = /^\d{6,10}$/;

export class Cedula {
  static METADATA = {
    iso3166_alpha2: 'CO',
    min_length: 6,
    max_length: 10,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['Cédula de Ciudadanía', 'CC'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Colombia'],
    deprecated: false,
  };

  static validate(idNumber) {
    return validateRegexp(idNumber, REGEXP);
  }
}