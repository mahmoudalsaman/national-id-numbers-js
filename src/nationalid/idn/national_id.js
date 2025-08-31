import { Gender } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<district>\d{6})(?<dd>[0-7]\d)(?<mm>(0[1-9]|1[012]))(?<yy>\d{2})(?!0000)\d{4}$/;
const DISTRICT = ['710510'];

export class NIK {
  static METADATA = {
    iso3166_alpha2: 'ID',
    min_length: 16,
    max_length: 16,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['ID Number', 'NIK', 'Nomor Induk Kependudukan'],
    links: ['https://en.wikipedia.org/wiki/National_identification_number#Indonesia'],
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
    const district = match.groups.district;
    if (!DISTRICT.includes(district)) {
      return null;
    }
    const gender = Number(match.groups.dd[0]) <= 3 ? Gender.FEMALE : Gender.MALE;
    const yy = match.groups.yy;
    const mm = match.groups.mm;
    const ddVal = gender === Gender.FEMALE ? match.groups.dd : String(Number(match.groups.dd) - 30).padStart(2, '0');
    try {
      const yyyy = Number(`20${yy}`);
      const dateObj = new Date(Date.UTC(yyyy, Number(mm) - 1, Number(ddVal)));
      if (
        dateObj.getUTCMonth() + 1 !== Number(mm) ||
        dateObj.getUTCDate() !== Number(ddVal)
      ) {
        return null;
      }
    } catch {
      return null;
    }
    return {
      gender,
      yy,
      mm,
      dd: String(ddVal).padStart(2, '0'),
      district,
    };
  }
}

export const NationalID = aliasOf(NIK);
