import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^(\d{10})$/;

export class RodneCislo {
    static METADATA = {
        iso3166_alpha2: 'SK',
        min_length: 10,
        max_length: 10,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['Rodné číslo', 'Slovak Personal Number', 'Slovak National ID'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Slovakia'],
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

        // Extract birth date and gender from Rodné číslo
        const year = parseInt(digits.slice(0, 2));
        const month = parseInt(digits.slice(2, 4));
        const day = parseInt(digits.slice(4, 6));

        // Determine century and gender based on month
        let century = 1900;
        let actualMonth = month;
        let gender = Gender.MALE;

        if (month >= 51 && month <= 62) {
            century = 2000;
            actualMonth = month - 50;
            gender = Gender.FEMALE;
        } else if (month >= 1 && month <= 12) {
            century = 1900;
            actualMonth = month;
            gender = Gender.MALE;
        } else if (month >= 21 && month <= 32) {
            century = 2000;
            actualMonth = month - 20;
            gender = Gender.FEMALE;
        } else {
            return null; // Invalid month
        }

        const actualYear = century + year;
        const birthDate = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        return {
            number: idNumber,
            gender: gender,
            birthDate: birthDate,
            year: actualYear,
            month: actualMonth,
            day: day,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        // Apply Slovak Rodné číslo checksum algorithm (Modulo 11)
        const digits = idNumber.replace(/\D/g, '');
        if (digits.length !== 10) {
            return false;
        }

        // Modulo 11 algorithm for Slovak Rodné číslo
        const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }

        const remainder = sum % 11;
        const checkDigit = remainder < 2 ? remainder : 11 - remainder;

        return checkDigit === parseInt(digits[9]);
    }
}

export const NationalID = aliasOf(RodneCislo);
