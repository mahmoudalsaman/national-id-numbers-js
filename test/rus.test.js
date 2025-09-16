import test from 'node:test';
import assert from 'node:assert';
import { SNILS, NationalID } from '../src/nationalid/rus/snils.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Russian SNILS numbers', () => {
  // Valid SNILS with correct checksums
  assert.strictEqual(SNILS.validate('123-456-789 01'), true);
  assert.strictEqual(SNILS.validate('987-654-321 98'), true);
  assert.strictEqual(SNILS.validate('111-111-111 11'), true);
  assert.strictEqual(SNILS.validate('12345678901'), true); // Without separators
  assert.strictEqual(SNILS.validate('98765432198'), true);
});

test('invalid Russian SNILS numbers', () => {
  // Wrong length
  assert.strictEqual(SNILS.validate('123-456-789'), false); // Too short
  assert.strictEqual(SNILS.validate('123-456-789 012'), false); // Too long

  // Invalid characters
  assert.strictEqual(SNILS.validate('123-456-78a 01'), false);
  assert.strictEqual(SNILS.validate('123/456/789 01'), false);
  assert.strictEqual(SNILS.validate(''), false);

  // Invalid checksum
  assert.strictEqual(SNILS.validate('123-456-789 00'), false);
  assert.strictEqual(SNILS.validate('987-654-321 99'), false);
});

test('parse Russian SNILS', () => {
  const result = SNILS.parse('123-456-789 01');
  assert.ok(result);
  assert.strictEqual(result.number, '123-456-789 01');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.cleanNumber, '12345678901');
});

test('parse different formats', () => {
  // With separators
  const result1 = SNILS.parse('123-456-789 01');
  assert.ok(result1);
  assert.strictEqual(result1.cleanNumber, '12345678901');

  // Without separators
  const result2 = SNILS.parse('12345678901');
  assert.ok(result2);
  assert.strictEqual(result2.cleanNumber, '12345678901');
});

test('invalid parse Russian SNILS', () => {
  assert.strictEqual(SNILS.parse('123-456-789'), null); // Too short
  assert.strictEqual(SNILS.parse('123-456-78a 01'), null); // Invalid chars
  assert.strictEqual(SNILS.parse('123-456-789 00'), null); // Wrong checksum
  assert.strictEqual(SNILS.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('123-456-789 01', SNILS.METADATA.regexp);
  assert.match('987-654-321 98', SNILS.METADATA.regexp);
  assert.match('12345678901', SNILS.METADATA.regexp); // Without separators

  // Should not match invalid formats
  assert.doesNotMatch('123-456-789', SNILS.METADATA.regexp);
  assert.doesNotMatch('123/456/789 01', SNILS.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(SNILS.METADATA);
  assert.strictEqual(SNILS.METADATA.iso3166_alpha2, 'RU');
  assert.strictEqual(SNILS.METADATA.min_length, 11);
  assert.strictEqual(SNILS.METADATA.max_length, 14);
  assert.strictEqual(SNILS.METADATA.parsable, true);
  assert.strictEqual(SNILS.METADATA.checksum, true);
  assert.strictEqual(SNILS.METADATA.names.includes('SNILS'), true);
});

test('alias of', () => {
  assert.strictEqual(SNILS.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, SNILS);
});

test('checksum validation', () => {
  // Valid SNILS
  assert.strictEqual(SNILS.checksum('123-456-789 01'), true);
  assert.strictEqual(SNILS.checksum('12345678901'), true);

  // Invalid checksum
  assert.strictEqual(SNILS.checksum('123-456-789 00'), false);
  assert.strictEqual(SNILS.checksum('12345678900'), false);
});
