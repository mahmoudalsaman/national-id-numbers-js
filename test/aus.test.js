import test from 'node:test';
import assert from 'node:assert';
import { TaxFileNumber } from '../src/nationalid/aus/tfn.js';

test('valid Australian Tax File Numbers', () => {
  // Valid TFNs that pass checksum validation
  assert.strictEqual(TaxFileNumber.validate('12345679'), true);
  assert.strictEqual(TaxFileNumber.validate('87654321'), true);
  assert.strictEqual(TaxFileNumber.validate('123456715'), true);
  assert.strictEqual(TaxFileNumber.validate('987654311'), true);
  assert.strictEqual(TaxFileNumber.validate('111111101'), true);
});

test('invalid Australian Tax File Numbers', () => {
  // Wrong length
  assert.strictEqual(TaxFileNumber.validate('1234567'), false); // Too short
  assert.strictEqual(TaxFileNumber.validate('1234567890'), false); // Too long

  // Invalid characters
  assert.strictEqual(TaxFileNumber.validate('12345678a'), false);
  assert.strictEqual(TaxFileNumber.validate('123456-78'), false);
  assert.strictEqual(TaxFileNumber.validate(''), false);

  // Invalid checksum - numbers that don't pass modulus 11 check
  assert.strictEqual(TaxFileNumber.validate('12345678'), false);
  assert.strictEqual(TaxFileNumber.validate('87654322'), false);
});

test('with regexp', () => {
  assert.match('12345678', TaxFileNumber.METADATA.regexp);
  assert.match('123456789', TaxFileNumber.METADATA.regexp);
  assert.match('87654321', TaxFileNumber.METADATA.regexp);
  assert.match('987654321', TaxFileNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('1234567', TaxFileNumber.METADATA.regexp);
  assert.doesNotMatch('1234567890', TaxFileNumber.METADATA.regexp);
  assert.doesNotMatch('12345678a', TaxFileNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(TaxFileNumber.METADATA);
  assert.strictEqual(TaxFileNumber.METADATA.iso3166_alpha2, 'AU');
  assert.strictEqual(TaxFileNumber.METADATA.min_length, 8);
  assert.strictEqual(TaxFileNumber.METADATA.max_length, 9);
  assert.strictEqual(TaxFileNumber.METADATA.parsable, false);
  assert.strictEqual(TaxFileNumber.METADATA.checksum, true);
  assert.strictEqual(TaxFileNumber.METADATA.names.includes('Tax File Number'), true);
  assert.strictEqual(TaxFileNumber.METADATA.names.includes('TFN'), true);
});

test('alias of', () => {
  assert.strictEqual(TaxFileNumber.METADATA.alias_of, null);
});

test('edge cases', () => {
  // Test boundary lengths
  assert.strictEqual(TaxFileNumber.validate('00000000'), true); // 8 digits - valid checksum
  assert.strictEqual(TaxFileNumber.validate('000000000'), true); // 9 digits - valid checksum

  // Test with leading zeros
  assert.strictEqual(TaxFileNumber.validate('01234563'), true); // 8 digits with leading zero - valid checksum
  assert.strictEqual(TaxFileNumber.validate('001234565'), true); // 9 digits with leading zeros - valid checksum
});

test('checksum algorithm validation', () => {
  // Test specific TFNs that should pass checksum
  // Using the weighted modulus algorithm: weights [1,4,3,7,5,8,6,9,10]
  assert.strictEqual(TaxFileNumber.validate('123456782'), true);
  assert.strictEqual(TaxFileNumber.validate('555555556'), true);

  // Test TFNs that should fail checksum
  assert.strictEqual(TaxFileNumber.validate('123456783'), false);
  assert.strictEqual(TaxFileNumber.validate('555555557'), false);
});

test('format variations', () => {
  // TFN should only accept numeric format without spaces or separators
  assert.strictEqual(TaxFileNumber.validate('123 456 789'), false);
  assert.strictEqual(TaxFileNumber.validate('123-456-789'), false);
  assert.strictEqual(TaxFileNumber.validate('123.456.789'), false);
});