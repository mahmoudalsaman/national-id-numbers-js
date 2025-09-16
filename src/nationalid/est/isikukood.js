import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^([1-8])(\d{2})([01]\d)([0-3]\d)(\d{3})(\d)$/;

export class Isikukood {
    static METADATA = {
        iso3166_alpha2: 'EE',
        min_length: 11,
        max_length: 11,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['Isikukood', 'Estonian Personal Identity Code', 'Estonian National ID'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Estonia'],
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

        const [, centuryDigit, year, month, day] = match;

        // Determine century and gender
        const century = this.getCentury(parseInt(centuryDigit));
        const gender = this.getGender(parseInt(centuryDigit));

        if (century === null) {
            return null;
        }

        const actualYear = century + parseInt(year);
        const actualMonth = parseInt(month);
        const actualDay = parseInt(day);

        // Validate date
        if (actualMonth < 1 || actualMonth > 12 || actualDay < 1 || actualDay > 31) {
            return null;
        }

        const birthDate = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${actualDay.toString().padStart(2, '0')}`;

        return {
            number: idNumber,
            gender: gender,
            birthDate: birthDate,
            year: actualYear,
            month: actualMonth,
            day: actualDay,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const digits = idNumber.slice(0, 10).split('').map(d => parseInt(d));
        const checkDigit = parseInt(idNumber[10]);

        // Estonian algorithm uses specific weights
        const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
        const weights2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += digits[i] * weights1[i];
        }

        let remainder = sum % 11;
        if (remainder < 10) {
            return remainder === checkDigit;
        }

        // If remainder is 10, use second set of weights
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += digits[i] * weights2[i];
        }

        remainder = sum % 11;
        if (remainder < 10) {
            return remainder === checkDigit;
        }

        // If still 10, check digit should be 0
        return checkDigit === 0;
    }

    static getCentury(centuryDigit) {
        switch (centuryDigit) {
            case 1:
            case 2:
                return 1800;
            case 3:
            case 4:
                return 1900;
            case 5:
            case 6:
                return 2000;
            case 7:
            case 8:
                return 2100;
            default:
                return null;
        }
    }

    static getGender(centuryDigit) {
        return centuryDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    }
}

export const NationalID = aliasOf(Isikukood);