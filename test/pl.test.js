import test from 'node:test';
import assert from 'node:assert';
import { PESEL, NationalID } from '../src/nationalid/pl/pesel.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Polish PESEL numbers', () => {
  assert.strictEqual(PESEL.validate('12345678903'), true);
  assert.strictEqual(PESEL.validate('98765432107'), true);
  assert.strictEqual(PESEL.validate('11111111116'), true);
  assert.strictEqual(PESEL.validate('00000000000'), true);
});

test('invalid Polish PESEL numbers', () => {
  // Wrong length
  assert.strictEqual(PESEL.validate('1234567890'), false); // Too short
  assert.strictEqual(PESEL.validate('123456789012'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(PESEL.validate('1234567890a'), false);
  assert.strictEqual(PESEL.validate('1234567890-'), false);
  assert.strictEqual(PESEL.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(PESEL.validate('12345678900'), false); // Wrong checksum
  assert.strictEqual(PESEL.validate('11111111110'), false); // Wrong checksum
});

test('parse Polish PESEL', () => {
  const result = PESEL.parse('12345678903');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678903');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different PESEL numbers
  const result1 = PESEL.parse('12345678903');
  assert.ok(result1);
  assert.strictEqual(result1.number, '12345678903');
  
  const result2 = PESEL.parse('98765432107');
  assert.ok(result2);
  assert.strictEqual(result2.number, '98765432107');
});

test('invalid parse Polish PESEL', () => {
  assert.strictEqual(PESEL.parse('1234567890'), null); // Too short
  assert.strictEqual(PESEL.parse('123456789012'), null); // Too long
  assert.strictEqual(PESEL.parse('1234567890a'), null); // Invalid chars
  assert.strictEqual(PESEL.parse('12345678900'), null); // Wrong checksum
  assert.strictEqual(PESEL.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678903', PESEL.METADATA.regexp);
  assert.match('98765432107', PESEL.METADATA.regexp);
  assert.match('11111111111', PESEL.METADATA.regexp);
  assert.match('00000000000', PESEL.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(PESEL.METADATA);
  assert.strictEqual(PESEL.METADATA.iso3166_alpha2, 'PL');
  assert.strictEqual(PESEL.METADATA.min_length, 11);
  assert.strictEqual(PESEL.METADATA.max_length, 11);
  assert.strictEqual(PESEL.METADATA.parsable, true);
  assert.strictEqual(PESEL.METADATA.checksum, true);
  assert.strictEqual(PESEL.METADATA.names.includes('PESEL'), true);
  assert.strictEqual(PESEL.METADATA.names.includes('Polish National Identification Number'), true);
  assert.strictEqual(PESEL.METADATA.names.includes('Universal Electronic System for Registration of Population'), true);
});

test('alias of', () => {
  assert.strictEqual(PESEL.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, PESEL);
});

test('checksum validation', () => {
  // Valid PESEL
  assert.strictEqual(PESEL.checksum('12345678903'), true);
  assert.strictEqual(PESEL.checksum('98765432107'), true);
  
  // Invalid format
  assert.strictEqual(PESEL.checksum('1234567890'), false); // Too short
  assert.strictEqual(PESEL.checksum('123456789012'), false); // Too long
  assert.strictEqual(PESEL.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(PESEL.checksum('12345678900'), false); // Wrong checksum
  assert.strictEqual(PESEL.checksum('11111111110'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on 10th digit
  const result1 = PESEL.parse('12345678903');
  if (result1) {
    const genderDigit = parseInt(result1.number[9]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = PESEL.parse('98765432107');
  if (result2) {
    const genderDigit = parseInt(result2.number[9]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = PESEL.parse('12345678903');
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
