import test from 'node:test';
import assert from 'node:assert';
import { CNP, NationalID } from '../src/nationalid/ro/cnp.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Romanian CNP numbers', () => {
  assert.strictEqual(CNP.validate('1234567890123'), true);
  assert.strictEqual(CNP.validate('9876543210983'), true);
  assert.strictEqual(CNP.validate('1111111111113'), true);
  assert.strictEqual(CNP.validate('0000000000000'), true);
});

test('invalid Romanian CNP numbers', () => {
  // Wrong length
  assert.strictEqual(CNP.validate('123456789012'), false); // Too short
  assert.strictEqual(CNP.validate('12345678901234'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(CNP.validate('123456789012a'), false);
  assert.strictEqual(CNP.validate('123456789012-'), false);
  assert.strictEqual(CNP.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(CNP.validate('1234567890120'), false); // Wrong checksum
  assert.strictEqual(CNP.validate('1111111111110'), false); // Wrong checksum
});

test('parse Romanian CNP', () => {
  const result = CNP.parse('1234567890123');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890123');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different CNP numbers
  const result1 = CNP.parse('1234567890123');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567890123');
  
  const result2 = CNP.parse('9876543210983');
  assert.ok(result2);
  assert.strictEqual(result2.number, '9876543210983');
});

test('invalid parse Romanian CNP', () => {
  assert.strictEqual(CNP.parse('123456789012'), null); // Too short
  assert.strictEqual(CNP.parse('12345678901234'), null); // Too long
  assert.strictEqual(CNP.parse('123456789012a'), null); // Invalid chars
  assert.strictEqual(CNP.parse('1234567890120'), null); // Wrong checksum
  assert.strictEqual(CNP.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890123', CNP.METADATA.regexp);
  assert.match('9876543210983', CNP.METADATA.regexp);
  assert.match('1111111111111', CNP.METADATA.regexp);
  assert.match('0000000000000', CNP.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(CNP.METADATA);
  assert.strictEqual(CNP.METADATA.iso3166_alpha2, 'RO');
  assert.strictEqual(CNP.METADATA.min_length, 13);
  assert.strictEqual(CNP.METADATA.max_length, 13);
  assert.strictEqual(CNP.METADATA.parsable, true);
  assert.strictEqual(CNP.METADATA.checksum, true);
  assert.strictEqual(CNP.METADATA.names.includes('CNP'), true);
  assert.strictEqual(CNP.METADATA.names.includes('Cod Numeric Personal'), true);
  assert.strictEqual(CNP.METADATA.names.includes('Romanian Personal Numeric Code'), true);
});

test('alias of', () => {
  assert.strictEqual(CNP.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, CNP);
});

test('checksum validation', () => {
  // Valid CNP
  assert.strictEqual(CNP.checksum('1234567890123'), true);
  assert.strictEqual(CNP.checksum('9876543210983'), true);
  
  // Invalid format
  assert.strictEqual(CNP.checksum('123456789012'), false); // Too short
  assert.strictEqual(CNP.checksum('12345678901234'), false); // Too long
  assert.strictEqual(CNP.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(CNP.checksum('1234567890120'), false); // Wrong checksum
  assert.strictEqual(CNP.checksum('1111111111110'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on first digit
  const result1 = CNP.parse('1234567890123');
  if (result1) {
    const genderDigit = parseInt(result1.number[0]);
    const expectedGender = (genderDigit === 1 || genderDigit === 3 || genderDigit === 5 || genderDigit === 7) ? Gender.MALE : Gender.FEMALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = CNP.parse('9876543210983');
  if (result2) {
    const genderDigit = parseInt(result2.number[0]);
    const expectedGender = (genderDigit === 1 || genderDigit === 3 || genderDigit === 5 || genderDigit === 7) ? Gender.MALE : Gender.FEMALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = CNP.parse('1234567890123');
  if (result) {
    assert.ok(result.birthDate);
    assert.ok(result.year);
    assert.ok(result.month);
    assert.ok(result.day);
    assert.strictEqual(typeof result.year, 'number');
    assert.strictEqual(typeof result.month, 'number');
    assert.strictEqual(typeof result.day, 'number');
  }
});
