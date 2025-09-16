import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{4})(\d{2})(\d{2})(\d{3})(\d{2})$/;

export class NationalNumber {
    static METADATA = {
        iso3166_alpha2: 'LU',
        min_length: 13,
        max_length: 13,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['National Number', 'Luxembourg National ID', 'Numéro National'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Luxembourg'],
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

        // Validate checksum
        if (!this.checksum(idNumber)) {
            return null;
        }

        const [, year, month, day, serial, checkDigits] = match;

        const actualYear = parseInt(year);
        const actualMonth = parseInt(month);
        const actualDay = parseInt(day);

        // Validate date
        if (actualMonth < 1 || actualMonth > 12 || actualDay < 1 || actualDay > 31) {
            return null;
        }

        const birthDate = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${actualDay.toString().padStart(2, '0')}`;

        // Gender is typically determined by the serial number (odd for male, even for female)
        const serialNum = parseInt(serial);
        const gender = (serialNum % 2 === 0) ? Gender.FEMALE : Gender.MALE;

        return {
            number: idNumber,
            gender: gender,
            birthDate: birthDate,
            year: actualYear,
            month: actualMonth,
            day: actualDay,
            serial: serial,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, year, month, day, serial, checkDigits] = match;
        const baseNumber = year + month + day + serial;

        // Luxembourg uses modulo 97 checksum
        const remainder = parseInt(baseNumber) % 97;
        const expectedCheck = 97 - remainder;

        return expectedCheck === parseInt(checkDigits);
    }
}

export const NationalID = aliasOf(NationalNumber);