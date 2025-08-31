import { Gender } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<gender>[123478])(?<yy>\d{2})(?<mm>(0[1-9]|1[0-2]|[2-3][0-9]|4[0-2]|[5-9][0-9]))(?<birth_department>((\d{2}|2[ABab])\d{3}))(?<cert_number>(?!000)\d{3})(?<control_key>(?!(00|98|99))\d{2})$/;

function normalize(idNumber) {
  return idNumber ? idNumber.toUpperCase() : null;
}

export class INSEE {
  static METADATA = {
    iso3166_alpha2: 'FR',
    min_length: 15,
    max_length: 15,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number', 'INSEE', 'NIR', 'NIRPP'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#France',
      'https://fr.wikipedia.org/wiki/Num%C3%A9ro_de_s%C3%A9curit%C3%A9_sociale_en_France#Signification_des_chiffres_du_NIR',
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
    const match = normalize(idNumber).match(REGEXP);
    if (!match) {
      return null;
    }
    const birthDepartment = this.validateBirthDepartment(match.groups.birth_department);
    if (!birthDepartment) {
      return null;
    }
    const checksum = this.checksum(idNumber);
    if (checksum === null || String(checksum) !== match.groups.control_key) {
      return null;
    }
    return {
      gender: match.groups.gender === '1' ? Gender.MALE : Gender.FEMALE,
      yy: match.groups.yy,
      mm: match.groups.mm,
      birth_department: birthDepartment,
      checksum: match.groups.control_key,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const normalized = normalize(idNumber).replace('2A', '19').replace('2B', '18');
    return 97 - (Number(normalized.slice(0, -2)) % 97);
  }

  static validateBirthDepartment(birthDepartment) {
    const departmentCode = birthDepartment.slice(0, 2).toUpperCase();
    if ((/^[0-9]{2}$/.test(departmentCode) && Number(departmentCode) >= 1 && Number(departmentCode) <= 95) || ['2A', '2B'].includes(departmentCode)) {
      return { department: birthDepartment.slice(0, 2), city: birthDepartment.slice(2), country: '' };
    }
    const numeric = Number(departmentCode);
    if (numeric >= 97 && numeric <= 98) {
      return { department: birthDepartment.slice(0, 3), city: birthDepartment.slice(3), country: '' };
    }
    if (departmentCode === '99') {
      return { department: '', city: '', country: birthDepartment.slice(2) };
    }
    return null;
  }
}

export const NationalID = aliasOf(INSEE);
