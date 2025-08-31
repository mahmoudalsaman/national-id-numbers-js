import { Citizenship } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<yy>\d{2})(?<mm>\d{2})(?<dd>\d{2})-?(?<pb>\d{2})-?(?<sn>\d{4})$/;
const WRONG_PB_CODE = ['00','17','18','19','20','69','70','73','80','81','94','95','96','97'];

export class NRIC {
  static METADATA = {
    iso3166_alpha2: 'MY',
    min_length: 12,
    max_length: 12,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National Registration Identity Card Number', 'NRIC'],
    links: [
      'https://en.wikipedia.org/wiki/Malaysian_identity_card#Structure_of_the_National_Registration_Identity_Card_Number_(NRIC)'
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
    const yy = Number(match.groups.yy);
    const mm = Number(match.groups.mm);
    const dd = Number(match.groups.dd);
    const location = match.groups.pb;
    if (WRONG_PB_CODE.includes(location)) {
      return null;
    }
    const sn = match.groups.sn;
    const yyyyBase = Number(sn[0]) > 4 ? 1900 : 2000;
    try {
      const dateObj = new Date(Date.UTC(yyyyBase + yy, mm - 1, dd));
      if (
        dateObj.getUTCFullYear() !== yyyyBase + yy ||
        dateObj.getUTCMonth() + 1 !== mm ||
        dateObj.getUTCDate() !== dd
      ) {
        return null;
      }
      return {
        yyyymmdd: dateObj,
        location,
        citizenship: Number(location) < 60 ? Citizenship.CITIZEN : Citizenship.RESIDENT,
        sn,
      };
    } catch {
      return null;
    }
  }
}

export const NationalID = aliasOf(NRIC);
