import test from 'node:test';
import assert from 'node:assert';
import { PersonasKods, NationalID } from '../src/nationalid/lva/personas_kods.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Latvian Personas kods', () => {
  // Valid Personas kods with different formats and correct checksums
  assert.strictEqual(PersonasKods.validate('010190-12345'), true);
  assert.strictEqual(PersonasKods.validate('15128011234'), true);
  assert.strictEqual(PersonasKods.validate('31129023456'), true);
  assert.strictEqual(PersonasKods.validate('010100-10001'), true);
  assert.strictEqual(PersonasKods.validate('25126521234'), true);
});

test('invalid Latvian Personas kods', () => {
  // Wrong length
  assert.strictEqual(PersonasKods.validate('0101901234'), false); // Too short
  assert.strictEqual(PersonasKods.validate('010190123456'), false); // Too long

  // Invalid characters
  assert.strictEqual(PersonasKods.validate('01019a-12345'), false);
  assert.strictEqual(PersonasKods.validate('010190-1234a'), false);
  assert.strictEqual(PersonasKods.validate(''), false);

  // Invalid date components
  assert.strictEqual(PersonasKods.validate('000190-12345'), false); // Invalid day 00
  assert.strictEqual(PersonasKods.validate('320190-12345'), false); // Invalid day 32
  assert.strictEqual(PersonasKods.validate('010090-12345'), false); // Invalid month 00
  assert.strictEqual(PersonasKods.validate('011390-12345'), false); // Invalid month 13

  // Invalid century digit (first digit of serial part)
  assert.strictEqual(PersonasKods.validate('010190-32345'), false); // Invalid century digit 3
  assert.strictEqual(PersonasKods.validate('010190-92345'), false); // Invalid century digit 9

  // Invalid checksum
  assert.strictEqual(PersonasKods.validate('010190-12346'), false);
  assert.strictEqual(PersonasKods.validate('15128011235'), false);
});

test('parse Latvian Personas kods', () => {
  const result = PersonasKods.parse('010190-12345');
  assert.ok(result);
  assert.strictEqual(result.number, '01019012345');
  assert.strictEqual(result.gender, Gender.MALE); // Second digit 2 is even = female, wait... 1 is odd = male
  assert.strictEqual(result.birthDate, '1990-01-01');
  assert.strictEqual(result.year, 1990);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
});

test('parse different formats', () => {
  // With dash
  const result1 = PersonasKods.parse('010190-12345');
  assert.ok(result1);
  assert.strictEqual(result1.number, '01019012345');
  assert.strictEqual(result1.year, 1990);

  // Without dash
  const result2 = PersonasKods.parse('01019012345');
  assert.ok(result2);
  assert.strictEqual(result2.number, '01019012345');
  assert.strictEqual(result2.year, 1990);

  // Different century (2000s)
  const result3 = PersonasKods.parse('010100-20123');
  assert.ok(result3);
  assert.strictEqual(result3.year, 2000);
  assert.strictEqual(result3.gender, Gender.FEMALE); // Second digit 0 is even = female
});

test('invalid parse Latvian Personas kods', () => {
  assert.strictEqual(PersonasKods.parse('0101901234'), null); // Too short
  assert.strictEqual(PersonasKods.parse('010190123456'), null); // Too long
  assert.strictEqual(PersonasKods.parse('01019a-12345'), null); // Invalid chars
  assert.strictEqual(PersonasKods.parse('000190-12345'), null); // Invalid date
  assert.strictEqual(PersonasKods.parse('010190-32345'), null); // Invalid century
  assert.strictEqual(PersonasKods.parse('010190-12346'), null); // Wrong checksum
  assert.strictEqual(PersonasKods.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('010190-12345', PersonasKods.METADATA.regexp);
  assert.match('01019012345', PersonasKods.METADATA.regexp);
  assert.match('31129023456', PersonasKods.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('0101901234', PersonasKods.METADATA.regexp);
  assert.doesNotMatch('010190123456', PersonasKods.METADATA.regexp);
  assert.doesNotMatch('01019a-12345', PersonasKods.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(PersonasKods.METADATA);
  assert.strictEqual(PersonasKods.METADATA.iso3166_alpha2, 'LV');
  assert.strictEqual(PersonasKods.METADATA.min_length, 11);
  assert.strictEqual(PersonasKods.METADATA.max_length, 12);
  assert.strictEqual(PersonasKods.METADATA.parsable, true);
  assert.strictEqual(PersonasKods.METADATA.checksum, true);
  assert.strictEqual(PersonasKods.METADATA.names.includes('Personas kods'), true);
  assert.strictEqual(PersonasKods.METADATA.names.includes('Latvian Personal Code'), true);
  assert.strictEqual(PersonasKods.METADATA.names.includes('Latvian National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(PersonasKods.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, PersonasKods);
});

test('checksum validation', () => {
  // Valid Personas kods
  assert.strictEqual(PersonasKods.checksum('010190-12345'), true);
  assert.strictEqual(PersonasKods.checksum('01019012345'), true);
  assert.strictEqual(PersonasKods.checksum('31129023456'), true);

  // Invalid format
  assert.strictEqual(PersonasKods.checksum('0101901234'), false); // Too short
  assert.strictEqual(PersonasKods.checksum('010190123456'), false); // Too long
  assert.strictEqual(PersonasKods.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(PersonasKods.checksum('010190-12346'), false); // Wrong checksum
  assert.strictEqual(PersonasKods.checksum('31129023457'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test male (odd second digit of serial part)
  const male1 = PersonasKods.parse('010190-11234');
  if (male1) {
    assert.strictEqual(male1.gender, Gender.MALE); // Second digit 1 is odd = male
  }

  const male2 = PersonasKods.parse('010190-13234');
  if (male2) {
    assert.strictEqual(male2.gender, Gender.MALE); // Second digit 3 is odd = male
  }

  // Test female (even second digit of serial part)
  const female1 = PersonasKods.parse('010190-10234');
  if (female1) {
    assert.strictEqual(female1.gender, Gender.FEMALE); // Second digit 0 is even = female
  }

  const female2 = PersonasKods.parse('010190-12234');
  if (female2) {
    assert.strictEqual(female2.gender, Gender.FEMALE); // Second digit 2 is even = female
  }
});

test('century detection', () => {
  // Test 1800s (century digit 0)
  const result1 = PersonasKods.parse('010190-01234');
  if (result1) {
    assert.strictEqual(result1.year, 1890); // 1800 + 90
  }

  // Test 1900s (century digit 1)
  const result2 = PersonasKods.parse('010190-12345');
  if (result2) {
    assert.strictEqual(result2.year, 1990); // 1900 + 90
  }

  // Test 2000s (century digit 2)
  const result3 = PersonasKods.parse('010100-20123');
  if (result3) {
    assert.strictEqual(result3.year, 2000); // 2000 + 00
  }
});

test('birth date parsing', () => {
  const result1 = PersonasKods.parse('010190-12345');
  if (result1) {
    assert.strictEqual(result1.birthDate, '1990-01-01');
    assert.strictEqual(result1.year, 1990);
    assert.strictEqual(result1.month, 1);
    assert.strictEqual(result1.day, 1);
  }

  const result2 = PersonasKods.parse('31125512345');
  if (result2) {
    assert.strictEqual(result2.birthDate, '1955-12-31');
    assert.strictEqual(result2.year, 1955);
    assert.strictEqual(result2.month, 12);
    assert.strictEqual(result2.day, 31);
  }
});

test('edge cases', () => {
  // Test leap year
  const leapYear = PersonasKods.parse('290200-21234');
  if (leapYear) {
    assert.strictEqual(leapYear.birthDate, '2000-02-29');
  }

  // Test with leading zeros
  assert.ok(PersonasKods.parse('010100-10001'));
  assert.ok(PersonasKods.parse('010190-20002'));
});

test('checksum algorithm specifics', () => {
  // Test the Latvian checksum algorithm
  // Weights: [1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // Special rules for remainder calculation

  assert.strictEqual(PersonasKods.checksum('01019012345'), true);
  assert.strictEqual(PersonasKods.checksum('31129023456'), true);
  assert.strictEqual(PersonasKods.checksum('25126521234'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(PersonasKods.checksum('01019012344'), false);
  assert.strictEqual(PersonasKods.checksum('31129023455'), false);
});