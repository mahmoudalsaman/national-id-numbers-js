import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{6})-?([1-4])(\d{6})$/;

export class RRN {
    static METADATA = {
        iso3166_alpha2: 'KR',
        min_length: 13,
        max_length: 14, // With optional dash
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['RRN', 'Resident Registration Number', 'Korean National ID'],
        links: ['https://en.wikipedia.org/wiki/Resident_registration_number'],
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

        const [, birthPart, genderCenturyDigit, serialAndCheck] = match;

        // Extract birth date (YYMMDD)
        const year = parseInt(birthPart.slice(0, 2));
        const month = parseInt(birthPart.slice(2, 4));
        const day = parseInt(birthPart.slice(4, 6));

        // Validate date components
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        // Determine century and gender based on gender-century digit
        const genderDigit = parseInt(genderCenturyDigit);
        let century, gender;

        switch (genderDigit) {
            case 1:
                century = 1900;
                gender = Gender.MALE;
                break;
            case 2:
                century = 1900;
                gender = Gender.FEMALE;
                break;
            case 3:
                century = 2000;
                gender = Gender.MALE;
                break;
            case 4:
                century = 2000;
                gender = Gender.FEMALE;
                break;
            default:
                return null;
        }

        const actualYear = century + year;
        const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        return {
            number: idNumber.replace('-', ''),
            gender: gender,
            birthDate: birthDate,
            year: actualYear,
            month: month,
            day: day,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const cleanId = idNumber.replace('-', '');
        const digits = cleanId.split('').map(d => parseInt(d));

        // Korean RRN checksum algorithm
        const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        let sum = 0;

        for (let i = 0; i < 12; i++) {
            sum += digits[i] * weights[i];
        }

        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;

        return checkDigit === digits[12];
    }
}

export const NationalID = aliasOf(RRN);