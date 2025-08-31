import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^[A-Z]{2}\d{6}[A-Z]$/;

function checkPrefix(prefix) {
  const prohibitChars = ['D', 'F', 'I', 'Q', 'U', 'V'];
  if (prohibitChars.some((c) => prefix.includes(c))) {
    return false;
  }
  if (prefix[1] === 'O') {
    return false;
  }
  const notAllocated = ['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ'];
  return !notAllocated.includes(prefix);
}

function checkSuffix(suffix) {
  const allowed = ['A', 'B', 'C', 'D', 'F', 'M', 'P'];
  return allowed.includes(suffix);
}

export class NationalInsuranceNumber {
  static METADATA = {
    iso3166_alpha2: 'GB',
    min_length: 9,
    max_length: 9,
    parsable: false,
    checksum: false,
    regexp: REGEXP,
    alias_of: null,
    names: ['National Insurance Number', 'NI No', 'NINO'],
    links: [
      'https://en.wikipedia.org/wiki/National_Insurance_number',
      'https://www.gov.uk/hmrc-internal-manuals/national-insurance-manual/nim39110',
    ],
    deprecated: false,
  };

  static validate(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const prefix = idNumber.slice(0, 2);
    const suffix = idNumber.slice(-1);
    return checkPrefix(prefix) && checkSuffix(suffix);
  }
}

export const NationalID = aliasOf(NationalInsuranceNumber);
