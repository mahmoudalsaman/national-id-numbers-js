import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, letterToNumber } from '../util.js';

const REGEXP = /^([STFGM])(\d{7})([A-Z])$/;

export class NRIC {
    static METADATA = {
        iso3166_alpha2: 'SG',
        min_length: 9,
        max_length: 9,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['NRIC', 'National Registration Identity Card', 'Singapore Identity Card'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Singapore'],
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

        const [, prefix, digits, checkLetter] = match;

        // Determine citizenship based on prefix
        let citizenship;
        if (prefix === 'S' || prefix === 'T') {
            citizenship = 'Citizen';
        } else if (prefix === 'F' || prefix === 'G') {
            citizenship = 'Permanent Resident';
        } else if (prefix === 'M') {
            citizenship = 'Foreigner';
        }

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // NRIC doesn't directly encode gender
            prefix: prefix,
            digits: digits,
            checkLetter: checkLetter,
            citizenship: citizenship,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, prefix, digits, checkLetter] = match;

        // Singapore NRIC checksum algorithm
        const weights = [2, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        // Add weighted sum of digits
        for (let i = 0; i < 7; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }

        // Add prefix value
        const prefixValues = { 'S': 0, 'T': 4, 'F': 0, 'G': 4, 'M': 3 };
        sum += prefixValues[prefix] || 0;

        const remainder = sum % 11;

        // Check letters based on prefix type
        const checkLetters = {
            'S': ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'],
            'T': ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'J', 'Z', 'I', 'H'],
            'F': ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'],
            'G': ['R', 'Q', 'P', 'N', 'M', 'L', 'K', 'X', 'W', 'U', 'T'],
            'M': ['K', 'L', 'J', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X']
        };

        const expectedLetter = checkLetters[prefix][remainder];
        return expectedLetter === checkLetter;
    }
}

export const NationalID = aliasOf(NRIC);