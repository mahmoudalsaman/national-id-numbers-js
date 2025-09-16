import test from 'node:test';
import assert from 'node:assert';
import { NRIC, NationalID } from '../src/nationalid/sgp/nric.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Singapore NRIC numbers', () => {
  // Valid NRIC with correct checksums
  assert.strictEqual(NRIC.validate('S1234567D'), true);
  assert.strictEqual(NRIC.validate('T9876543A'), true);
  assert.strictEqual(NRIC.validate('F1234567N'), true);
  assert.strictEqual(NRIC.validate('G9876543K'), true);
  assert.strictEqual(NRIC.validate('M1234567K'), true);
});

test('invalid Singapore NRIC numbers', () => {
  // Wrong length
  assert.strictEqual(NRIC.validate('S123456D'), false); // Too short
  assert.strictEqual(NRIC.validate('S12345678D'), false); // Too long

  // Invalid prefix
  assert.strictEqual(NRIC.validate('A1234567D'), false);
  assert.strictEqual(NRIC.validate('X1234567D'), false);

  // Invalid characters
  assert.strictEqual(NRIC.validate('S123456aD'), false);
  assert.strictEqual(NRIC.validate('s1234567D'), false); // Lowercase

  // Invalid checksum
  assert.strictEqual(NRIC.validate('S1234567A'), false);
  assert.strictEqual(NRIC.validate('T9876543Z'), false);
});

test('parse Singapore NRIC', () => {
  const result = NRIC.parse('S1234567D');
  assert.ok(result);
  assert.strictEqual(result.number, 'S1234567D');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.prefix, 'S');
  assert.strictEqual(result.digits, '1234567');
  assert.strictEqual(result.checkLetter, 'D');
  assert.strictEqual(result.citizenship, 'Citizen');
});

test('parse different prefixes and citizenships', () => {
  // Citizens (S/T)
  const citizen1 = NRIC.parse('S1234567D');
  assert.ok(citizen1);
  assert.strictEqual(citizen1.citizenship, 'Citizen');
  assert.strictEqual(citizen1.prefix, 'S');

  const citizen2 = NRIC.parse('T9876543A');
  assert.ok(citizen2);
  assert.strictEqual(citizen2.citizenship, 'Citizen');
  assert.strictEqual(citizen2.prefix, 'T');

  // Permanent Residents (F/G)
  const pr1 = NRIC.parse('F1234567N');
  assert.ok(pr1);
  assert.strictEqual(pr1.citizenship, 'Permanent Resident');
  assert.strictEqual(pr1.prefix, 'F');

  const pr2 = NRIC.parse('G9876543K');
  assert.ok(pr2);
  assert.strictEqual(pr2.citizenship, 'Permanent Resident');
  assert.strictEqual(pr2.prefix, 'G');

  // Foreigners (M)
  const foreigner = NRIC.parse('M1234567K');
  assert.ok(foreigner);
  assert.strictEqual(foreigner.citizenship, 'Foreigner');
  assert.strictEqual(foreigner.prefix, 'M');
});

test('invalid parse Singapore NRIC', () => {
  assert.strictEqual(NRIC.parse('S123456D'), null); // Too short
  assert.strictEqual(NRIC.parse('A1234567D'), null); // Invalid prefix
  assert.strictEqual(NRIC.parse('S1234567A'), null); // Wrong checksum
  assert.strictEqual(NRIC.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('S1234567D', NRIC.METADATA.regexp);
  assert.match('T9876543A', NRIC.METADATA.regexp);
  assert.match('F1234567N', NRIC.METADATA.regexp);
  assert.match('G9876543K', NRIC.METADATA.regexp);
  assert.match('M1234567K', NRIC.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('A1234567D', NRIC.METADATA.regexp);
  assert.doesNotMatch('S123456D', NRIC.METADATA.regexp);
  assert.doesNotMatch('s1234567D', NRIC.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NRIC.METADATA);
  assert.strictEqual(NRIC.METADATA.iso3166_alpha2, 'SG');
  assert.strictEqual(NRIC.METADATA.min_length, 9);
  assert.strictEqual(NRIC.METADATA.max_length, 9);
  assert.strictEqual(NRIC.METADATA.parsable, true);
  assert.strictEqual(NRIC.METADATA.checksum, true);
  assert.strictEqual(NRIC.METADATA.names.includes('NRIC'), true);
  assert.strictEqual(NRIC.METADATA.names.includes('National Registration Identity Card'), true);
  assert.strictEqual(NRIC.METADATA.names.includes('Singapore Identity Card'), true);
});

test('alias of', () => {
  assert.strictEqual(NRIC.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NRIC);
});

test('checksum validation', () => {
  // Valid NRIC
  assert.strictEqual(NRIC.checksum('S1234567D'), true);
  assert.strictEqual(NRIC.checksum('T9876543A'), true);
  assert.strictEqual(NRIC.checksum('F1234567N'), true);

  // Invalid checksum
  assert.strictEqual(NRIC.checksum('S1234567A'), false);
  assert.strictEqual(NRIC.checksum('T9876543Z'), false);
});

test('checksum algorithm by prefix', () => {
  // Different prefixes use different check letter arrays
  // S/F prefix use one set, T/G use another, M uses a third
  assert.strictEqual(NRIC.checksum('S1234567D'), true); // S prefix
  assert.strictEqual(NRIC.checksum('T9876543A'), true); // T prefix
  assert.strictEqual(NRIC.checksum('F1234567N'), true); // F prefix
  assert.strictEqual(NRIC.checksum('G9876543K'), true); // G prefix
  assert.strictEqual(NRIC.checksum('M1234567K'), true); // M prefix
});
