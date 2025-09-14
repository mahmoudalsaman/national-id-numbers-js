# national-id-numbers

A collection of validators and parsers for national identification numbers.

## Installation

```bash
npm install national-id-numbers
```

## Usage

Use the `NationalID` class to validate or parse identifiers by passing a
two-letter ISO country code and the ID number:

```javascript
import { NationalID } from 'national-id-numbers';

NationalID.validate('EG', '29001010100015'); // true
const info = NationalID.parse('EG', '29001010100015');
console.log(info.governorate); // '01'

NationalID.validate('US', '012-12-0928'); // true
```

Alternatively, import specific country modules and call their exports
directly:

```javascript
import { EGY, USA } from 'national-id-numbers';

EGY.NationalID.validate('29001010100015');
USA.SocialSecurityNumber.validate('012-12-0928');

```

You can also import individual modules via sub-paths:

```javascript
import { SocialSecurityNumber } from 'national-id-numbers/nationalid/usa/social_security.js';
```

Constants and utility helpers are exported from the package as well:

```javascript
import { Gender, validateRegexp } from 'national-id-numbers';
```

## Supported Countries

### Currently Implemented (27 countries)

| Country | Code | Continent | ID Type | Format Example | Status |
|---------|------|-----------|---------|----------------|--------|
| Albania | AL | Europe | Identity Number | 1234567890123 | ✅ Implemented |
| United Arab Emirates | AE | Asia | Emirates ID | 784-1234-5678901-2 | ✅ Implemented |
| Bangladesh | BD | Asia | National ID | 1234567890123 | ✅ Implemented |
| China | CN | Asia | Resident ID | 110101199001011234 | ✅ Implemented |
| Germany | DE | Europe | Tax ID | 12345678901 | ✅ Implemented |
| Egypt | EG | Africa | National ID | 29001010100015 | ✅ Implemented |
| Spain | ES | Europe | DNI | 12345678Z | ✅ Implemented |
| France | FR | Europe | INSEE | 1234567890123 | ✅ Implemented |
| United Kingdom | GB | Europe | National Insurance | AB123456C | ✅ Implemented |
| Indonesia | ID | Asia | National ID | 1234567890123456 | ✅ Implemented |
| India | IN | Asia | Aadhaar | 123456789012 | ✅ Implemented |
| Iran | IR | Asia | National ID | 1234567890 | ✅ Implemented |
| Italy | IT | Europe | Fiscal Code | RSSMRA80A01H501U | ✅ Implemented |
| Jordan | JO | Asia | National ID | 1234567890 | ✅ Implemented |
| Sri Lanka | LK | Asia | National ID | 123456789V | ✅ Implemented |
| Malaysia | MY | Asia | NRIC | 123456-12-1234 | ✅ Implemented |
| Nigeria | NG | Africa | National ID | 12345678901 | ✅ Implemented |
| Nepal | NP | Asia | National ID | 1234567890123 | ✅ Implemented |
| Pakistan | PK | Asia | CNIC | 12345-1234567-1 | ✅ Implemented |
| Philippines | PH | Asia | PhilID | 1234-5678-9012 | ✅ Implemented |
| Saudi Arabia | SA | Asia | National ID | 1234567890 | ✅ Implemented |
| Thailand | TH | Asia | National ID | 1234567890123 | ✅ Implemented |
| Turkey | TR | Asia | National ID | 12345678901 | ✅ Implemented |
| United States | US | North America | Social Security | 123-45-6789 | ✅ Implemented |
| Vietnam | VN | Asia | National ID | 123456789 | ✅ Implemented |
| Brazil | BR | South America | CPF | 123.456.789-09 | ✅ Implemented |
| Canada | CA | North America | SIN | 123-456-789 | ✅ Implemented |

### Missing Countries (High Priority)

| Country | Code | Continent | ID Type | Format Example | Status |
|---------|------|-----------|---------|----------------|--------|
| Argentina | AR | South America | DNI | 12.345.678 | ❌ Missing |
| Australia | AU | Oceania | TFN | 123 456 789 | ❌ Missing |
| Austria | AT | Europe | Personalausweis | 1234567890 | ❌ Missing |
| Belgium | BE | Europe | National Number | 12.34.56-789.01 | ❌ Missing |
| Bulgaria | BG | Europe | ЕГН | 1234567890 | ❌ Missing |
| Chile | CL | South America | RUT | 12.345.678-9 | ❌ Missing |
| Colombia | CO | South America | Cédula | 1234567890 | ❌ Missing |
| Croatia | HR | Europe | OIB | 12345678901 | ❌ Missing |
| Czech Republic | CZ | Europe | Rodné číslo | 1234567890 | ❌ Missing |
| Denmark | DK | Europe | CPR Number | 123456-7890 | ❌ Missing |
| Estonia | EE | Europe | Isikukood | 12345678901 | ❌ Missing |
| Finland | FI | Europe | Henkilötunnus | 123456-789A | ❌ Missing |
| Greece | GR | Europe | AMKA | 12345678901 | ❌ Missing |
| Hungary | HU | Europe | Személyi szám | 12345678901 | ❌ Missing |
| Ireland | IE | Europe | PPS Number | 1234567T | ❌ Missing |
| Japan | JP | Asia | My Number | 1234-5678-9012 | ❌ Missing |
| Latvia | LV | Europe | Personas kods | 123456-78901 | ❌ Missing |
| Lithuania | LT | Europe | Asmens kodas | 12345678901 | ❌ Missing |
| Luxembourg | LU | Europe | National Number | 1234567890123 | ❌ Missing |
| Malta | MT | Europe | ID Card Number | 123456M | ❌ Missing |
| Mexico | MX | North America | CURP | ABCD123456HDFABC01 | ❌ Missing |
| Netherlands | NL | Europe | BSN | 123456789 | ❌ Missing |
| New Zealand | NZ | Oceania | IRD Number | 123-456-789 | ❌ Missing |
| Norway | NO | Europe | Fødselsnummer | 12345678901 | ❌ Missing |
| Poland | PL | Europe | PESEL | 12345678901 | ❌ Missing |
| Portugal | PT | Europe | Número de Identificação Civil | 123456789 | ❌ Missing |
| Romania | RO | Europe | CNP | 1234567890123 | ❌ Missing |
| Russia | RU | Europe | СНИЛС | 123-456-789 01 | ❌ Missing |
| Singapore | SG | Asia | NRIC | S1234567A | ❌ Missing |
| South Korea | KR | Asia | 주민등록번호 | 123456-1234567 | ❌ Missing |
| Sweden | SE | Europe | Personnummer | 123456-7890 | ❌ Missing |
| Switzerland | CH | Europe | AHV Number | 756.1234.5678.90 | ❌ Missing |
| Taiwan | TW | Asia | 身分證字號 | A123456789 | ❌ Missing |

### Missing Countries (Medium Priority)

| Country | Code | Continent | ID Type | Format Example | Status |
|---------|------|-----------|---------|----------------|--------|
| Algeria | DZ | Africa | CIN | 1234567890123456 | ❌ Missing |
| Ghana | GH | Africa | Ghana Card | GHA-123456789-1 | ❌ Missing |
| Kenya | KE | Africa | National ID | 12345678 | ❌ Missing |
| Libya | LY | Africa | National ID | 1234567890 | ❌ Missing |
| Morocco | MA | Africa | CIN | AB123456 | ❌ Missing |
| South Africa | ZA | Africa | ID Number | 1234567890123 | ❌ Missing |
| Sudan | SD | Africa | National ID | 1234567890 | ❌ Missing |
| Tunisia | TN | Africa | CIN | 12345678 | ❌ Missing |
| Kazakhstan | KZ | Asia | ИИН | 123456789012 | ❌ Missing |
| Uzbekistan | UZ | Asia | JSHSHIR | 12345678901234 | ❌ Missing |
| Hong Kong | HK | Asia | HKID | A123456(7) | ❌ Missing |
| Iceland | IS | Europe | Kennitala | 123456-7890 | ❌ Missing |
| Slovakia | SK | Europe | Rodné číslo | 1234567890 | ❌ Missing |
| Slovenia | SI | Europe | EMŠO | 1234567890123 | ❌ Missing |

## Contributing

Want to add support for a new country? Check out our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

## Testing

```bash
npm test
```

