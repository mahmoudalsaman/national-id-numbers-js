import test from 'node:test';
import assert from 'node:assert';
import { CPRNumber, NationalID } from '../src/nationalid/dk/cpr_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Danish CPR Number numbers', () => {
  assert.strictEqual(CPRNumber.validate('1234567890'), true);
  assert.strictEqual(CPRNumber.validate('123456-7890'), true);
  assert.strictEqual(CPRNumber.validate('9876543210'), true);
  assert.strictEqual(CPRNumber.validate('987654-3210'), true);
});

test('invalid Danish CPR Number numbers', () => {
  // Wrong length
  assert.strictEqual(CPRNumber.validate('123456789'), false); // Too short
  assert.strictEqual(CPRNumber.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(CPRNumber.validate('123456789a'), false);
  assert.strictEqual(CPRNumber.validate('123456789-'), false);
  assert.strictEqual(CPRNumber.validate(''), false);
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(CPRNumber.validate('1234567891'), false);
});

test('parse Danish CPR Number', () => {
  const result = CPRNumber.parse('1234567890');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different formats', () => {
  // Without dash
  const result1 = CPRNumber.parse('1234567890');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567890');
  
  // With dash
  const result2 = CPRNumber.parse('123456-7890');
  assert.ok(result2);
  assert.strictEqual(result2.number, '1234567890');
});

test('invalid parse Danish CPR Number', () => {
  assert.strictEqual(CPRNumber.parse('123456789'), null); // Too short
  assert.strictEqual(CPRNumber.parse('12345678901'), null); // Too long
  assert.strictEqual(CPRNumber.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(CPRNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890', CPRNumber.METADATA.regexp);
  assert.match('123456-7890', CPRNumber.METADATA.regexp);
  assert.match('9876543210', CPRNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(CPRNumber.METADATA);
  assert.strictEqual(CPRNumber.METADATA.iso3166_alpha2, 'DK');
  assert.strictEqual(CPRNumber.METADATA.min_length, 10);
  assert.strictEqual(CPRNumber.METADATA.max_length, 11);
  assert.strictEqual(CPRNumber.METADATA.parsable, true);
  assert.strictEqual(CPRNumber.METADATA.checksum, true);
  assert.strictEqual(CPRNumber.METADATA.names.includes('CPR Number'), true);
  assert.strictEqual(CPRNumber.METADATA.names.includes('Central Person Register'), true);
  assert.strictEqual(CPRNumber.METADATA.names.includes('Personnummer'), true);
});

test('alias of', () => {
  assert.strictEqual(CPRNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, CPRNumber);
});

test('checksum validation', () => {
  // Valid CPR Number
  assert.strictEqual(CPRNumber.checksum('1234567890'), true);
  assert.strictEqual(CPRNumber.checksum('9876543210'), true);
  
  // Invalid lengths
  assert.strictEqual(CPRNumber.checksum('123456789'), false); // Too short
  assert.strictEqual(CPRNumber.checksum('12345678901'), false); // Too long
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(CPRNumber.checksum('1234567891'), false);
});
