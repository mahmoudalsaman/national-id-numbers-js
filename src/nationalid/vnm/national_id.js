import { Gender } from '../constant.js';

const REGEXP = /^(?<province_country_code>\d{3})(?<gender>\d)(?<yy>\d{2})(?<sn>\d{6})$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'VN',
    min_length: 12,
    max_length: 12,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'Thẻ căn cước công dân'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Vietnam',
      'https://vietnaminsider.vn/what-do-the-12-digits-on-the-citizen-id-card-with-chip-mean/',
      'https://lawnet.vn/en/vb/Circular-07-2016-TT-BCA-detailing-Law-on-Citizen-Identification-137-2015-ND-CP-5CCC3.html',
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
    const provinceCountryCode = match.groups.province_country_code;
    const centuryGender = Number(match.groups.gender);
    const yy = Number(match.groups.yy);
    const sn = match.groups.sn;
    const yyyy = 1900 + 100 * Math.floor(centuryGender / 2) + yy;
    return {
      province_country_code: provinceCountryCode,
      yyyy,
      sn,
      gender: centuryGender % 2 === 0 ? Gender.MALE : Gender.FEMALE,
    };
  }
}
