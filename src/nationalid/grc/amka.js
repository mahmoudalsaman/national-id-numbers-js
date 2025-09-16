import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^(\d{6})(\d{5})$/;

export class AMKA {
    static METADATA = {
        iso3166_alpha2: 'GR',
        min_length: 11,
        max_length: 11,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['AMKA', 'Arithmos Mētrōou Koinōnikēs Asfaliseōs', 'Greek Social Security Number'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Greece'],
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

        const [, birthPart, serialPart] = match;

        // Extract birth date from first 6 digits (DDMMYY)
        const day = parseInt(birthPart.slice(0, 2));
        const month = parseInt(birthPart.slice(2, 4));
        const year = parseInt(birthPart.slice(4, 6));

        // Validate date components
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        // Determine century (usually 1900s for older people, 2000s for newer)
        // This is a simplified approach - actual AMKA has more complex century determination
        const actualYear = year < 50 ? 2000 + year : 1900 + year;

        const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // AMKA doesn't typically encode gender in a standard way
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

        const digits = idNumber.split('').map(d => parseInt(d));

        // AMKA uses a weighted sum algorithm
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += digits[i] * (i + 1);
        }

        const remainder = sum % 11;
        const expectedCheckDigit = remainder === 10 ? 0 : remainder;

        return expectedCheckDigit === digits[10];
    }
}

export const NationalID = aliasOf(AMKA);