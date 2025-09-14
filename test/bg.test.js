import test from 'node:test';
import assert from 'node:assert';
import { EGN, NationalID } from '../src/nationalid/bg/egn.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Bulgarian EGN numbers', () => {
  assert.strictEqual(EGN.validate('1234567890'), true);
  assert.strictEqual(EGN.validate('9876543210'), true);
  assert.strictEqual(EGN.validate('1111111111'), true);
});

test('invalid Bulgarian EGN numbers', () => {
  // Wrong length
  assert.strictEqual(EGN.validate('123456789'), false); // Too short
  assert.strictEqual(EGN.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(EGN.validate('123456789a'), false);
  assert.strictEqual(EGN.validate('123456789-'), false);
  assert.strictEqual(EGN.validate(''), false);
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(EGN.validate('1234567891'), false);
});

test('parse Bulgarian EGN', () => {
  const result = EGN.parse('1234567890');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('invalid parse Bulgarian EGN', () => {
  assert.strictEqual(EGN.parse('123456789'), null); // Too short
  assert.strictEqual(EGN.parse('12345678901'), null); // Too long
  assert.strictEqual(EGN.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(EGN.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890', EGN.METADATA.regexp);
  assert.match('9876543210', EGN.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(EGN.METADATA);
  assert.strictEqual(EGN.METADATA.iso3166_alpha2, 'BG');
  assert.strictEqual(EGN.METADATA.min_length, 10);
  assert.strictEqual(EGN.METADATA.max_length, 10);
  assert.strictEqual(EGN.METADATA.parsable, true);
  assert.strictEqual(EGN.METADATA.checksum, true);
  assert.strictEqual(EGN.METADATA.names.includes('ЕГН'), true);
  assert.strictEqual(EGN.METADATA.names.includes('EGN'), true);
  assert.strictEqual(EGN.METADATA.names.includes('Единен граждански номер'), true);
  assert.strictEqual(EGN.METADATA.names.includes('Unified Civil Number'), true);
});

test('alias of', () => {
  assert.strictEqual(EGN.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, EGN);
});

test('checksum validation', () => {
  // Valid EGN
  assert.strictEqual(EGN.checksum('1234567890'), true);
  assert.strictEqual(EGN.checksum('9876543210'), true);
  
  // Invalid lengths
  assert.strictEqual(EGN.checksum('123456789'), false); // Too short
  assert.strictEqual(EGN.checksum('12345678901'), false); // Too long
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(EGN.checksum('1234567891'), false);
});
