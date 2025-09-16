import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, letterToNumber } from '../util.js';

const REGEXP = /^(\d{7})([A-W])([A-I]?)$/;

export class PPSNumber {
    static METADATA = {
        iso3166_alpha2: 'IE',
        min_length: 8,
        max_length: 9,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['PPS Number', 'Personal Public Service Number', 'Irish Social Security Number'],
        links: ['https://en.wikipedia.org/wiki/Personal_Public_Service_Number'],
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

        const [, digits, checkLetter, secondLetter] = match;

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // PPS doesn't encode gender
            digits: digits,
            checkLetter: checkLetter,
            secondLetter: secondLetter || null,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, digits, checkLetter] = match;

        // PPS Number checksum algorithm
        const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let sum = 0;

        // Calculate weighted sum of digits
        for (let i = 0; i < 7; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }

        // Add check letter value (A=1, B=2, ..., W=23, skipping J, K, O)
        const checkLetterValue = this.getLetterValue(checkLetter);
        sum += checkLetterValue * 8;

        return sum % 23 === 0;
    }

    static getLetterValue(letter) {
        // PPS uses A-W but skips J, K, O
        const letterValues = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
            'I': 9, 'L': 10, 'M': 11, 'N': 12, 'P': 13, 'Q': 14, 'R': 15,
            'S': 16, 'T': 17, 'U': 18, 'V': 19, 'W': 20
        };
        return letterValues[letter] || 0;
    }
}

export const NationalID = aliasOf(PPSNumber);