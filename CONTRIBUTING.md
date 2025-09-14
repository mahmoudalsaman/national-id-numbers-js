# Contributing Guide - Adding New Countries

This guide explains how to add support for new countries to the national-id-numbers package.

## Table of Contents
- [Overview](#overview)
- [Required Information](#required-information)
- [Step-by-Step Process](#step-by-step-process)
- [Code Structure](#code-structure)
- [Testing Requirements](#testing-requirements)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

The national-id-numbers package supports validation and parsing of national identification numbers from various countries. Each country implementation follows a consistent pattern and structure.

## Required Information

Before implementing a new country, you need to research and gather the following information:

### Basic Information
- **Country Code**: ISO 3166-1 alpha-2 (e.g., BR, AR, CA)
- **ID Name**: Official name of the national ID
- **Format**: How the number appears (digits, dashes, dots, spaces)
- **Length**: Minimum and maximum number of digits/characters

### Technical Details
- **Regular Expression**: Pattern to validate the format
- **Checksum Algorithm**: How to verify the number's validity
- **Encoded Data**: What information is stored in the number

### Common Encoded Data
- Date of birth
- Gender
- Region/Province
- Sequential number
- Check digits

## Step-by-Step Process

### 1. Create Directory Structure
```bash
mkdir src/nationalid/[country_code]
```

### 2. Create National ID File
Create `src/nationalid/[country_code]/national_id.js`:

```javascript
import { Gender } from '../constant.js';
import { validateRegexp, luhnDigit } from '../util.js';

const REGEXP = /^your_regex_pattern$/;

export class NationalID {
  static METADATA = {
    iso3166_alpha2: 'XX',
    min_length: 0,
    max_length: 0,
    parsable: true/false,
    checksum: true/false,
    regexp: REGEXP,
    alias_of: null,
    names: ['ID Name', 'Local Name'],
    links: ['Wikipedia Link'],
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

    // Validate checksum if applicable
    if (this.METADATA.checksum && !this.checksum(idNumber)) {
      return null;
    }

    // Extract and return data
    return {
      // Parsed data fields
    };
  }

  static checksum(idNumber) {
    // Implement checksum validation
    // Return true if valid, false otherwise
  }
}
```

### 3. Create Test File
Create `test/[country_code].test.js`:

```javascript
import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/[country_code]/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid [Country] ID numbers', () => {
  assert.strictEqual(NationalID.validate('valid-number'), true);
  // Add more valid test cases
});

test('invalid [Country] ID numbers', () => {
  assert.strictEqual(NationalID.validate('invalid-number'), false);
  // Add more invalid test cases
});

test('parse [Country] ID', () => {
  const result = NationalID.parse('valid-number');
  assert.ok(result);
  // Test parsed data
});

test('with regexp', () => {
  assert.match('valid-number', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
  assert.strictEqual(NationalID.METADATA.iso3166_alpha2, 'XX');
  // Test other metadata properties
});
```

### 4. Update Main Index File
Update `src/index.js`:

```javascript
// Add import
import * as XX from './nationalid/[country_code]/national_id.js';

// Add to COUNTRY_MODULES
const COUNTRY_MODULES = {
  // ... existing countries
  XX: XX,
};

// Add to exports
export {
  // ... existing countries
  XX,
};
```

### 5. Run Tests
```bash
npm test
```

## Code Structure

### Metadata Object
Each implementation must include a `METADATA` object with:

- `iso3166_alpha2`: Two-letter country code
- `min_length`: Minimum number length
- `max_length`: Maximum number length
- `parsable`: Whether the number can be parsed for data
- `checksum`: Whether the number has a checksum
- `regexp`: Regular expression for format validation
- `alias_of`: Reference to another class (if applicable)
- `names`: Array of names for the ID type
- `links`: Array of relevant links (Wikipedia, official docs)
- `deprecated`: Whether this implementation is deprecated

### Required Methods

#### `validate(idNumber)`
- Returns `true` if the number is valid, `false` otherwise
- Should check format and checksum (if applicable)

#### `parse(idNumber)`
- Returns parsed data object or `null` if invalid
- Should extract meaningful information from the number

#### `checksum(idNumber)` (if applicable)
- Returns `true` if checksum is valid, `false` otherwise
- Implements the specific checksum algorithm for the country

## Testing Requirements

### Test Cases
- **Valid numbers**: Include various valid examples
- **Invalid numbers**: Include format errors, checksum errors, edge cases
- **Parse functionality**: Test data extraction
- **Regex validation**: Test pattern matching
- **Metadata**: Verify all metadata properties

### Edge Cases
- Numbers with all same digits (often invalid)
- Numbers with leading/trailing zeros
- Numbers with special characters
- Empty or null inputs
- Numbers of wrong length

## Examples

### Brazil (CPF) - Implemented
```javascript
// Format: 123.456.789-09
// Length: 11 digits
// Checksum: Modulo 11 with special rules
```

### Argentina (DNI) - To Implement
```javascript
// Format: 12.345.678
// Length: 7-8 digits
// Checksum: Modulo 11
```

### Canada (SIN) - To Implement
```javascript
// Format: 123-456-789
// Length: 9 digits
// Checksum: Luhn Algorithm
```

## Best Practices

### Research
1. **Verify Information**: Cross-reference multiple sources
2. **Official Sources**: Use government websites when possible
3. **Wikipedia**: Good starting point, but verify details
4. **Existing Libraries**: Check similar implementations in other languages

### Code Quality
1. **Clear Comments**: Explain complex algorithms
2. **Error Handling**: Handle edge cases gracefully
3. **Performance**: Use efficient regex patterns
4. **Consistency**: Follow existing code patterns

### Testing
1. **Comprehensive**: Test all valid and invalid cases
2. **Real Examples**: Use actual valid numbers when possible
3. **Edge Cases**: Test boundary conditions
4. **Documentation**: Comment test cases for clarity

### Documentation
1. **Metadata**: Fill all required fields accurately
2. **Links**: Provide relevant Wikipedia or official links
3. **Names**: Include both English and local names
4. **Comments**: Explain complex logic

## Resources

### Useful Tools
- [ISO 3166-1 Country Codes](https://en.wikipedia.org/wiki/ISO_3166-1)
- [Regular Expression Tester](https://regex101.com/)
- [Wikipedia - National ID Numbers](https://en.wikipedia.org/wiki/National_identification_number)

### Research Sources
- Government official websites
- Wikipedia articles
- Academic papers
- Existing open-source implementations

## Getting Help

If you need help implementing a specific country:
1. Check existing implementations for reference
2. Research the country's official documentation
3. Look for similar implementations in other languages
4. Ask questions in the project's issue tracker

Remember: Accuracy is more important than speed. Take time to research and implement correctly.
