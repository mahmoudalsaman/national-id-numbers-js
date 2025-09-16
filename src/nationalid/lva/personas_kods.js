import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^([0-9]{6})-?([0-9]{5})$/;

export class PersonasKods {
    static METADATA = {
        iso3166_alpha2: 'LV',
        min_length: 11,
        max_length: 12, // With optional dash
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['Personas kods', 'Latvian Personal Code', 'Latvian National ID'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Latvia'],
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

        const cleanId = idNumber.replace('-', '');

        // Validate checksum
        if (!this.checksum(cleanId)) {
            return null;
        }

        const [, datePart, serialPart] = match;

        // Extract birth date (DDMMYY format)
        const day = parseInt(datePart.slice(0, 2));
        const month = parseInt(datePart.slice(2, 4));
        const year = parseInt(datePart.slice(4, 6));

        // Validate date components
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        // Determine century based on the first digit of serial part
        const centuryDigit = parseInt(serialPart[0]);
        let century;
        if (centuryDigit === 0) {
            century = 1800;
        } else if (centuryDigit === 1) {
            century = 1900;
        } else if (centuryDigit === 2) {
            century = 2000;
        } else {
            return null; // Invalid century
        }

        const actualYear = century + year;
        const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Gender is determined by the second digit of serial part
        const genderDigit = parseInt(serialPart[1]);
        const gender = (genderDigit % 2 === 0) ? Gender.FEMALE : Gender.MALE;

        return {
            number: cleanId,
            gender: gender,
            birthDate: birthDate,
            year: actualYear,
            month: month,
            day: day,
        };
    }

    static checksum(idNumber) {
        const cleanId = idNumber.replace('-', '');

        if (cleanId.length !== 11) {
            return false;
        }

        const digits = cleanId.split('').map(d => parseInt(d));

        // Latvian algorithm uses specific weights
        const weights = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        let sum = 0;

        for (let i = 0; i < 10; i++) {
            sum += digits[i] * weights[i];
        }

        const remainder = sum % 11;
        const checkDigit = remainder === 1 ? 1 : (11 - remainder) % 10;

        return checkDigit === digits[10];
    }
}

export const NationalID = aliasOf(PersonasKods);