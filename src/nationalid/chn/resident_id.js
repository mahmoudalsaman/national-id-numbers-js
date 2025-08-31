import { Gender } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<address_code>\d{6})(?<yyyy>\d{4})(?<mm>0[1-9]|1[0-2])(?<dd>0[1-9]|[12][0-9]|3[01])(?<sn>\d{3})(?<checksum>(\d|X))$/;

function normalize(idNumber) {
  return idNumber ? idNumber.toUpperCase() : null;
}

export class ResidentID {
  static METADATA = {
    iso3166_alpha2: 'CN',
    min_length: 18,
    max_length: 18,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: [
      'Resident Identity Number',
      '居民身份证',
      'Jūmín Shēnfènzhèng',
    ],
    links: [
      'https://en.wikipedia.org/wiki/Resident_Identity_Card',
      'https://en.wikipedia.org/wiki/National_identification_number#China',
    ],
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
    const checksum = this.checksum(idNumber);
    if (checksum === null || String(checksum) !== match.groups.checksum) {
      return null;
    }
    const yyyy = Number(match.groups.yyyy);
    const mm = Number(match.groups.mm);
    const dd = Number(match.groups.dd);
    const sn = match.groups.sn;
    const dateObj = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (
      dateObj.getUTCFullYear() !== yyyy ||
      dateObj.getUTCMonth() + 1 !== mm ||
      dateObj.getUTCDate() !== dd
    ) {
      return null;
    }
    return {
      address_code: match.groups.address_code,
      yyyymmdd: dateObj,
      sn,
      gender: Number(sn) % 2 === 0 ? Gender.FEMALE : Gender.MALE,
      checksum,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const normalized = normalize(idNumber);
    const digits = normalized
      .slice(0, -1)
      .split('')
      .map((c) => Number(c));
    let total = 0;
    for (let i = 0; i < digits.length; i++) {
      total += digits[i] * (Math.pow(2, 17 - i) % 11);
    }
    const checksum = (12 - (total % 11)) % 11;
    return checksum === 10 ? 'X' : checksum;
  }
}

export const NationalID = aliasOf(ResidentID);
