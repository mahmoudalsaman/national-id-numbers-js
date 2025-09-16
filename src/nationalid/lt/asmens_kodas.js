import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, luhnDigit } from '../util.js';

const REGEXP = /^(\d{11})$/;

export class AsmensKodas {
    static METADATA = {
        iso3166_alpha2: 'LT',
        min_length: 11,
        max_length: 11,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['Asmens kodas', 'Lithuanian Personal Code', 'Lithuanian National ID'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Lithuania'],
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

        const digits = idNumber;

        // Extract birth date and gender from Asmens kodas
        const year = parseInt(digits.slice(1, 3));
        const month = parseInt(digits.slice(3, 5));
        const day = parseInt(digits.slice(5, 7));

        // Validate month and day
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        // Validate year
        if (year < 0 || year > 99) {
            return null;
        }

        // Determine century based on first digit
        const centuryDigit = parseInt(digits[0]);
        let century = 2000;
        if (centuryDigit === 1 || centuryDigit === 2) {
            century = 1800;
        } else if (centuryDigit === 3 || centuryDigit === 4) {
            century = 1900;
        } else if (centuryDigit === 5 || centuryDigit === 6) {
            century = 2000;
        }

        const actualYear = century + year;
        const birthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Determine gender based on first digit
        const gender = (centuryDigit % 2 === 0) ? Gender.FEMALE : Gender.MALE;

        return {
            number: idNumber,
            gender: gender,
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

        // Apply Luhn algorithm for Lithuanian Asmens kodas
        const digits = idNumber.replace(/\D/g, '');
        if (digits.length !== 11) {
            return false;
        }

        // Calculate Luhn check digit
        const workingDigits = digits.slice(0, 10).split('').map(d => parseInt(d));
        const checkDigit = luhnDigit(workingDigits);
        return checkDigit === parseInt(digits[10]);
    }
}

export const NationalID = aliasOf(AsmensKodas);
