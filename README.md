# 🌍 National ID Numbers

[![npm version](https://img.shields.io/npm/v/national-id-numbers.svg?style=flat-square)](https://www.npmjs.com/package/national-id-numbers)
[![npm downloads](https://img.shields.io/npm/dm/national-id-numbers.svg?style=flat-square)](https://www.npmjs.com/package/national-id-numbers)
[![GitHub stars](https://img.shields.io/github/stars/mahmoudalsaman/national-id-numbers-js.svg?style=flat-square)](https://github.com/mahmoudalsaman/national-id-numbers-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/national-id-numbers.svg?style=flat-square)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

> A comprehensive collection of validators and parsers for national identification numbers from around the world. Validate, parse, and extract information from ID numbers with ease.

## ✨ Features

- 🌍 **27 Countries Supported** - Comprehensive coverage across 6 continents
- 🔍 **Smart Validation** - Advanced algorithms including Luhn, Modulo 11, and custom checksums
- 📊 **Data Extraction** - Parse birth dates, gender, regions, and more from ID numbers
- 🚀 **Zero Dependencies** - Lightweight and fast with no external dependencies
- 📱 **Universal Support** - Works in Node.js, browsers, and modern JavaScript environments
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Well Tested** - 131+ tests ensuring reliability and accuracy
- 📚 **Well Documented** - Comprehensive documentation and examples

## 🚀 Quick Start

### Installation

```bash
npm install national-id-numbers
```

### Basic Usage

```javascript
import { NationalID } from 'national-id-numbers';

// Validate any national ID
const isValid = NationalID.validate('EG', '29001010100015'); // true

// Parse and extract information
const info = NationalID.parse('EG', '29001010100015');
console.log(info);
// {
//   yyyymmdd: Date object,
//   governorate: '01',
//   sn: '0001',
//   gender: 'MALE',
//   checksum: 5
// }
```

### Country-Specific Usage

```javascript
import { EGY, USA, CA } from 'national-id-numbers';

// Egyptian National ID
EGY.NationalID.validate('29001010100015'); // true
const egyptInfo = EGY.NationalID.parse('29001010100015');

// US Social Security Number
USA.SocialSecurityNumber.validate('123-45-6789'); // true

// Canadian Social Insurance Number
CA.SocialInsuranceNumber.validate('130-692-544'); // true
const canadaInfo = CA.SocialInsuranceNumber.parse('130-692-544');
// { area: '130', group: '692', serial: '544', gender: 'UNKNOWN' }
```

## 🌍 Supported Countries

### 🇪🇺 Europe (16 countries)
| Country | Code | ID Type | Format | Example | Features |
|---------|------|---------|--------|---------|----------|
| 🇦🇱 Albania | AL | Identity Number | 13 digits | `1234567890123` | ✅ Validation |
| 🇦🇹 Austria | AT | Personalausweis | 10 digits | `1234567890` | ✅ Parse + Validation |
| 🇧🇪 Belgium | BE | National Number | 11 digits | `12345678901` | ✅ Parse + Validation |
| 🇧🇬 Bulgaria | BG | EGN | 10 digits | `1234567890` | ✅ Parse + Validation |
| 🇩🇰 Denmark | DK | CPR Number | 10 digits | `123456-7890` | ✅ Parse + Validation |
| 🇫🇮 Finland | FI | Henkilötunnus | 11 chars | `123456-789A` | ✅ Parse + Validation |
| 🇩🇪 Germany | DE | Tax ID | 11 digits | `12345678901` | ✅ Validation |
| 🇪🇸 Spain | ES | DNI | 8 digits + letter | `12345678Z` | ✅ Validation |
| 🇫🇷 France | FR | INSEE | 13 digits | `1234567890123` | ✅ Parse + Validation |
| 🇬🇧 United Kingdom | GB | National Insurance | 9 chars | `AB123456C` | ✅ Validation |
| 🇮🇹 Italy | IT | Fiscal Code | 16 chars | `RSSMRA80A01H501U` | ✅ Parse + Validation |
| 🇮🇷 Iran | IR | National ID | 10 digits | `1234567890` | ✅ Validation |
| 🇯🇴 Jordan | JO | National ID | 10 digits | `1234567890` | ✅ Validation |
| 🇱🇰 Sri Lanka | LK | National ID | 10 digits + letter | `123456789V` | ✅ Parse + Validation |
| 🇹🇷 Turkey | TR | National ID | 11 digits | `12345678901` | ✅ Validation |

### 🌏 Asia (12 countries)
| Country | Code | ID Type | Format | Example | Features |
|---------|------|---------|--------|---------|----------|
| 🇦🇪 UAE | AE | Emirates ID | 15 digits | `784-1234-5678901-2` | ✅ Parse + Validation |
| 🇧🇩 Bangladesh | BD | National ID | 13 digits | `1234567890123` | ✅ Parse + Validation |
| 🇨🇳 China | CN | Resident ID | 18 digits | `110101199001011234` | ✅ Parse + Validation |
| 🇮🇩 Indonesia | ID | National ID | 16 digits | `1234567890123456` | ✅ Parse + Validation |
| 🇮🇳 India | IN | Aadhaar | 12 digits | `123456789012` | ✅ Validation |
| 🇲🇾 Malaysia | MY | NRIC | 12 digits | `123456-12-1234` | ✅ Parse + Validation |
| 🇳🇵 Nepal | NP | National ID | 13 digits | `1234567890123` | ✅ Validation |
| 🇵🇰 Pakistan | PK | CNIC | 13 digits | `12345-1234567-1` | ✅ Parse + Validation |
| 🇵🇭 Philippines | PH | PhilID | 12 digits | `1234-5678-9012` | ✅ Validation |
| 🇸🇦 Saudi Arabia | SA | National ID | 10 digits | `1234567890` | ✅ Parse + Validation |
| 🇹🇭 Thailand | TH | National ID | 13 digits | `1234567890123` | ✅ Parse + Validation |
| 🇻🇳 Vietnam | VN | National ID | 9 digits | `123456789` | ✅ Parse + Validation |

### 🌍 Africa (3 countries)
| Country | Code | ID Type | Format | Example | Features |
|---------|------|---------|--------|---------|----------|
| 🇪🇬 Egypt | EG | National ID | 14 digits | `29001010100015` | ✅ Parse + Validation |
| 🇳🇬 Nigeria | NG | National ID | 11 digits | `12345678901` | ✅ Validation |
| 🇱🇾 Libya | LY | National ID | 10 digits | `1234567890` | ✅ Validation |

### 🌎 Americas (4 countries)
| Country | Code | ID Type | Format | Example | Features |
|---------|------|---------|--------|---------|----------|
| 🇺🇸 United States | US | Social Security | 9 digits | `123-45-6789` | ✅ Validation |
| 🇧🇷 Brazil | BR | CPF | 11 digits | `123.456.789-09` | ✅ Parse + Validation |
| 🇨🇦 Canada | CA | SIN | 9 digits | `123-456-789` | ✅ Parse + Validation |
| 🇦🇷 Argentina | AR | DNI | 7-8 digits | `12.345.678` | ✅ Parse + Validation |

## 📖 Advanced Usage

### Direct Module Imports

```javascript
// Import specific country modules
import { SocialSecurityNumber } from 'national-id-numbers/nationalid/usa/social_security.js';
import { NationalID as EgyptianID } from 'national-id-numbers/nationalid/egy/national_id.js';

// Use directly
SocialSecurityNumber.validate('123-45-6789');
const egyptInfo = EgyptianID.parse('29001010100015');
```

### Utility Functions

```javascript
import { Gender, validateRegexp, luhnDigit } from 'national-id-numbers';

// Use utility functions
const isValidFormat = validateRegexp('123-45-6789', /^\d{3}-\d{2}-\d{4}$/);
const checkDigit = luhnDigit([1, 2, 3, 4, 5, 6, 7, 8, 9]);
```

### Error Handling

```javascript
import { NationalID } from 'national-id-numbers';

try {
  const isValid = NationalID.validate('XX', '123456789');
} catch (error) {
  console.error('Unsupported country:', error.message);
  // "Unsupported country: XX"
}

try {
  const info = NationalID.parse('EG', 'invalid-id');
} catch (error) {
  console.error('Parsing failed:', error.message);
  // "Parsing not supported for country code: EG"
}
```

## 🔧 API Reference

### NationalID Class

#### `NationalID.validate(countryCode, idNumber)`
Validates a national ID number for the specified country.

**Parameters:**
- `countryCode` (string): Two-letter ISO country code
- `idNumber` (string): The ID number to validate

**Returns:** `boolean` - `true` if valid, `false` otherwise

#### `NationalID.parse(countryCode, idNumber)`
Parses a national ID number and extracts information.

**Parameters:**
- `countryCode` (string): Two-letter ISO country code
- `idNumber` (string): The ID number to parse

**Returns:** `object|null` - Parsed data object or `null` if invalid

### Country Modules

Each country module exports:
- `NationalID` class (or specific class name)
- `METADATA` object with country information
- Validation and parsing methods

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific country tests
npm test -- test/egy.test.js
npm test -- test/ca.test.js

# Run with coverage
npm run test:coverage
```

## 📊 Statistics

- **Total Countries**: 27 implemented
- **Total Tests**: 131+ tests
- **Coverage**: 6 continents
- **Bundle Size**: ~15KB (minified)
- **Zero Dependencies**: No external packages required

## 🚧 Roadmap

### High Priority Countries
- 🇦🇷 Argentina (DNI)
- 🇦🇺 Australia (TFN)
- 🇦🇹 Austria (Personalausweis)
- 🇧🇪 Belgium (National Number)
- 🇧🇬 Bulgaria (ЕГН)
- 🇨🇱 Chile (RUT)
- 🇨🇴 Colombia (Cédula)
- 🇭🇷 Croatia (OIB)
- 🇨🇿 Czech Republic (Rodné číslo)
- 🇩🇰 Denmark (CPR Number)
- 🇪🇪 Estonia (Isikukood)
- 🇫🇮 Finland (Henkilötunnus)
- 🇬🇷 Greece (AMKA)
- 🇭🇺 Hungary (Személyi szám)
- 🇮🇪 Ireland (PPS Number)
- 🇯🇵 Japan (My Number)
- 🇱🇻 Latvia (Personas kods)
- 🇱🇹 Lithuania (Asmens kodas)
- 🇱🇺 Luxembourg (National Number)
- 🇲🇹 Malta (ID Card Number)
- 🇲🇽 Mexico (CURP)
- 🇳🇱 Netherlands (BSN)
- 🇳🇿 New Zealand (IRD Number)
- 🇳🇴 Norway (Fødselsnummer)
- 🇵🇱 Poland (PESEL)
- 🇵🇹 Portugal (Número de Identificação Civil)
- 🇷🇴 Romania (CNP)
- 🇷🇺 Russia (СНИЛС)
- 🇸🇬 Singapore (NRIC)
- 🇰🇷 South Korea (주민등록번호)
- 🇸🇪 Sweden (Personnummer)
- 🇨🇭 Switzerland (AHV Number)
- 🇹🇼 Taiwan (身分證字號)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-country`
3. Add your country implementation
4. Add comprehensive tests
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Contributors who helped implement various countries
- Open source community for inspiration and feedback
- Government documentation for accurate validation rules

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/mahmoudalsaman/national-id-numbers-js/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/mahmoudalsaman/national-id-numbers-js/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mahmoudalsaman/national-id-numbers-js/discussions)

---

<div align="center">

**Made with ❤️ for developers worldwide**

[⭐ Star this repo](https://github.com/mahmoudalsaman/national-id-numbers-js) • [🐛 Report Bug](https://github.com/mahmoudalsaman/national-id-numbers-js/issues) • [💡 Request Feature](https://github.com/mahmoudalsaman/national-id-numbers-js/issues)

</div>