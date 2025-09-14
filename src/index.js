import * as ALB from './nationalid/alb/identity_number.js';
import * as ARE from './nationalid/are/emirates_id.js';
import * as BGD from './nationalid/bgd/national_id.js';
import * as BGDOld from './nationalid/bgd/old_national_id.js';
import * as CHN from './nationalid/chn/resident_id.js';
import * as DEU from './nationalid/deu/tax_id.js';
import * as EGY from './nationalid/egy/national_id.js';
import * as ESP from './nationalid/esp/dni.js';
import * as FRA from './nationalid/fra/insee.js';
import * as GBR from './nationalid/gbr/national_insurance.js';
import * as IDN from './nationalid/idn/national_id.js';
import * as IND from './nationalid/ind/national_id.js';
import * as IRN from './nationalid/irn/national_id.js';
import * as ITA from './nationalid/ita/fiscal_code.js';
import * as JOR from './nationalid/jor/national_id.js';
import * as LKA from './nationalid/lka/national_id.js';
import * as LKAOld from './nationalid/lka/old_national_id.js';
import * as MYS from './nationalid/mys/nric.js';
import * as NGA from './nationalid/nga/national_id.js';
import * as NPL from './nationalid/npl/national_id.js';
import * as PAK from './nationalid/pak/national_id.js';
import * as PHL from './nationalid/phl/phil_id.js';
import * as SAU from './nationalid/sau/national_id.js';
import * as THA from './nationalid/tha/national_id.js';
import * as TUR from './nationalid/tur/national_id.js';
import * as USA from './nationalid/usa/social_security.js';
import * as VNM from './nationalid/vnm/national_id.js';
import * as BR from './nationalid/br/national_id.js';
import * as CA from './nationalid/ca/social_insurance.js';
import * as AR from './nationalid/ar/national_id.js';
import * as AT from './nationalid/at/personalausweis.js';
import * as BE from './nationalid/be/national_number.js';
import * as BG from './nationalid/bg/egn.js';
import * as DK from './nationalid/dk/cpr_number.js';
import * as FI from './nationalid/fi/henkilotunnus.js';

const COUNTRY_MODULES = {
  AL: ALB,
  AE: ARE,
  BD: BGD,
  CN: CHN,
  DE: DEU,
  EG: EGY,
  ES: ESP,
  FR: FRA,
  GB: GBR,
  ID: IDN,
  IN: IND,
  IR: IRN,
  IT: ITA,
  JO: JOR,
  LK: LKA,
  MY: MYS,
  NG: NGA,
  NP: NPL,
  PK: PAK,
  PH: PHL,
  SA: SAU,
  TH: THA,
  TR: TUR,
  US: USA,
  VN: VNM,
  BR: BR,
  CA: CA,
  AR: AR,
  AT: AT,
  BE: BE,
  BG: BG,
  DK: DK,
  FI: FI,
};

export class NationalID {
  static _lookup(countryCode) {
    if (typeof countryCode !== 'string') {
      throw new TypeError('countryCode must be a string');
    }
    return COUNTRY_MODULES[countryCode.toUpperCase()];
  }

  static validate(countryCode, idNumber) {
    const mod = this._lookup(countryCode);
    if (!mod) {
      throw new Error(`unsupported country code: ${countryCode}`);
    }
    if (mod.NationalID && typeof mod.NationalID.validate === 'function') {
      return mod.NationalID.validate(idNumber);
    }
    if (typeof mod.validate === 'function') {
      return mod.validate(idNumber);
    }
    throw new Error(`validation not supported for country code: ${countryCode}`);
  }

  static parse(countryCode, idNumber) {
    const mod = this._lookup(countryCode);
    if (!mod) {
      throw new Error(`unsupported country code: ${countryCode}`);
    }
    if (mod.NationalID && typeof mod.NationalID.parse === 'function') {
      return mod.NationalID.parse(idNumber);
    }
    if (typeof mod.parse === 'function') {
      return mod.parse(idNumber);
    }
    throw new Error(`parsing not supported for country code: ${countryCode}`);
  }
}

export {
  ALB,
  ARE,
  BGD,
  BGDOld,
  CHN,
  DEU,
  EGY,
  ESP,
  FRA,
  GBR,
  IDN,
  IND,
  IRN,
  ITA,
  JOR,
  LKA,
  LKAOld,
  MYS,
  NGA,
  NPL,
  PAK,
  PHL,
  SAU,
  THA,
  TUR,
  USA,
  VNM,
  BR,
  CA,
  AR,
  AT,
  BE,
  BG,
  DK,
  FI,
};

export * from './nationalid/constant.js';
export * from './nationalid/util.js';
