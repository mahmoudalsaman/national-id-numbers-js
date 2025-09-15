import test from 'node:test';
import assert from 'node:assert';
import { BSN, NationalID } from '../src/nationalid/nl/bsn.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Dutch BSN numbers', () => {
  assert.strictEqual(BSN.validate('123456782'), true);
  assert.strictEqual(BSN.validate('987654329'), true);
  assert.strictEqual(BSN.validate('111111110'), true);
  assert.strictEqual(BSN.validate('000000000'), true);
});

test('invalid Dutch BSN numbers', () => {
  // Wrong length
  assert.strictEqual(BSN.validate('12345678'), false); // Too short
  assert.strictEqual(BSN.validate('1234567890'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(BSN.validate('12345678a'), false);
  assert.strictEqual(BSN.validate('12345678-'), false);
  assert.strictEqual(BSN.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(BSN.validate('123456789'), false); // Wrong checksum
  assert.strictEqual(BSN.validate('111111111'), false); // Wrong checksum
});

test('parse Dutch BSN', () => {
  const result = BSN.parse('123456782');
  assert.ok(result);
  assert.strictEqual(result.number, '123456782');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different formats', () => {
  // Test with different BSN numbers
  const result1 = BSN.parse('123456782');
  assert.ok(result1);
  assert.strictEqual(result1.number, '123456782');
  
  const result2 = BSN.parse('987654329');
  assert.ok(result2);
  assert.strictEqual(result2.number, '987654329');
});

test('invalid parse Dutch BSN', () => {
  assert.strictEqual(BSN.parse('12345678'), null); // Too short
  assert.strictEqual(BSN.parse('1234567890'), null); // Too long
  assert.strictEqual(BSN.parse('12345678a'), null); // Invalid chars
  assert.strictEqual(BSN.parse('123456789'), null); // Wrong checksum
  assert.strictEqual(BSN.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('123456782', BSN.METADATA.regexp);
  assert.match('987654329', BSN.METADATA.regexp);
  assert.match('111111110', BSN.METADATA.regexp);
  assert.match('000000000', BSN.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(BSN.METADATA);
  assert.strictEqual(BSN.METADATA.iso3166_alpha2, 'NL');
  assert.strictEqual(BSN.METADATA.min_length, 9);
  assert.strictEqual(BSN.METADATA.max_length, 9);
  assert.strictEqual(BSN.METADATA.parsable, true);
  assert.strictEqual(BSN.METADATA.checksum, true);
  assert.strictEqual(BSN.METADATA.names.includes('BSN'), true);
  assert.strictEqual(BSN.METADATA.names.includes('Burgerservicenummer'), true);
  assert.strictEqual(BSN.METADATA.names.includes('Dutch Social Security Number'), true);
});

test('alias of', () => {
  assert.strictEqual(BSN.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, BSN);
});

test('checksum validation', () => {
  // Valid BSN
  assert.strictEqual(BSN.checksum('123456782'), true);
  assert.strictEqual(BSN.checksum('987654329'), true);
  
  // Invalid format
  assert.strictEqual(BSN.checksum('12345678'), false); // Too short
  assert.strictEqual(BSN.checksum('1234567890'), false); // Too long
  assert.strictEqual(BSN.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(BSN.checksum('123456789'), false); // Wrong checksum
  assert.strictEqual(BSN.checksum('111111111'), false); // Wrong checksum
});
