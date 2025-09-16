import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^(\d{8,9})$/;

export class IRDNumber {
    static METADATA = {
        iso3166_alpha2: 'NZ',
        min_length: 8,
        max_length: 9,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['IRD Number', 'Inland Revenue Department Number', 'New Zealand Tax Number'],
        links: ['https://en.wikipedia.org/wiki/New_Zealand_Inland_Revenue_Department#IRD_numbers'],
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
            gender: Gender.UNKNOWN, // IRD numbers don't encode personal information
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        // Pad to 9 digits if needed
        const paddedId = idNumber.padStart(9, '0');
        const digits = paddedId.split('').map(d => parseInt(d));

        // IRD checksum algorithm
        const weights = [3, 2, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        for (let i = 0; i < 8; i++) {
            sum += digits[i] * weights[i];
        }

        const remainder = sum % 11;
        let checkDigit;

        if (remainder === 0) {
            checkDigit = 0;
        } else if (remainder === 1) {
            return false; // Invalid IRD number
        } else {
            checkDigit = 11 - remainder;
        }

        return checkDigit === digits[8];
    }
}

export const NationalID = aliasOf(IRDNumber);