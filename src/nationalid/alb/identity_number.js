import { Gender } from '../constant.js';
import { aliasOf } from '../util.js';

const BASE_YEAR_MAP = '0123456789ABCDEFGHIJKLMNOPQRST';
const REGEXP = /^(?<yy>[0-9A-T]\d)(?<mm>\d{2})(?<dd>\d{2})(?<sn>\d{3})[ -]?(?<checksum>[A-W])$/;

export class IdentityNumber {
  static METADATA = {
    iso3166_alpha2: 'AL',
    min_length: 10,
    max_length: 10,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: [
      'Albania Identity Number',
      'Numri i Identitetit',
      'NID',
      'Numri i Identitetit të Shtetasit',
      'NISH',
      'NIPT',
    ],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Albania'],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!idNumber || typeof idNumber !== 'string') {
      return false;
    }
    return this.parse(idNumber) !== null;
  }

  static parse(idNumber) {
    const match = idNumber.match(REGEXP);
    if (!match) {
      return null;
    }
    const yy = match.groups.yy;
    const mm = Number(match.groups.mm);
    const dd = Number(match.groups.dd);
    const yyyy = this.getYear(yy);
    const month = mm < 50 ? mm : mm - 50;
    const gender = mm < 50 ? Gender.MALE : Gender.FEMALE;

    const dateObj = new Date(Date.UTC(yyyy, month - 1, dd));
    if (
      dateObj.getUTCFullYear() !== yyyy ||
      dateObj.getUTCMonth() + 1 !== month ||
      dateObj.getUTCDate() !== dd
    ) {
      return null;
    }
    return {
      yyyymmdd: dateObj,
      gender,
      sn: match.groups.sn,
      checksum: match.groups.checksum,
    };
  }

  static getYear(yy) {
    const base = 1800 + BASE_YEAR_MAP.indexOf(yy[0]) * 10;
    return base + Number(yy[1]);
  }
}

export const NationalID = aliasOf(IdentityNumber);
export const NISH = aliasOf(IdentityNumber);
export const NIPT = aliasOf(IdentityNumber);
export const NID = aliasOf(IdentityNumber);
