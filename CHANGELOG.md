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
