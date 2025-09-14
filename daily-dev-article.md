# 🌍 National ID Numbers: The Ultimate JavaScript Library for Global Identity Validation

## Introduction

In today's interconnected world, applications often need to handle users from different countries, each with their unique national identification systems. Whether you're building a fintech app, e-commerce platform, or any service requiring identity verification, validating national ID numbers can be a complex challenge.

Enter **national-id-numbers-js** - a comprehensive JavaScript library that simplifies national ID validation and parsing across 27 countries worldwide. This powerful tool eliminates the complexity of implementing country-specific validation algorithms and provides a unified API for global identity verification.

## 🚀 Why This Library Matters

### The Problem
- **Fragmented Solutions**: Most developers end up writing custom validation logic for each country
- **Complex Algorithms**: Each country uses different validation methods (Luhn, Modulo 11, custom checksums)
- **Maintenance Nightmare**: Keeping up with changing regulations and formats across countries
- **Data Extraction**: Extracting meaningful information (birth date, gender, region) from ID numbers

### The Solution
**national-id-numbers-js** provides:
- ✅ **Unified API** for all supported countries
- ✅ **Zero Dependencies** - lightweight and fast
- ✅ **TypeScript Support** - full type safety
- ✅ **Comprehensive Testing** - 131+ tests ensuring reliability
- ✅ **Data Extraction** - parse birth dates, gender, regions, and more

## 🌍 Global Coverage

The library supports **27 countries** across 6 continents:

### 🇪🇺 Europe (16 countries)
- Albania, Austria, Belgium, Bulgaria, Denmark, Finland, Germany, Spain, France, UK, Italy, Iran, Jordan, Sri Lanka, Turkey

### 🌏 Asia (12 countries)  
- UAE, Bangladesh, China, Indonesia, India, Malaysia, Nepal, Pakistan, Philippines, Saudi Arabia, Thailand, Vietnam

### 🌍 Africa (3 countries)
- Egypt, Nigeria, Libya

### 🌎 Americas (4 countries)
- United States, Brazil, Canada, Argentina

## 💻 Getting Started

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

## 🔧 Advanced Features

### Smart Validation Algorithms
The library implements various validation methods:
- **Luhn Algorithm** - Used by many countries for checksum validation
- **Modulo 11** - Common in European countries
- **Custom Checksums** - Country-specific validation rules
- **Format Validation** - Ensures proper structure and length

### Data Extraction Capabilities
Extract meaningful information from ID numbers:
- **Birth Date** - Parse birth year, month, and day
- **Gender** - Determine gender from ID number
- **Geographic Data** - Extract region, governorate, or area codes
- **Serial Numbers** - Get unique identifiers
- **Checksums** - Validate and extract check digits

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

## 🎯 Real-World Use Cases

### 1. E-commerce Platforms
```javascript
// Validate customer identity during registration
const customerCountry = 'EG';
const nationalId = '29001010100015';

if (NationalID.validate(customerCountry, nationalId)) {
  const customerInfo = NationalID.parse(customerCountry, nationalId);
  // Use customerInfo.gender, customerInfo.yyyymmdd for personalization
}
```

### 2. Financial Services
```javascript
// Verify identity for KYC (Know Your Customer) processes
const identityVerified = NationalID.validate('US', '123-45-6789');
if (identityVerified) {
  // Proceed with account creation
}
```

### 3. Government Services
```javascript
// Validate citizen information for government portals
const citizenInfo = NationalID.parse('SA', '1234567890');
if (citizenInfo) {
  // citizenInfo contains birth date, gender, and other details
}
```

## 📊 Performance & Reliability

- **Bundle Size**: ~15KB (minified)
- **Zero Dependencies**: No external packages required
- **131+ Tests**: Comprehensive test coverage
- **TypeScript Ready**: Full type definitions included
- **Universal Support**: Works in Node.js, browsers, and modern JavaScript environments

## 🛠️ Developer Experience

### TypeScript Support
```typescript
import { NationalID, Gender } from 'national-id-numbers';

interface ParsedID {
  yyyymmdd: Date;
  gender: Gender;
  // ... other properties
}

const result: ParsedID | null = NationalID.parse('EG', '29001010100015');
```

### Utility Functions
```javascript
import { validateRegexp, luhnDigit } from 'national-id-numbers';

// Use utility functions for custom validation
const isValidFormat = validateRegexp('123-45-6789', /^\d{3}-\d{2}-\d{4}$/);
const checkDigit = luhnDigit([1, 2, 3, 4, 5, 6, 7, 8, 9]);
```

## 🚧 Roadmap & Contributing

The library is actively maintained with plans to add more countries. High-priority additions include:
- Australia (TFN)
- Japan (My Number)
- Netherlands (BSN)
- Poland (PESEL)
- Sweden (Personnummer)
- And many more...

Contributions are welcome! The project follows clear guidelines for adding new countries and includes comprehensive testing requirements.

## 🎉 Conclusion

**national-id-numbers-js** is a game-changer for developers working with international applications. It eliminates the complexity of national ID validation while providing powerful data extraction capabilities. With support for 27 countries, zero dependencies, and comprehensive TypeScript support, it's the perfect solution for any project requiring global identity verification.

Whether you're building the next unicorn startup or maintaining enterprise applications, this library will save you countless hours of development time and ensure accurate, reliable identity validation across the globe.

### Get Started Today
```bash
npm install national-id-numbers
```

**GitHub**: [mahmoudalsaman/national-id-numbers-js](https://github.com/mahmoudalsaman/national-id-numbers-js)
**NPM**: [national-id-numbers](https://www.npmjs.com/package/national-id-numbers)

---

*Made with ❤️ for developers worldwide*

#JavaScript #TypeScript #Validation #NationalID #OpenSource #DeveloperTools #IdentityVerification #GlobalDevelopment
