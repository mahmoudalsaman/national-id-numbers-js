import test from 'node:test';
import assert from 'node:assert';
import { RodneCislo, NationalID } from '../src/nationalid/cz/rodne_cislo.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Czech Rodné číslo numbers', () => {
  assert.strictEqual(RodneCislo.validate('1234567890'), true);
  assert.strictEqual(RodneCislo.validate('9876543210'), true);
  assert.strictEqual(RodneCislo.validate('1111111111'), true);
  assert.strictEqual(RodneCislo.validate('0000000000'), true);
});

test('invalid Czech Rodné číslo numbers', () => {
  // Wrong length
  assert.strictEqual(RodneCislo.validate('12345678'), false); // Too short
  assert.strictEqual(RodneCislo.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(RodneCislo.validate('123456789a'), false);
  assert.strictEqual(RodneCislo.validate('123456789-'), false);
  assert.strictEqual(RodneCislo.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(RodneCislo.validate('1234567891'), false); // Wrong checksum
  assert.strictEqual(RodneCislo.validate('1111111110'), false); // Wrong checksum
});

test('parse Czech Rodné číslo', () => {
  const result = RodneCislo.parse('1234567890');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different Rodné číslo numbers
  const result1 = RodneCislo.parse('1234567890');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567890');
  
  const result2 = RodneCislo.parse('9876543210');
  assert.ok(result2);
  assert.strictEqual(result2.number, '9876543210');
});

test('invalid parse Czech Rodné číslo', () => {
  assert.strictEqual(RodneCislo.parse('12345678'), null); // Too short
  assert.strictEqual(RodneCislo.parse('12345678901'), null); // Too long
  assert.strictEqual(RodneCislo.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(RodneCislo.parse('1234567891'), null); // Wrong checksum
  assert.strictEqual(RodneCislo.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890', RodneCislo.METADATA.regexp);
  assert.match('9876543210', RodneCislo.METADATA.regexp);
  assert.match('1111111111', RodneCislo.METADATA.regexp);
  assert.match('0000000000', RodneCislo.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(RodneCislo.METADATA);
  assert.strictEqual(RodneCislo.METADATA.iso3166_alpha2, 'CZ');
  assert.strictEqual(RodneCislo.METADATA.min_length, 9);
  assert.strictEqual(RodneCislo.METADATA.max_length, 10);
  assert.strictEqual(RodneCislo.METADATA.parsable, true);
  assert.strictEqual(RodneCislo.METADATA.checksum, true);
  assert.strictEqual(RodneCislo.METADATA.names.includes('Rodné číslo'), true);
  assert.strictEqual(RodneCislo.METADATA.names.includes('Czech Birth Number'), true);
  assert.strictEqual(RodneCislo.METADATA.names.includes('Czech National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(RodneCislo.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, RodneCislo);
});

test('checksum validation', () => {
  // Valid Rodné číslo
  assert.strictEqual(RodneCislo.checksum('1234567890'), true);
  assert.strictEqual(RodneCislo.checksum('9876543210'), true);
  
  // Invalid format
  assert.strictEqual(RodneCislo.checksum('12345678'), false); // Too short
  assert.strictEqual(RodneCislo.checksum('12345678901'), false); // Too long
  assert.strictEqual(RodneCislo.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(RodneCislo.checksum('1234567891'), false); // Wrong checksum
  assert.strictEqual(RodneCislo.checksum('1111111110'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on month range
  const result1 = RodneCislo.parse('1234567890');
  if (result1) {
    const month = parseInt(result1.number.slice(2, 4));
    const expectedGender = (month >= 51 && month <= 62) || (month >= 71 && month <= 82) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = RodneCislo.parse('9876543210');
  if (result2) {
    const month = parseInt(result2.number.slice(2, 4));
    const expectedGender = (month >= 51 && month <= 62) || (month >= 71 && month <= 82) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = RodneCislo.parse('1234567890');
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
