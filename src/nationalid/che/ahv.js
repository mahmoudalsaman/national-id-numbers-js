import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{3})\.?(\d{4})\.?(\d{4})\.?(\d{2})$/;

export class AHV {
    static METADATA = {
        iso3166_alpha2: 'CH',
        min_length: 13,
        max_length: 16, // With dots
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['AHV', 'Alters- und Hinterlassenenversicherung', 'Swiss Social Security Number'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Switzerland'],
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
            gender: Gender.UNKNOWN, // AHV doesn't encode gender or birth date
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

        // Swiss AHV uses EAN-13 algorithm
        let sum = 0;
        for (let i = 0; i < 11; i++) {
            const digit = parseInt(baseNumber[i]);
            if (i % 2 === 0) {
                sum += digit;
            } else {
                sum += digit * 3;
            }
        }

        const remainder = sum % 10;
        const checkDigit = remainder === 0 ? 0 : 10 - remainder;

        // Check digit is a 2-digit number, we only validate the units
        return (checkDigit === expectedCheck % 10);
    }
}

export const NationalID = aliasOf(AHV);