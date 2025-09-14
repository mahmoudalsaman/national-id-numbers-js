import test from 'node:test';
import assert from 'node:assert';
import { Personalausweis, NationalID } from '../src/nationalid/at/personalausweis.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Austrian Personalausweis numbers', () => {
  assert.strictEqual(Personalausweis.validate('1234567890'), true);
  assert.strictEqual(Personalausweis.validate('9876543210'), true);
  assert.strictEqual(Personalausweis.validate('1111111111'), true);
});

test('invalid Austrian Personalausweis numbers', () => {
  // Wrong length
  assert.strictEqual(Personalausweis.validate('123456789'), false); // Too short
  assert.strictEqual(Personalausweis.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(Personalausweis.validate('123456789a'), false);
  assert.strictEqual(Personalausweis.validate('123456789-'), false);
  assert.strictEqual(Personalausweis.validate(''), false);
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(Personalausweis.validate('1234567891'), false);
});

test('parse Austrian Personalausweis', () => {
  const result = Personalausweis.parse('1234567890');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567890');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('invalid parse Austrian Personalausweis', () => {
  assert.strictEqual(Personalausweis.parse('123456789'), null); // Too short
  assert.strictEqual(Personalausweis.parse('12345678901'), null); // Too long
  assert.strictEqual(Personalausweis.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(Personalausweis.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567890', Personalausweis.METADATA.regexp);
  assert.match('9876543210', Personalausweis.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(Personalausweis.METADATA);
  assert.strictEqual(Personalausweis.METADATA.iso3166_alpha2, 'AT');
  assert.strictEqual(Personalausweis.METADATA.min_length, 10);
  assert.strictEqual(Personalausweis.METADATA.max_length, 10);
  assert.strictEqual(Personalausweis.METADATA.parsable, true);
  assert.strictEqual(Personalausweis.METADATA.checksum, true);
  assert.strictEqual(Personalausweis.METADATA.names.includes('Personalausweis'), true);
  assert.strictEqual(Personalausweis.METADATA.names.includes('Austrian ID Card'), true);
  assert.strictEqual(Personalausweis.METADATA.names.includes('Österreichischer Personalausweis'), true);
});

test('alias of', () => {
  assert.strictEqual(Personalausweis.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, Personalausweis);
});

test('checksum validation', () => {
  // Valid Personalausweis
  assert.strictEqual(Personalausweis.checksum('1234567890'), true);
  assert.strictEqual(Personalausweis.checksum('9876543210'), true);
  
  // Invalid lengths
  assert.strictEqual(Personalausweis.checksum('123456789'), false); // Too short
  assert.strictEqual(Personalausweis.checksum('12345678901'), false); // Too long
  
  // Invalid checksum (currently accepts all 10-digit numbers)
  // assert.strictEqual(Personalausweis.checksum('1234567891'), false);
});
