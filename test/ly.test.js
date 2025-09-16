import test from 'node:test';
import assert from 'node:assert';
import { NationalID, NationalIDAlias } from '../src/nationalid/ly/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Libyan National ID numbers', () => {
  assert.strictEqual(NationalID.validate('1234567890'), true);
  assert.strictEqual(NationalID.validate('9876543210'), true);
  assert.strictEqual(NationalID.validate('1111111111'), true);
  assert.strictEqual(NationalID.validate('0000000000'), true);
});

test('invalid Libyan National ID numbers', () => {
  // Wrong length
  assert.strictEqual(NationalID.validate('123456789'), false); // Too short
  assert.strictEqual(NationalID.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(NationalID.validate('123456789a'), false);
  assert.strictEqual(NationalID.validate('123456789-'), false);
  assert.strictEqual(NationalID.validate(''), false);
});

test('parse Libyan National ID', () => {
  const result = NationalID.parse('1234567890');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different National ID numbers
  const result1 = NationalID.parse('1234567890');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567890');
  
  const result2 = NationalID.parse('9876543210');
  assert.ok(result2);
  assert.strictEqual(result2.number, '9876543210');
});

test('invalid parse Libyan National ID', () => {
  assert.strictEqual(NationalID.parse('123456789'), null); // Too short
  assert.strictEqual(NationalID.parse('12345678901'), null); // Too long
  assert.strictEqual(NationalID.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(NationalID.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890', NationalID.METADATA.regexp);
  assert.match('9876543210', NationalID.METADATA.regexp);
  assert.match('1111111111', NationalID.METADATA.regexp);
  assert.match('0000000000', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
  assert.strictEqual(NationalID.METADATA.iso3166_alpha2, 'LY');
  assert.strictEqual(NationalID.METADATA.min_length, 10);
  assert.strictEqual(NationalID.METADATA.max_length, 10);
  assert.strictEqual(NationalID.METADATA.parsable, true);
  assert.strictEqual(NationalID.METADATA.checksum, false);
  assert.strictEqual(NationalID.METADATA.names.includes('National ID'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('Libyan National ID'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('Libyan ID'), true);
});

test('alias of', () => {
  assert.strictEqual(NationalID.METADATA.alias_of, null);
  assert.strictEqual(NationalIDAlias.METADATA.alias_of, NationalID);
});

test('checksum validation', () => {
  // Libyan National ID doesn't use checksum validation
  assert.strictEqual(NationalID.checksum('1234567890'), true);
  assert.strictEqual(NationalID.checksum('9876543210'), true);
  assert.strictEqual(NationalID.checksum('1111111111'), true);
  assert.strictEqual(NationalID.checksum('0000000000'), true);
});

test('gender detection', () => {
  // Test gender detection based on serial number
  const result1 = NationalID.parse('1234567890');
  if (result1) {
    const serialNumber = parseInt(result1.number.slice(6, 10));
    const expectedGender = (serialNumber % 2 === 0) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = NationalID.parse('9876543210');
  if (result2) {
    const serialNumber = parseInt(result2.number.slice(6, 10));
    const expectedGender = (serialNumber % 2 === 0) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = NationalID.parse('1234567890');
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
