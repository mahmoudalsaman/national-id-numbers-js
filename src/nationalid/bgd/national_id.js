import { validateRegexp } from '../util.js';
import { OldNationalID } from './old_national_id.js';

const REGEXP = /^(?<yyyy>\d{4})(?<distinct>\d{2})(?<rmo>\d)(?<police>\d{2})(?<union>\d{2})(?<sn>\d{6})$/;

export class NationalID extends OldNationalID {
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
    const oldResult = OldNationalID.parse(idNumber.slice(4));
    if (!oldResult) {
      return null;
    }
    return {
      ...oldResult,
      yyyy: Number(match.groups.yyyy),
    };
  }
}
