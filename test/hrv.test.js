import test from 'node:test';
import assert from 'node:assert';
import { OIB } from '../src/nationalid/hrv/oib.js';

test('valid Croatian OIB numbers', () => {
  // Valid OIBs with correct checksum
  assert.strictEqual(OIB.validate('12345678903'), true);
  assert.strictEqual(OIB.validate('98765432106'), true);
  assert.strictEqual(OIB.validate('11111111119'), true);
  assert.strictEqual(OIB.validate('22222222226'), true);
  assert.strictEqual(OIB.validate('33333333335'), true);
});

test('invalid Croatian OIB numbers', () => {
  // Wrong length
  assert.strictEqual(OIB.validate('1234567890'), false); // Too short
  assert.strictEqual(OIB.validate('123456789012'), false); // Too long

  // Invalid characters
  assert.strictEqual(OIB.validate('1234567890a'), false);
  assert.strictEqual(OIB.validate('123456789-0'), false);
  assert.strictEqual(OIB.validate(''), false);

  // Invalid checksum
  assert.strictEqual(OIB.validate('12345678901'), false);
  assert.strictEqual(OIB.validate('98765432109'), false);
  assert.strictEqual(OIB.validate('11111111111'), false);
});

test('with regexp', () => {
  assert.match('12345678903', OIB.METADATA.regexp);
  assert.match('98765432106', OIB.METADATA.regexp);
  assert.match('11111111119', OIB.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('1234567890', OIB.METADATA.regexp);
  assert.doesNotMatch('123456789012', OIB.METADATA.regexp);
  assert.doesNotMatch('1234567890a', OIB.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(OIB.METADATA);
  assert.strictEqual(OIB.METADATA.iso3166_alpha2, 'HR');
  assert.strictEqual(OIB.METADATA.min_length, 11);
  assert.strictEqual(OIB.METADATA.max_length, 11);
  assert.strictEqual(OIB.METADATA.parsable, false);
  assert.strictEqual(OIB.METADATA.checksum, true);
  assert.strictEqual(OIB.METADATA.names.includes('Osobni identifikacijski broj'), true);
  assert.strictEqual(OIB.METADATA.names.includes('OIB'), true);
  assert.strictEqual(OIB.METADATA.names.includes('Personal Identification Number'), true);
});

test('alias of', () => {
  assert.strictEqual(OIB.METADATA.alias_of, null);
});

test('edge cases', () => {
  // Test with leading zeros
  assert.strictEqual(OIB.validate('01234567896'), true);
  assert.strictEqual(OIB.validate('00123456785'), true);

  // Test boundary values
  assert.strictEqual(OIB.validate('00000000001'), true);
  assert.strictEqual(OIB.validate('99999999994'), true);
});

test('checksum algorithm validation', () => {
  // Test specific OIBs that should pass the checksum algorithm
  // These numbers are calculated to pass the Croatian OIB checksum
  assert.strictEqual(OIB.validate('12345678903'), true);
  assert.strictEqual(OIB.validate('98765432106'), true);

  // Test OIBs that should fail checksum
  assert.strictEqual(OIB.validate('12345678900'), false);
  assert.strictEqual(OIB.validate('12345678902'), false);
  assert.strictEqual(OIB.validate('98765432100'), false);
  assert.strictEqual(OIB.validate('98765432111'), false);
});

test('format validation', () => {
  // OIB should only accept 11 consecutive digits
  assert.strictEqual(OIB.validate('12345678903'), true);

  // Should not accept formatted versions
  assert.strictEqual(OIB.validate('123-456-789-01'), false);
  assert.strictEqual(OIB.validate('123 456 789 01'), false);
  assert.strictEqual(OIB.validate('123.456.789.01'), false);
});

test('sequential and repeated digits', () => {
  // Test numbers with repeated digits (if they pass checksum)
  assert.strictEqual(OIB.validate('11111111119'), true);
  assert.strictEqual(OIB.validate('22222222226'), true);
  assert.strictEqual(OIB.validate('33333333335'), true);

  // Test sequential numbers
  assert.strictEqual(OIB.validate('01234567896'), true);
  assert.strictEqual(OIB.validate('09876543211'), true);
});

test('realistic Croatian OIB validation', () => {
  // Test some example OIBs that would be typical
  assert.strictEqual(OIB.validate('12345678903'), true);
  assert.strictEqual(OIB.validate('98765432106'), true);
  assert.strictEqual(OIB.validate('45612378903'), true);
  assert.strictEqual(OIB.validate('78945612303'), true);
});