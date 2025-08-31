import { validateRegexp, weightedModulusDigit, modulusOverflowMod10 } from '../util.js';

export const ThaiCitizenship = Object.freeze({
  OTHER: 0,
  CITIZEN_AFTER_1984: 1,
  CITIZEN_AFTER_1984_LATE_REGISTERED: 2,
  CITIZEN_BEFORE_1984: 3,
  CITIZEN_BEFORE_1984_LATE_REGISTERED: 4,
  CITIZEN_SPECIAL_CASE: 5,
  FOREIGN_RESIDENT: 6,
  FOREIGN_RESIDENT_CHILDREN: 7,
  PERMANENT_RESIDENT: 8,
});

function normalize(idNumber) {
  return idNumber.replace(/[ \-/]/g, '');
}

const REGEXP = /^(?<citizenship>[0-8])[ -]?(?<province>\d{2})(?<district>\d{2})[ -]?(?<sn>\d{5}[ -]?\d{2})[ -]?(?<checksum>\d)$/;
const PROVINCE_LIST = ['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','60','61','62','63','64','65','66','67','70','71','72','73','74','75','76','77','80','81','82','83','84','85','86','90','91','92','93','94','95','96'];
const DISTRICT_MAX_VALUE = { '10':50,'11':6,'12':6,'13':7,'14':46,'15':7,'16':11,'17':9,'18':8,'19':12,'20':11,'21':8,'22':10,'23':7,'24':11,'25':9,'26':4,'27':9,'30':32,'31':23,'32':17,'33':22,'34':25,'35':9,'36':16,'37':6,'38':8,'39':6,'40':26,'41':25,'42':14,'43':9,'44':13,'45':20,'46':18,'47':18,'48':12,'49':7,'50':25,'51':8,'52':12,'53':9,'54':16,'55':15,'56':9,'57':18,'58':7,'60':15,'61':8,'62':11,'63':9,'64':9,'65':22,'66':13,'67':13,'70':10,'71':13,'72':10,'73':7,'74':3,'75':3,'76':7,'77':8,'80':23,'81':8,'82':8,'83':3,'84':19,'85':4,'86':8,'90':16,'91':7,'92':10,'93':11,'94':11,'95':8,'96':13};
const DISTINCT_SPECIAL_CASE = { '44': [95] };
const MAGIC_MULTIPLIER = [13,12,11,10,9,8,7,6,5,4,3,2];

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'TH',
    min_length: 13,
    max_length: 13,
    parsable: true,
    checksum: true,
    regexp: REGEXP,
    alias_of: null,
    names: ['National ID Number','Population Identification Code','บัตรประชาชน','รหัสบัตรประชาชน'],
    links: [
      'https://en.wikipedia.org/wiki/National_identification_number#Thailand',
      'https://learn.microsoft.com/en-us/microsoft-365/compliance/sit-defn-thai-population-identification-code?view=o365-worldwide'
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
    const citizenship = Number(match.groups.citizenship);
    const province = match.groups.province;
    const district = match.groups.district;
    const sn = normalize(match.groups.sn);
    if (!this.checkProvinceCode(province)) {
      return null;
    }
    if (!this.checkDistrictCode(province, district)) {
      return null;
    }
    if (!this.checksum(idNumber)) {
      return null;
    }
    return {
      citizenship,
      province_code: province,
      district_code: district,
      sn,
      checksum: Number(match.groups.checksum),
    };
  }

  static checksum(idNumber) {
    if (!validateRegexp(idNumber, REGEXP)) {
      return false;
    }
    const numbers = normalize(idNumber).split('').map((c) => Number(c));
    const modulus = modulusOverflowMod10(
      weightedModulusDigit(numbers.slice(0, -1), MAGIC_MULTIPLIER, 11)
    );
    return modulus === numbers[numbers.length - 1];
  }

  static checkProvinceCode(code) {
    return PROVINCE_LIST.includes(code);
  }

  static checkDistrictCode(province, district) {
    if (district === '99') {
      return true;
    }
    const val = Number(district);
    if (val <= DISTRICT_MAX_VALUE[province]) {
      return true;
    }
    if (!(province in DISTINCT_SPECIAL_CASE)) {
      return false;
    }
    return DISTINCT_SPECIAL_CASE[province].includes(val);
  }
}
