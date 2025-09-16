import { Gender } from '../constant.js';
import { validateRegexp, aliasOf, letterToNumber } from '../util.js';

const REGEXP = /^([A-Z])([1-2])(\d{8})$/;

export class NationalID {
    static METADATA = {
        iso3166_alpha2: 'TW',
        min_length: 10,
        max_length: 10,
        parsable: true,
        checksum: true,
        regexp: REGEXP,
        alias_of: null,
        names: ['National ID', 'Taiwan National Identity Card', 'ROC ID Number'],
        links: ['https://en.wikipedia.org/wiki/National_identification_number#Taiwan'],
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

        const [, regionLetter, genderDigit, serialAndCheck] = match;

        // Determine gender
        const gender = parseInt(genderDigit) === 1 ? Gender.MALE : Gender.FEMALE;

        // Get region from letter
        const region = this.getRegionFromLetter(regionLetter);

        return {
            number: idNumber,
            gender: gender,
            regionLetter: regionLetter,
            region: region,
            genderDigit: genderDigit,
        };
    }

    static checksum(idNumber) {
        const match = idNumber.match(REGEXP);
        if (!match) {
            return false;
        }

        const [, regionLetter, genderDigit, serialAndCheck] = match;

        // Taiwan ID checksum algorithm
        const regionValue = letterToNumber(regionLetter) + 9; // A=10, B=11, etc.
        const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

        let sum = Math.floor(regionValue / 10) * weights[0] + (regionValue % 10) * weights[1];
        sum += parseInt(genderDigit) * weights[2];

        for (let i = 0; i < 7; i++) {
            sum += parseInt(serialAndCheck[i]) * weights[i + 3];
        }

        const checkDigit = parseInt(serialAndCheck[7]);
        const remainder = sum % 10;
        const expectedCheck = remainder === 0 ? 0 : 10 - remainder;

        return expectedCheck === checkDigit;
    }

    static getRegionFromLetter(letter) {
        const regions = {
            'A': 'Taipei City', 'B': 'Taichung City', 'C': 'Keelung City',
            'D': 'Tainan City', 'E': 'Kaohsiung City', 'F': 'New Taipei City',
            'G': 'Yilan County', 'H': 'Taoyuan City', 'I': 'Chiayi City',
            'J': 'Hsinchu County', 'K': 'Miaoli County', 'L': 'Taichung County',
            'M': 'Nantou County', 'N': 'Changhua County', 'O': 'Yunlin County',
            'P': 'Chiayi County', 'Q': 'Tainan County', 'R': 'Kaohsiung County',
            'S': 'Pingtung County', 'T': 'Taitung County', 'U': 'Hualien County',
            'V': 'Penghu County', 'W': 'Kinmen County', 'X': 'Lienchiang County',
            'Y': 'Yangmingshan', 'Z': 'Foreigner'
        };
        return regions[letter] || 'Unknown';
    }
}

export const NationalIDAlias = aliasOf(NationalID);