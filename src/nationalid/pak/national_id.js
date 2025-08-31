import { Gender } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<location>\d{5})-?(?<sn>\d{7})-?(?<gender>\d)$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'PK',
    min_length: 13,
    max_length: 13,
    parsable: true,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Card Number', 'CNIC', 'NIC', 'قومی شناختی کارڈ'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Pakistan',
      'https://en.wikipedia.org/wiki/CNIC_(Pakistan)#Security_features',
      'https://www.geo.tv/latest/250118-mystery-behind-13-digit-cnic-number',
      'https://www.informationpk.com/interesting-information-about-or-meaning-of-nadra-cnic-13-digits-number/',
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
    return {
      location: match.groups.location,
      sn: match.groups.sn,
      gender:
        Number(match.groups.gender) % 2 === 1 ? Gender.MALE : Gender.FEMALE,
    };
  }
}

export const CNIC = aliasOf(NationalID);
