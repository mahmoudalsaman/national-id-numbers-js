import { Gender } from '../constant.js';
import { aliasOf, validateRegexp } from '../util.js';

const REGEXP = /^(?<surname>[A-Z]{3})(?<firstname>[A-Z]{3})(?<yy>[0-9A-Z]{2})(?<m>[A-EHLMPR-T])(?<dd>[0-9A-Z]{2})(?<area_code>[A-Z][0-9A-Z]{3})(?<checksum>[A-Z])$/;

const MONTH_MAP = { A:1, B:2, C:3, D:4, E:5, H:6, L:7, M:8, P:9, R:10, S:11, T:12 };
const MAGIC_ODD_CHAR_MAP = { '0':1,'9':21,'I':19,'R':8,'1':0,'A':1,'J':21,'S':12,'2':5,'B':0,'K':2,'T':14,'3':7,'C':5,'L':4,'U':16,'4':9,'D':7,'M':18,'V':10,'5':13,'E':9,'N':20,'W':22,'6':15,'F':13,'O':11,'X':25,'7':17,'G':15,'P':3,'Y':24,'8':19,'H':17,'Q':6,'Z':23 };
const MAGIC_EVEN_CHAR_MAP = { '0':0,'9':9,'I':8,'R':17,'1':1,'A':0,'J':9,'S':18,'2':2,'B':1,'K':10,'T':19,'3':3,'C':2,'L':11,'U':20,'4':4,'D':3,'M':12,'V':21,'5':5,'E':4,'N':13,'W':22,'6':6,'F':5,'O':14,'X':23,'7':7,'G':6,'P':15,'Y':24,'8':8,'H':7,'Q':16,'Z':25 };
const NUMERIC_REPLACEMENT = { L:'0', Q:'4', U:'8', M:'1', R:'5', V:'9', N:'2', S:'6', P:'3', T:'7' };

export class FiscalCode {
  static METADATA = {
    iso3166_alpha2: 'IT',
    min_length: 16,
    max_length: 16,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['Fiscal Code', 'Codice fiscale'],
    links: [
      'https://en.wikipedia.org/wiki/Italian_fiscal_code',
      'https://en.wikipedia.org/wiki/National_identification_number#Italy',
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
    const areaCodeNums = this.sterilizeNumbers(match.groups.area_code.slice(1));
    if (!areaCodeNums) {
      return null;
    }
    const dobGender = this.extractBirthday(match.groups.yy, match.groups.m, match.groups.dd);
    if (!dobGender) {
      return null;
    }
    const checksum = this.checksum(idNumber);
    if (checksum === null || checksum !== match.groups.checksum) {
      return null;
    }
    return {
      surname_consonants: match.groups.surname,
      firstname_consonants: match.groups.firstname,
      area_code: match.groups.area_code[0] + areaCodeNums,
      yyyymmdd: dobGender.date,
      gender: dobGender.gender,
      checksum,
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return null;
    }
    const alphanum = idNumber.slice(0, -1);
    let odd = 0;
    let even = 0;
    for (let i = 0; i < alphanum.length; i++) {
      const ch = alphanum[i];
      if ((i + 1) % 2 === 1) {
        odd += MAGIC_ODD_CHAR_MAP[ch];
      } else {
        even += MAGIC_EVEN_CHAR_MAP[ch];
      }
    }
    const modulus = (odd + even) % 26;
    return String.fromCharCode(65 + modulus);
  }

  static extractBirthday(yyStr, m, ddStr) {
    if (!(m in MONTH_MAP)) {
      return null;
    }
    const sterilizedDd = this.sterilizeNumbers(ddStr);
    if (!sterilizedDd) {
      return null;
    }
    const sterilizedYy = this.sterilizeNumbers(yyStr);
    if (!sterilizedYy) {
      return null;
    }
    const yy = Number(sterilizedYy);
    const dd = Number(sterilizedDd);
    const yearBase = yy < 50 ? 2000 : 1900;
    const mm = MONTH_MAP[m];
    const day = dd < 40 ? dd : dd - 40;
    const gender = dd < 40 ? Gender.MALE : Gender.FEMALE;
    try {
      const dateObj = new Date(Date.UTC(yearBase + yy, mm - 1, day));
      if (
        dateObj.getUTCFullYear() !== yearBase + yy ||
        dateObj.getUTCMonth() + 1 !== mm ||
        dateObj.getUTCDate() !== day
      ) {
        return null;
      }
      return { date: dateObj, gender };
    } catch {
      return null;
    }
  }

  static sterilizeNumbers(source) {
    let result = '';
    for (let i = source.length - 1; i >= 0; i--) {
      const char = source[i];
      if (/[A-Z]/.test(char)) {
        if (!(char in NUMERIC_REPLACEMENT)) {
          return null;
        }
        result += NUMERIC_REPLACEMENT[char];
      } else {
        result += char;
      }
    }
    return result.split('').reverse().join('');
  }
}

export const NationalID = aliasOf(FiscalCode);
