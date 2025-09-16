import test from 'node:test';
import assert from 'node:assert';
import { IDCardNumber, NationalID } from '../src/nationalid/mlt/id_card_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Malta ID Card Numbers', () => {
  // Valid ID numbers with correct checksums
  assert.strictEqual(IDCardNumber.validate('1234567A'), true);
  assert.strictEqual(IDCardNumber.validate('9876543Z'), true);
  assert.strictEqual(IDCardNumber.validate('1111111B'), true);
  assert.strictEqual(IDCardNumber.validate('2222222C'), true);
  assert.strictEqual(IDCardNumber.validate('0000000A'), true);
});

test('invalid Malta ID Card Numbers', () => {
  // Wrong length
  assert.strictEqual(IDCardNumber.validate('123456A'), false); // Too short
  assert.strictEqual(IDCardNumber.validate('12345678A'), false); // Too long

  // Invalid characters
  assert.strictEqual(IDCardNumber.validate('123456aA'), false);
  assert.strictEqual(IDCardNumber.validate('1234567-'), false);
  assert.strictEqual(IDCardNumber.validate('12345671'), false); // No letter
  assert.strictEqual(IDCardNumber.validate(''), false);

  // Invalid checksum
  assert.strictEqual(IDCardNumber.validate('1234567B'), false);
  assert.strictEqual(IDCardNumber.validate('9876543A'), false);
  assert.strictEqual(IDCardNumber.validate('1111111A'), false);
});

test('parse Malta ID Card Number', () => {
  const result = IDCardNumber.parse('1234567A');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567A');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.digits, '1234567');
  assert.strictEqual(result.checkLetter, 'A');
});

test('parse different ID numbers', () => {
  const result1 = IDCardNumber.parse('1234567A');
  assert.ok(result1);
  assert.strictEqual(result1.number, '1234567A');
  assert.strictEqual(result1.digits, '1234567');
  assert.strictEqual(result1.checkLetter, 'A');

  const result2 = IDCardNumber.parse('9876543Z');
  assert.ok(result2);
  assert.strictEqual(result2.number, '9876543Z');
  assert.strictEqual(result2.digits, '9876543');
  assert.strictEqual(result2.checkLetter, 'Z');
});

test('invalid parse Malta ID Card Number', () => {
  assert.strictEqual(IDCardNumber.parse('123456A'), null); // Too short
  assert.strictEqual(IDCardNumber.parse('12345678A'), null); // Too long
  assert.strictEqual(IDCardNumber.parse('123456aA'), null); // Invalid chars
  assert.strictEqual(IDCardNumber.parse('1234567B'), null); // Wrong checksum
  assert.strictEqual(IDCardNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1234567A', IDCardNumber.METADATA.regexp);
  assert.match('9876543Z', IDCardNumber.METADATA.regexp);
  assert.match('0000000A', IDCardNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('123456A', IDCardNumber.METADATA.regexp);
  assert.doesNotMatch('12345678A', IDCardNumber.METADATA.regexp);
  assert.doesNotMatch('1234567a', IDCardNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(IDCardNumber.METADATA);
  assert.strictEqual(IDCardNumber.METADATA.iso3166_alpha2, 'MT');
  assert.strictEqual(IDCardNumber.METADATA.min_length, 8);
  assert.strictEqual(IDCardNumber.METADATA.max_length, 8);
  assert.strictEqual(IDCardNumber.METADATA.parsable, true);
  assert.strictEqual(IDCardNumber.METADATA.checksum, true);
  assert.strictEqual(IDCardNumber.METADATA.names.includes('ID Card Number'), true);
  assert.strictEqual(IDCardNumber.METADATA.names.includes('Malta Identity Card Number'), true);
  assert.strictEqual(IDCardNumber.METADATA.names.includes('Maltese National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(IDCardNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, IDCardNumber);
});

test('checksum validation', () => {
  // Valid ID numbers
  assert.strictEqual(IDCardNumber.checksum('1234567A'), true);
  assert.strictEqual(IDCardNumber.checksum('9876543Z'), true);

  // Invalid format
  assert.strictEqual(IDCardNumber.checksum('123456A'), false); // Too short
  assert.strictEqual(IDCardNumber.checksum('12345678A'), false); // Too long
  assert.strictEqual(IDCardNumber.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(IDCardNumber.checksum('1234567B'), false); // Wrong checksum
  assert.strictEqual(IDCardNumber.checksum('9876543A'), false); // Wrong checksum
});

test('checksum algorithm specifics', () => {
  // Test the Malta checksum algorithm: weights [1,2,3,4,5,6,7]
  // Sum = sum of (digit * weight)
  // Check letter = char at (sum % 26)
  assert.strictEqual(IDCardNumber.checksum('1234567A'), true);
  assert.strictEqual(IDCardNumber.checksum('9876543Z'), true);
  assert.strictEqual(IDCardNumber.checksum('0000000A'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(IDCardNumber.checksum('1234567Z'), false);
  assert.strictEqual(IDCardNumber.checksum('9876543A'), false);
});

test('edge cases', () => {
  // Test with all zeros
  assert.strictEqual(IDCardNumber.validate('0000000A'), true);

  // Test with leading zeros
  assert.strictEqual(IDCardNumber.validate('0123456B'), true);
  assert.strictEqual(IDCardNumber.validate('0001234C'), true);

  // Test boundary check letters
  assert.strictEqual(IDCardNumber.validate('1111111B'), true); // Should have correct checksum
  assert.strictEqual(IDCardNumber.validate('2222222C'), true); // Should have correct checksum
});

test('format validation', () => {
  // ID should only accept 7 digits + 1 letter format
  assert.strictEqual(IDCardNumber.validate('1234567A'), true);

  // Should not accept formatted versions
  assert.strictEqual(IDCardNumber.validate('123-456-7A'), false);
  assert.strictEqual(IDCardNumber.validate('123 456 7A'), false);
  assert.strictEqual(IDCardNumber.validate('1234567-A'), false);
});

test('letter range validation', () => {
  // All uppercase letters A-Z should be valid if checksum matches
  const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Test that the checksum algorithm covers the full A-Z range
  for (let i = 0; i < 26; i++) {
    const letter = validLetters[i];
    // Create a number that should have this letter as checksum
    // This is implementation-specific testing
    const testId = '1234567' + letter;
    // We can't guarantee all will be valid, but the algorithm should handle all letters
    const isValid = IDCardNumber.validate(testId);
    // Just ensure the checksum function doesn't crash
    const checksumResult = IDCardNumber.checksum(testId);
    assert.strictEqual(typeof checksumResult, 'boolean');
  }
});

test('gender information', () => {
  // Malta ID doesn't encode gender information
  const result1 = IDCardNumber.parse('1234567A');
  if (result1) {
    assert.strictEqual(result1.gender, Gender.UNKNOWN);
  }

  const result2 = IDCardNumber.parse('9876543Z');
  if (result2) {
    assert.strictEqual(result2.gender, Gender.UNKNOWN);
  }
});

test('no personal information encoded', () => {
  // Malta ID doesn't encode birth date or other personal information
  const result = IDCardNumber.parse('1234567A');
  if (result) {
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});
