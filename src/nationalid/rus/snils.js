import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{3})-?(\d{3})-?(\d{3})\s?(\d{2})$/;

export class SNILS {
    static METADATA = {
        iso3166_alpha2: 'RU',
        min_length: 11,
        max_length: 14, // With separators
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['SNILS', 'Страховой номер индивидуального лицевого счёта', 'Russian Social Insurance Number'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Russia'],
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

        const [, part1, part2, part3, checkPart] = match;

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // SNILS doesn't encode gender or birth date
            cleanNumber: part1 + part2 + part3 + checkPart,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, part1, part2, part3, checkPart] = match;
        const baseNumber = part1 + part2 + part3;
        const expectedCheck = parseInt(checkPart);

        // SNILS checksum algorithm
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(baseNumber[i]) * (9 - i);
        }

        let checkSum;
        if (sum < 100) {
            checkSum = sum;
        } else if (sum === 100 || sum === 101) {
            checkSum = 0;
        } else {
            checkSum = sum % 101;
            if (checkSum < 100) {
                // Use as is
            } else {
                checkSum = 0;
            }
        }

        return checkSum === expectedCheck;
    }
}

export const NationalID = aliasOf(SNILS);