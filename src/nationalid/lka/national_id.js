import { Gender } from '../constant.js';
import { validateRegexp, weightedModulusDigit, modulusOverflowMod10 } from '../util.js';

const REGEXP = /^(?<year>\d{4})(?<days>\d{3})(?<sn>\d{4})(?<checksum>\d)$/;
const MAGIC_MULTIPLIER = [8, 4, 3, 2, 7, 6, 5, 7, 4, 3, 2];

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'LK',
    min_length: 12,
    max_length: 12,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Sri_Lanka',
      'https://drp.gov.lk/Templates/Artical%20-%20English%20new%20number.html',
    ],
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
    const year = Number(match.groups.year);
    const days = Number(match.groups.days);
    const sn = match.groups.sn;
    if (!this.checksum(idNumber)) {
      return null;
    }
    try {
      const dateObj = new Date(Date.UTC(year, 0, 1));
      dateObj.setUTCDate(dateObj.getUTCDate() + (days > 500 ? days - 501 : days - 1));
      return {
        yyyymmdd: dateObj,
        gender: days < 500 ? Gender.MALE : Gender.FEMALE,
        sn,
        checksum: Number(match.groups.checksum),
      };
    } catch {
      return null;
    }
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const numbers = idNumber.split('').map((c) => Number(c));
    const modulus = modulusOverflowMod10(
      weightedModulusDigit(numbers.slice(0, -1), MAGIC_MULTIPLIER, 11)
    );
    return modulus === numbers[numbers.length - 1];
  }
}
