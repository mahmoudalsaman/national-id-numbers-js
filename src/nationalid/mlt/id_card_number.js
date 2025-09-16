import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, letterToNumber } from '../util.js';

const REGEXP = /^(\d{7})([A-Z])$/;

export class IDCardNumber {
    static METADATA = {
        iso3166_alpha2: 'MT',
        min_length: 8,
        max_length: 8,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['ID Card Number', 'Malta Identity Card Number', 'Maltese National ID'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Malta'],
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

        const [, digits, checkLetter] = match;

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // Malta ID doesn't encode gender
            digits: digits,
            checkLetter: checkLetter,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, digits, checkLetter] = match;

        // Malta ID Card uses a specific algorithm
        const weights = [1, 2, 3, 4, 5, 6, 7];
        let sum = 0;

        for (let i = 0; i < 7; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }

        const remainder = sum % 26;
        const expectedLetter = String.fromCharCode(65 + remainder); // A=65

        return expectedLetter === checkLetter;
    }
}

export const NationalID = aliasOf(IDCardNumber);