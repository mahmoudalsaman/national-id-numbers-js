# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.4.0] - 2025-01-14

### Added
- **Poland (PL) Support**: Added PESEL validation and parsing
  - Format: `12345678903` (11 digits)
  - Length: 11 digits
  - Checksum: Modulo 10 algorithm with weights [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
  - Parsing: Extracts number, gender, birth date, year, month, and day
  - Gender Detection: Based on 10th digit (odd = male, even = female)
  - Birth Date: Supports multiple centuries (1800s, 1900s, 2000s, 2100s, 2200s)
  - Validation: Supports Polish PESEL format
  - Names: PESEL, Polish National Identification Number, Universal Electronic System for Registration of Population

### Changed
- **README.md**: Updated country tables to include Poland
- **Country Count**: Increased from 36 to 37 countries

### Technical Details
- **Algorithm**: Modulo 10 checksum with specific weights
- **Century Detection**: Month-based century determination
- **Gender Detection**: 10th digit parity check
- **Date Parsing**: Full birth date extraction with century handling

## [1.3.0] - 2025-01-14

### Added
- **Netherlands (NL) Support**: Added BSN validation and parsing
  - Format: `123456782` (9 digits)
  - Length: 9 digits
  - Checksum: Modulo 11 algorithm with weights [9, 8, 7, 6, 5, 4, 3, 2, -1]
  - Parsing: Extracts number and basic information
  - Validation: Supports Dutch BSN format
  - Names: BSN, Burgerservicenummer, Dutch Social Security Number

### Changed
- **README.md**: Updated country tables to include Netherlands
- **Country Count**: Now supports 36 countries (was 35)
- **Minor Version**: Bumped to 1.3.0 for new feature

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [1.2.0] - 2025-01-14

### Added
- **Sweden (SE) Support**: Added Personnummer validation and parsing
  - Format: `123456-7893` or `123456+7893` (11 characters)
  - Length: 11 characters
  - Checksum: Luhn algorithm for validation
  - Parsing: Extracts number, gender, birth date, and individual number
  - Gender Detection: Based on 3rd digit of individual number (even = female, odd = male)
  - Validation: Supports Swedish Personnummer format with separators
  - Names: Personnummer, Swedish Personal Number, Personal Identity Number

### Changed
- **README.md**: Updated country tables to include Sweden
- **Country Count**: Now supports 35 countries (was 34)
- **Minor Version**: Bumped to 1.2.0 for new feature

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [1.1.0] - 2025-01-14

### Added
- **Norway (NO) Support**: Added Fødselsnummer validation and parsing
  - Format: `12345678901` (11 digits)
  - Length: 11 digits
  - Checksum: Modulo 11 algorithm with weights [3, 7, 6, 1, 8, 9, 4, 5, 2]
  - Parsing: Extracts number, gender, birth date, and individual number
  - Gender Detection: Based on 3rd digit of individual number (even = female, odd = male)
  - Validation: Supports Norwegian Fødselsnummer format
  - Names: Fødselsnummer, Norwegian Personal Number, Birth Number

### Changed
- **README.md**: Updated country tables to include Norway
- **Country Count**: Now supports 34 countries (was 33)
- **Minor Version**: Bumped to 1.1.0 for new feature

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [1.0.0] - 2025-01-14

### Added
- **Finland (FI) Support**: Added Henkilötunnus validation and parsing
  - Format: `123456-789A`, `123456+789B`, or `123456A789C` (11 characters)
  - Length: 11 characters
  - Checksum: Basic validation (accepts all valid format numbers)
  - Parsing: Extracts number and basic information
  - Validation: Supports Finnish Henkilötunnus format
  - Names: Henkilötunnus, Personal Identity Code, Finnish Personal ID

### Changed
- **README.md**: Updated country tables to include Finland
- **Country Count**: Now supports 33 countries (was 32)
- **Major Version**: Bumped to 1.0.0 for stable release

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.9.0] - 2025-09-14

### Added
- **Denmark (DK) Support**: Added CPR Number validation and parsing
  - Format: `1234567890` or `123456-7890` (10 digits with optional dash)
  - Length: 10-11 characters (with optional dash)
  - Checksum: Basic validation (accepts all 10-digit numbers)
  - Parsing: Extracts number and basic information
  - Validation: Supports Danish CPR Number format
  - Names: CPR Number, Central Person Register, Personnummer

### Changed
- **README.md**: Updated country tables to include Denmark
- **Country Count**: Now supports 32 countries (was 31)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.8.0] - 2025-01-14

### Added
- **Bulgaria (BG) Support**: Added EGN (ЕГН) validation and parsing
  - Format: `1234567890` (10 digits)
  - Length: 10 digits
  - Checksum: Basic validation (accepts all 10-digit numbers)
  - Parsing: Extracts number and basic information
  - Validation: Supports Bulgarian EGN format
  - Names: ЕГН, EGN, Единен граждански номер, Unified Civil Number

### Changed
- **README.md**: Updated country tables to include Bulgaria
- **Country Count**: Now supports 31 countries (was 30)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.7.0] - 2025-01-14

### Added
- **Belgium (BE) Support**: Added National Number (Rijksregisternummer) validation and parsing
  - Format: `12345678901` (11 digits)
  - Length: 11 digits
  - Checksum: Basic validation (accepts all 11-digit numbers)
  - Parsing: Extracts number and basic information
  - Validation: Supports Belgian National Number format
  - Names: National Number, Rijksregisternummer, Numéro National

### Changed
- **README.md**: Updated country tables to include Belgium
- **Country Count**: Now supports 30 countries (was 29)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.6.0] - 2025-01-14

### Added
- **Austria (AT) Support**: Added Personalausweis (Austrian ID Card) validation and parsing
  - Format: `1234567890` (10 digits)
  - Length: 10 digits
  - Checksum: Basic validation (accepts all 10-digit numbers)
  - Parsing: Extracts number and basic information
  - Validation: Supports Austrian Personalausweis format
  - Names: Personalausweis, Austrian ID Card, Österreichischer Personalausweis

### Changed
- **README.md**: Updated country tables to include Austria
- **Country Count**: Now supports 29 countries (was 28)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.5.0] - 2025-01-14

### Added
- **Argentina (AR) Support**: Added DNI (Documento Nacional de Identidad) validation and parsing
  - Format: `12.345.678` or `12345678` (7-8 digits)
  - Length: 7-8 digits
  - Checksum: Modulo 11 algorithm
  - Parsing: Extracts number and basic information
  - Validation: Supports both dotted and non-dotted formats

### Changed
- **README.md**: Updated country tables to include Argentina
- **Country Count**: Now supports 28 countries (was 27)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.4.0] - 2025-01-14

### Added
- **Canada (CA) Support**: Added SIN (Social Insurance Number) validation and parsing
  - Format: `123-456-789`
  - Length: 9 digits
  - Checksum: Luhn Algorithm
  - Parsing: Extracts area, group, and serial numbers
  - Validation: Prevents invalid sequences (000, 666, 900-999)

### Changed
- **README.md**: Updated country tables to include Canada
- **Country Count**: Now supports 27 countries (was 26)

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.3.0] - 2025-01-14

### Added
- **Brazil (BR) Support**: Added CPF (Cadastro de Pessoas Físicas) validation and parsing
  - Format: `123.456.789-09`
  - Length: 11 digits
  - Checksum: Modulo 11 with special rules
  - Parsing: Extracts region, sequence, and check digits
- **Comprehensive Documentation**: Added detailed contributing guide
  - `CONTRIBUTING.md`: Step-by-step guide for adding new countries
  - Code structure examples and best practices
  - Research resources and testing requirements
- **Enhanced README**: Added detailed country tables
  - 26 implemented countries with full details
  - 55+ missing countries categorized by priority
  - Continent, ID type, format examples, and status columns
  - High priority and medium priority country lists

### Changed
- **README.md**: Completely restructured with comprehensive country tables
- **Documentation**: Enhanced with detailed examples and usage patterns

### Fixed
- Nothing in this release

### Security
- Nothing in this release

## [0.2.0] - Previous Release

### Added
- **Core Functionality**: Basic national ID validation and parsing system
- **25 Countries**: Initial support for major countries
  - Albania (AL): Identity Number
  - United Arab Emirates (AE): Emirates ID
  - Bangladesh (BD): National ID
  - China (CN): Resident ID
  - Germany (DE): Tax ID
  - Egypt (EG): National ID
  - Spain (ES): DNI
  - France (FR): INSEE
  - United Kingdom (GB): National Insurance
  - Indonesia (ID): National ID
  - India (IN): Aadhaar
  - Iran (IR): National ID
  - Italy (IT): Fiscal Code
  - Jordan (JO): National ID
  - Sri Lanka (LK): National ID
  - Malaysia (MY): NRIC
  - Nigeria (NG): National ID
  - Nepal (NP): National ID
  - Pakistan (PK): CNIC
  - Philippines (PH): PhilID
  - Saudi Arabia (SA): National ID
  - Thailand (TH): National ID
  - Turkey (TR): National ID
  - United States (US): Social Security
  - Vietnam (VN): National ID

### Features
- **NationalID Class**: Unified interface for all countries
- **Validation**: Format and checksum validation
- **Parsing**: Data extraction from ID numbers
- **Metadata**: Comprehensive metadata for each country
- **Testing**: Complete test suite with 123 tests
- **Modular Design**: Easy to add new countries

### Technical Details
- **ES Modules**: Modern JavaScript module system
- **TypeScript Ready**: Full type definitions
- **Zero Dependencies**: No external dependencies
- **Cross Platform**: Works in Node.js and browsers
- **Performance**: Optimized regex patterns and algorithms

## [0.1.0] - Initial Release

### Added
- **Project Setup**: Initial project structure
- **Basic Validation**: Core validation framework
- **Documentation**: Basic README and examples
- **Testing**: Initial test setup

---

## Version History Summary

| Version | Date | Countries | Major Features |
|---------|------|-----------|----------------|
| 1.4.0 | 2025-01-14 | 37 | Poland PESEL support |
| 1.3.0 | 2025-01-14 | 36 | Netherlands BSN support |
| 1.2.0 | 2025-01-14 | 35 | Sweden Personnummer support |
| 1.1.0 | 2025-01-14 | 34 | Norway Fødselsnummer support |
| 1.0.0 | 2025-01-14 | 33 | Finland Henkilötunnus support, stable release |
| 0.9.0 | 2025-01-14 | 32 | Denmark CPR Number support |
| 0.8.0 | 2025-01-14 | 31 | Bulgaria EGN support |
| 0.7.0 | 2025-01-14 | 30 | Belgium National Number support |
| 0.6.0 | 2025-01-14 | 29 | Austria Personalausweis support |
| 0.5.0 | 2025-01-14 | 28 | Argentina DNI support |
| 0.4.0 | 2025-01-14 | 27 | Canada SIN support |
| 0.3.0 | 2025-01-14 | 26 | Brazil support, comprehensive docs, country tables |
| 0.2.0 | Previous | 25 | Core functionality, 25 countries, unified API |
| 0.1.0 | Initial | 0 | Project setup, basic framework |

## Contributing

When adding new features or countries, please update this changelog following the format above. Include:

1. **Version number** with date
2. **Added**: New features, countries, or functionality
3. **Changed**: Modifications to existing functionality
4. **Deprecated**: Soon-to-be removed features
5. **Removed**: Removed features
6. **Fixed**: Bug fixes
7. **Security**: Security improvements

## Release Process

1. Update version in `package.json`
2. Update this `CHANGELOG.md`
3. Create git tag: `git tag v0.x.x`
4. Push changes: `git push origin main --tags`
5. Publish to npm: `npm publish`

---

*This changelog is automatically maintained. Please keep it updated with each release.*
