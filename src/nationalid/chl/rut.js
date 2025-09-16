import { validateRegexp } from '../util.js';

const REGEXP = /^(\d{1,3})\.?(\d{3})\.?(\d{3})-?([\dkK])$/;

export class RUT {
  static METADATA = {
    iso3166_alpha2: 'CL',
    min_length: 8,
    max_length: 12,
    parsable: false,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Rol Único Tributario', 'RUT', 'RUN'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Chile'],
    deprecated: false,
  };

  static validate(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return false;
    }

    const rut = match[1] + match[2] + match[3];
    const checkDigit = match[4].toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      sum += parseInt(rut[i]) * multiplier;
      multiplier++;
      if (multiplier > 7) {
        multiplier = 2;
      }
    }

    const remainder = 11 - (sum % 11);
    let expectedCheck;

    if (remainder === 11) {
      expectedCheck = '0';
    } else if (remainder === 10) {
      expectedCheck = 'K';
    } else {
      expectedCheck = remainder.toString();
    }

    return checkDigit === expectedCheck;
  }
}