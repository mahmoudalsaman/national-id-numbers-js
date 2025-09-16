import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, weightedModulusDigit } from '../util.js';

const REGEXP = /^(\d{8})(\d)$/;

export class NIC {
    static METADATA = {
        iso3166_alpha2: 'PT',
        min_length: 9,
        max_length: 9,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['NIC', 'Número de Identificação Civil', 'Portuguese Civil Identification Number'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Portugal'],
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

        return {
            number: idNumber,
            gender: Gender.UNKNOWN, // NIC doesn't encode gender or birth date
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, digits, checkDigit] = match;

        // Portuguese NIC uses modulo 11 algorithm
        const weights = [9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        for (let i = 0; i < 8; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }

        const remainder = sum % 11;
        let expectedCheckDigit;

        if (remainder < 2) {
            expectedCheckDigit = 0;
        } else {
            expectedCheckDigit = 11 - remainder;
        }

        return expectedCheckDigit === parseInt(checkDigit);
    }
}

export const NationalID = aliasOf(NIC);