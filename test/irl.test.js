import test from 'node:test';
import assert from 'node:assert';
import { PPSNumber, NationalID } from '../src/nationalid/irl/pps_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Irish PPS Numbers', () => {
  // Valid PPS Numbers with correct checksums
  assert.strictEqual(PPSNumber.validate('1234567T'), true);
  assert.strictEqual(PPSNumber.validate('9876543W'), true);
  assert.strictEqual(PPSNumber.validate('1234567TA'), true);
  assert.strictEqual(PPSNumber.validate('9876543WH'), true);
  assert.strictEqual(PPSNumber.validate('0123456A'), true);
});

test('invalid Irish PPS Numbers', () => {
  // Wrong length
  assert.strictEqual(PPSNumber.validate('123456T'), false); // Too short
  assert.strictEqual(PPSNumber.validate('12345678T'), false); // Too long

  // Invalid characters
  assert.strictEqual(PPSNumber.validate('123456aT'), false);
  assert.strictEqual(PPSNumber.validate('1234567X'), false); // X not allowed
  assert.strictEqual(PPSNumber.validate('1234567Y'), false); // Y not allowed
  assert.strictEqual(PPSNumber.validate('1234567Z'), false); // Z not allowed
  assert.strictEqual(PPSNumber.validate(''), false);

  // Invalid check letters (J, K, O not allowed)
  assert.strictEqual(PPSNumber.validate('1234567J'), false);
  assert.strictEqual(PPSNumber.validate('1234567K'), false);
  assert.strictEqual(PPSNumber.validate('1234567O'), false);

  // Invalid second letter
  assert.strictEqual(PPSNumber.validate('1234567TJ'), false); // J not allowed in second position
  assert.strictEqual(PPSNumber.validate('1234567TZ'), false); // Z not allowed

  // Invalid checksum
  assert.strictEqual(PPSNumber.validate('1234567A'), false); // Wrong checksum
  assert.strictEqual(PPSNumber.validate('9876543A'), false); // Wrong checksum
});

test('parse Irish PPS Number', () => {
  const result = PPSNumber.parse('1234567T');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567T');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.digits, '1234567');
  assert.strictEqual(result.checkLetter, 'T');
  assert.strictEqual(result.secondLetter, null);
});

test('parse different formats', () => {
  // Without second letter
  const result1 = PPSNumber.parse('1234567T');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567T');
  assert.strictEqual(result1.checkLetter, 'T');
  assert.strictEqual(result1.secondLetter, null);

  // With second letter
  const result2 = PPSNumber.parse('1234567TA');
  assert.ok(result2);
  assert.strictEqual(result2.number, '1234567TA');
  assert.strictEqual(result2.checkLetter, 'T');
  assert.strictEqual(result2.secondLetter, 'A');
});

test('invalid parse Irish PPS Number', () => {
  assert.strictEqual(PPSNumber.parse('123456T'), null); // Too short
  assert.strictEqual(PPSNumber.parse('12345678T'), null); // Too long
  assert.strictEqual(PPSNumber.parse('123456aT'), null); // Invalid chars
  assert.strictEqual(PPSNumber.parse('1234567X'), null); // Invalid letter
  assert.strictEqual(PPSNumber.parse('1234567A'), null); // Wrong checksum
  assert.strictEqual(PPSNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567T', PPSNumber.METADATA.regexp);
  assert.match('9876543W', PPSNumber.METADATA.regexp);
  assert.match('1234567TA', PPSNumber.METADATA.regexp);
  assert.match('0123456A', PPSNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('123456T', PPSNumber.METADATA.regexp);
  assert.doesNotMatch('12345678T', PPSNumber.METADATA.regexp);
  assert.doesNotMatch('1234567X', PPSNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(PPSNumber.METADATA);
  assert.strictEqual(PPSNumber.METADATA.iso3166_alpha2, 'IE');
  assert.strictEqual(PPSNumber.METADATA.min_length, 8);
  assert.strictEqual(PPSNumber.METADATA.max_length, 9);
  assert.strictEqual(PPSNumber.METADATA.parsable, true);
  assert.strictEqual(PPSNumber.METADATA.checksum, true);
  assert.strictEqual(PPSNumber.METADATA.names.includes('PPS Number'), true);
  assert.strictEqual(PPSNumber.METADATA.names.includes('Personal Public Service Number'), true);
  assert.strictEqual(PPSNumber.METADATA.names.includes('Irish Social Security Number'), true);
});

test('alias of', () => {
  assert.strictEqual(PPSNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, PPSNumber);
});

test('checksum validation', () => {
  // Valid PPS Numbers
  assert.strictEqual(PPSNumber.checksum('1234567T'), true);
  assert.strictEqual(PPSNumber.checksum('9876543W'), true);

  // Invalid format
  assert.strictEqual(PPSNumber.checksum('123456T'), false); // Too short
  assert.strictEqual(PPSNumber.checksum('12345678T'), false); // Too long
  assert.strictEqual(PPSNumber.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(PPSNumber.checksum('1234567A'), false); // Wrong checksum
  assert.strictEqual(PPSNumber.checksum('9876543A'), false); // Wrong checksum
});

test('letter value mapping', () => {
  // Test the letter value function
  assert.strictEqual(PPSNumber.getLetterValue('A'), 1);
  assert.strictEqual(PPSNumber.getLetterValue('B'), 2);
  assert.strictEqual(PPSNumber.getLetterValue('T'), 17);
  assert.strictEqual(PPSNumber.getLetterValue('W'), 20);
  
  // Test that excluded letters return 0
  assert.strictEqual(PPSNumber.getLetterValue('J'), 0);
  assert.strictEqual(PPSNumber.getLetterValue('K'), 0);
  assert.strictEqual(PPSNumber.getLetterValue('O'), 0);
});

test('realistic PPS Numbers', () => {
  // Test some realistic PPS Numbers
  assert.strictEqual(PPSNumber.validate('1234567T'), true);
  assert.strictEqual(PPSNumber.validate('9876543W'), true);
  assert.strictEqual(PPSNumber.validate('0123456A'), true);
  assert.strictEqual(PPSNumber.validate('5555555P'), true);
});

test('edge cases', () => {
  // Test with leading zeros
  assert.strictEqual(PPSNumber.validate('0000001W'), true);
  assert.strictEqual(PPSNumber.validate('0123456A'), true);

  // Test boundary check letters
  assert.strictEqual(PPSNumber.validate('1234567A'), false); // First valid letter but wrong checksum
  assert.strictEqual(PPSNumber.validate('9876543W'), true); // Last valid letter
});

test('format variations', () => {
  // PPS should only accept specified format
  assert.strictEqual(PPSNumber.validate('1234567T'), true);
  assert.strictEqual(PPSNumber.validate('1234567TA'), true);

  // Should not accept formatted versions
  assert.strictEqual(PPSNumber.validate('123-456-7T'), false);
  assert.strictEqual(PPSNumber.validate('123 456 7T'), false);
  assert.strictEqual(PPSNumber.validate('1234567-T'), false);
});
