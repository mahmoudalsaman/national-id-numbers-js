# idnumbers-js

A collection of validators and parsers for national identification numbers.

## Installation

```bash
npm install idnumbers-js
```

## Usage

Use the `NationalID` class to validate or parse identifiers by passing a
two-letter ISO country code and the ID number:

```javascript
import { NationalID } from 'idnumbers-js';

NationalID.validate('EG', '29001010100015'); // true
const info = NationalID.parse('EG', '29001010100015');
console.log(info.governorate); // '01'

NationalID.validate('US', '012-12-0928'); // true
```

Alternatively, import specific country modules and call their exports
directly:

```javascript
import { EGY, USA } from 'idnumbers-js';

EGY.NationalID.validate('29001010100015');
USA.SocialSecurityNumber.validate('012-12-0928');
=======
Import the country modules you need from the package and use their `validate` or `parse` methods:

```javascript
import { EGY, USA } from 'idnumbers-js';

// validate an Egyptian national ID
EGY.NationalID.validate('29001010100015'); // true

// parse the ID and inspect its components
const info = EGY.NationalID.parse('29001010100015');
console.log(info.yyyymmdd); // Date object for 1990-01-01
console.log(info.governorate); // '01'

// validate a US Social Security Number
USA.SocialSecurityNumber.validate('012-12-0928'); // true
```

You can also import individual modules via sub-paths:

```javascript
import { SocialSecurityNumber } from 'idnumbers-js/nationalid/usa/social_security.js';
```

Constants and utility helpers are exported from the package as well:

```javascript
import { Gender, validateRegexp } from 'idnumbers-js';
```

## Testing

```bash
npm test
```

