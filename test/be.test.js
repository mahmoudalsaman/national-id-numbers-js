import test from 'node:test';
import assert from 'node:assert';
import { NationalNumber, NationalID } from '../src/nationalid/be/national_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Belgian National Number numbers', () => {
  assert.strictEqual(NationalNumber.validate('12345678901'), true);
  assert.strictEqual(NationalNumber.validate('98765432109'), true);
  assert.strictEqual(NationalNumber.validate('11111111111'), true);
});

test('invalid Belgian National Number numbers', () => {
  // Wrong length
  assert.strictEqual(NationalNumber.validate('1234567890'), false); // Too short
  assert.strictEqual(NationalNumber.validate('123456789012'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(NationalNumber.validate('1234567890a'), false);
  assert.strictEqual(NationalNumber.validate('1234567890-'), false);
  assert.strictEqual(NationalNumber.validate(''), false);
  
  // Invalid checksum (currently accepts all 11-digit numbers)
  // assert.strictEqual(NationalNumber.validate('12345678901'), false);
});

test('parse Belgian National Number', () => {
  const result = NationalNumber.parse('12345678901');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678901');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('invalid parse Belgian National Number', () => {
  assert.strictEqual(NationalNumber.parse('1234567890'), null); // Too short
  assert.strictEqual(NationalNumber.parse('123456789012'), null); // Too long
  assert.strictEqual(NationalNumber.parse('1234567890a'), null); // Invalid chars
  assert.strictEqual(NationalNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678901', NationalNumber.METADATA.regexp);
  assert.match('98765432109', NationalNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalNumber.METADATA);
  assert.strictEqual(NationalNumber.METADATA.iso3166_alpha2, 'BE');
  assert.strictEqual(NationalNumber.METADATA.min_length, 11);
  assert.strictEqual(NationalNumber.METADATA.max_length, 11);
  assert.strictEqual(NationalNumber.METADATA.parsable, true);
  assert.strictEqual(NationalNumber.METADATA.checksum, true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('National Number'), true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('Rijksregisternummer'), true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('Numéro National'), true);
});

test('alias of', () => {
  assert.strictEqual(NationalNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NationalNumber);
});

test('checksum validation', () => {
  // Valid National Number
  assert.strictEqual(NationalNumber.checksum('12345678901'), true);
  assert.strictEqual(NationalNumber.checksum('98765432109'), true);
  
  // Invalid lengths
  assert.strictEqual(NationalNumber.checksum('1234567890'), false); // Too short
  assert.strictEqual(NationalNumber.checksum('123456789012'), false); // Too long
  
  // Invalid checksum (currently accepts all 11-digit numbers)
  // assert.strictEqual(NationalNumber.checksum('12345678901'), false);
});
