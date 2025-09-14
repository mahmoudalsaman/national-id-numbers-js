import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/ar/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Argentine DNI numbers', () => {
  assert.strictEqual(NationalID.validate('12.345.678'), true);
  assert.strictEqual(NationalID.validate('1.234.567'), true);
  assert.strictEqual(NationalID.validate('12345678'), true);
  assert.strictEqual(NationalID.validate('1234567'), true);
});

test('invalid Argentine DNI numbers', () => {
  // Wrong format
  assert.strictEqual(NationalID.validate('123456789'), false); // Too long
  assert.strictEqual(NationalID.validate('123456'), false); // Too short
  assert.strictEqual(NationalID.validate('12-345-678'), false); // Wrong separator
  assert.strictEqual(NationalID.validate('12.345.678.9'), false); // Too many parts
  assert.strictEqual(NationalID.validate('12.345'), false); // Too few parts
  
  // Invalid characters
  assert.strictEqual(NationalID.validate('12.345.67a'), false);
  assert.strictEqual(NationalID.validate('abc.def.ghi'), false);
  assert.strictEqual(NationalID.validate(''), false);
});

test('parse Argentine DNI', () => {
  const result = NationalID.parse('12.345.678');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different formats', () => {
  // With dots
  const result1 = NationalID.parse('12.345.678');
  assert.ok(result1);
  assert.strictEqual(result1.number, '12345678');
  
  // Without dots
  const result2 = NationalID.parse('12345678');
  assert.ok(result2);
  assert.strictEqual(result2.number, '12345678');
  
  // 7 digits
  const result3 = NationalID.parse('1.234.567');
  assert.ok(result3);
  assert.strictEqual(result3.number, '1234567');
});

test('invalid parse Argentine DNI', () => {
  assert.strictEqual(NationalID.parse('123456789'), null); // Too long
  assert.strictEqual(NationalID.parse('123456'), null); // Too short
  assert.strictEqual(NationalID.parse('12-345-678'), null); // Wrong format
  assert.strictEqual(NationalID.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12.345.678', NationalID.METADATA.regexp);
  assert.match('1.234.567', NationalID.METADATA.regexp);
  assert.match('12345678', NationalID.METADATA.regexp);
  assert.match('1234567', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
  assert.strictEqual(NationalID.METADATA.iso3166_alpha2, 'AR');
  assert.strictEqual(NationalID.METADATA.min_length, 7);
  assert.strictEqual(NationalID.METADATA.max_length, 8);
  assert.strictEqual(NationalID.METADATA.parsable, true);
  assert.strictEqual(NationalID.METADATA.checksum, true);
  assert.strictEqual(NationalID.METADATA.names.includes('Documento Nacional de Identidad'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('DNI'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('Cédula de Identidad'), true);
});

test('checksum validation', () => {
  // Valid DNIs
  assert.strictEqual(NationalID.checksum('12.345.678'), true);
  assert.strictEqual(NationalID.checksum('1.234.567'), true);
  assert.strictEqual(NationalID.checksum('12345678'), true);
  assert.strictEqual(NationalID.checksum('1234567'), true);
  
  // Invalid lengths
  assert.strictEqual(NationalID.checksum('123456789'), false); // Too long
  assert.strictEqual(NationalID.checksum('123456'), false); // Too short
});
