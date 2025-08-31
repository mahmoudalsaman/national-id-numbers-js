import { Gender } from '../constant.js';
import { luhnDigit, validateRegexp } from '../util.js';

const REGEXP = /^(?<century>[23])(?<yy>\d{2})(?<mm>\d{2})(?<dd>\d{2})(?<gov>\d{2})(?<sn>\d{4})(?<checksum>\d)$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'EG',
    min_length: 14,
    max_length: 14,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'الرقم القومي'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Egypt'],
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
    const century = match.groups.century;
    const yy = Number(match.groups.yy);
    const mm = Number(match.groups.mm);
    const dd = Number(match.groups.dd);
    const yyyy = (century === '2' ? 1900 : 2000) + yy;
    const dateObj = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (
      dateObj.getUTCFullYear() !== yyyy ||
      dateObj.getUTCMonth() + 1 !== mm ||
      dateObj.getUTCDate() !== dd
    ) {
      return null;
    }
    const sn = match.groups.sn;
    const checksum = this.checksum(idNumber);
    if (checksum === null || checksum !== Number(match.groups.checksum)) {
      return null;
    }
    return {
      yyyymmdd: dateObj,
      governorate: match.groups.gov,
      sn,
      gender: Number(sn[3]) % 2 === 1 ? Gender.MALE : Gender.FEMALE,
      checksum,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const digits = idNumber
      .slice(0, -1)
      .split('')
      .map((d) => Number(d));
    return luhnDigit(digits);
  }
}
