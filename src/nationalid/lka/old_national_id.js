import { Citizenship } from '../constant.js';
import { NationalID } from './national_id.js';
import { validateRegexp } from '../util.js';

const REGEXP = /^(?<year>\d{2})(?<days>\d{3})(?<sn>\d{3})(?<checksum>\d)(?<citizenship>[XxVv])$/;

export class OldNationalID {
  static METADATA = {
    iso3166_alpha2: 'LK',
    min_length: 10,
    max_length: 10,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Sri_Lanka',
      'https://drp.gov.lk/Templates/Artical%20-%20English%20new%20number.html',
    ],
    deprecated: true,
  };

  static toNew(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return null;
    }
    const { year, days, sn, checksum } = match.groups;
    return `19${year}${days}0${sn}${checksum}`;
  }

  static validate(idNumber) {
    if (!idNumber || typeof idNumber !== 'string') {
      return false;
    }
    return this.parse(idNumber) !== null;
  }

  static parse(idNumber) {
    const newId = this.toNew(idNumber);
    if (!newId) {
      return null;
    }
    const result = NationalID.parse(newId);
    if (!result) {
      return null;
    }
    const citizenship =
      idNumber.slice(-1).toUpperCase() === 'V'
        ? Citizenship.CITIZEN
        : Citizenship.RESIDENT;
    return { ...result, citizenship };
  }

  static checksum(idNumber) {
    const newId = this.toNew(idNumber);
    if (!newId) {
      return false;
    }
    return NationalID.checksum(newId);
  }
}
