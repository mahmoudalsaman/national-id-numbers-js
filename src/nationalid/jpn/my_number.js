import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^(\d{12})$/;

export class MyNumber {
    static METADATA = {
        iso3166_alpha2: 'JP',
        min_length: 12,
        max_length: 12,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['My Number', 'Individual Number', 'Japanese Social Security Number'],
        links: ['https://en.wikipedia.org/wiki/My_Number'],
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

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // My Number doesn't encode gender or birth date
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const digits = idNumber.split('').map(d => parseInt(d));

        // My Number uses specific checksum algorithm
        const weights = [6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        for (let i = 0; i < 11; i++) {
            sum += digits[i] * weights[i];
        }

        const remainder = sum % 11;
        let checkDigit;

        if (remainder <= 1) {
            checkDigit = 0;
        } else {
            checkDigit = 11 - remainder;
        }

        return checkDigit === digits[11];
    }
}

export const NationalID = aliasOf(MyNumber);