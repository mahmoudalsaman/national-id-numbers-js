import { Gender } from '../constant.js';
import { validateRegexp, aliasOf } from '../util.js';

const REGEXP = /^([A-Z]{4})(\d{6})([HM])([A-Z]{5})(\d{2})$/;

export class CURP {
    static METADATA = {
        iso3166_alpha2: 'MX',
        min_length: 18,
        max_length: 18,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['CURP', 'Clave Única de Registro de Población', 'Mexican Population Registry Code'],
        links: ['https://en.wikipedia.org/wiki/Clave_%C3%9Anica_de_Registro_de_Poblaci%C3%B3n'],
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

        const [, letters, birthDate, genderLetter, statePlusSurname, checkDigits] = match;

        // Parse birth date (YYMMDD)
        const year = parseInt(birthDate.slice(0, 2));
        const month = parseInt(birthDate.slice(2, 4));
        const day = parseInt(birthDate.slice(4, 6));

        // Validate date components
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        // Determine century (CURP started in 1996, so YY >= 00 is 20XX, otherwise 19XX)
        const actualYear = year >= 0 && year <= 30 ? 2000 + year : 1900 + year;
        const actualBirthDate = `${actualYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Parse gender
        const gender = genderLetter === 'H' ? Gender.MALE : Gender.FEMALE;

        return {
            number: idNumber,
            gender: gender,
            birthDate: actualBirthDate,
            year: actualYear,
            month: month,
            day: day,
            stateCode: statePlusSurname.slice(0, 2),
            surnames: statePlusSurname.slice(2),
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const baseId = idNumber.slice(0, 17);
        const checkDigit = parseInt(idNumber[17]);

        // CURP checksum algorithm
        const charValues = {
            '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18,
            'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27,
            'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35
        };

        let sum = 0;
        for (let i = 0; i < 17; i++) {
            const char = baseId[i];
            const value = charValues[char] || 0;
            sum += value * (18 - i);
        }

        const remainder = sum % 10;
        const expectedDigit = (10 - remainder) % 10;

        return expectedDigit === checkDigit;
    }
}

export const NationalID = aliasOf(CURP);