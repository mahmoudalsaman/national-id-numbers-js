import { validateRegexp } from '../util.js';

export const ResidentialType = Object.freeze({
  RURAL: 1,
  MUNICIPALITY: 2,
  CITY: 3,
  OTHERS: 4,
  CANTONMENT: 5,
  CITY_CORPORATION: 9,
});

const REGEXP = /^(?<distinct>\d{2})(?<rmo>\d)(?<police>\d{2})(?<union>\d{2})(?<sn>\d{6})$/;
const RMO_MAP = {
  1: ResidentialType.RURAL,
  2: ResidentialType.MUNICIPALITY,
  3: ResidentialType.CITY,
  4: ResidentialType.OTHERS,
  5: ResidentialType.CANTONMENT,
  9: ResidentialType.CITY_CORPORATION,
};

export class OldNationalID {
  static METADATA = {
    iso3166_alpha2: 'BD',
    min_length: 13,
    max_length: 13,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['Bangladesh national ID number', 'জাতীয় পরিচয়পত্র', 'NID', 'BD'],
    links: [
      'https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)',
      'http://nationalidcardbangladesh.blogspot.com/2016/04/voter-id-national-id-card-number.html',
      'https://www.facebook.com/428195627559147/photos/a.428251897553520/428251617553548/?type=3',
    ],
    deprecated: true,
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
    const rmo = Number(match.groups.rmo);
    if (!(rmo in RMO_MAP)) {
      return null;
    }
    return {
      distinct: match.groups.distinct,
      residential_type: RMO_MAP[rmo],
      policy_station_no: match.groups.police,
      union_code: match.groups.union,
      sn: match.groups.sn,
    };
  }
}
