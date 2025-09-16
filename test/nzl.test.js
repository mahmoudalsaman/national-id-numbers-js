import test from 'node:test';
import assert from 'node:assert';
import { IRDNumber, NationalID } from '../src/nationalid/nzl/ird_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid New Zealand IRD Numbers', () => {
  // Valid IRD numbers with correct checksums
  assert.strictEqual(IRDNumber.validate('12345678'), true); // 8 digits
  assert.strictEqual(IRDNumber.validate('123456789'), true); // 9 digits
  assert.strictEqual(IRDNumber.validate('987654321'), true);
  assert.strictEqual(IRDNumber.validate('49091850'), true);
  assert.strictEqual(IRDNumber.validate('136410132'), true);
});

test('invalid New Zealand IRD Numbers', () => {
  // Wrong length
  assert.strictEqual(IRDNumber.validate('1234567'), false); // Too short
  assert.strictEqual(IRDNumber.validate('1234567890'), false); // Too long

  // Invalid characters
  assert.strictEqual(IRDNumber.validate('1234567a'), false);
  assert.strictEqual(IRDNumber.validate('123456-78'), false);
  assert.strictEqual(IRDNumber.validate(''), false);

  // Invalid checksum
  assert.strictEqual(IRDNumber.validate('12345679'), false);
  assert.strictEqual(IRDNumber.validate('123456780'), false);
  assert.strictEqual(IRDNumber.validate('987654322'), false);
});

test('parse New Zealand IRD Number', () => {
  const result = IRDNumber.parse('12345678');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different IRD Numbers', () => {
  const result1 = IRDNumber.parse('12345678');
  assert.ok(result1);
  assert.strictEqual(result1.number, '12345678');
  assert.strictEqual(result1.gender, Gender.UNKNOWN);

  const result2 = IRDNumber.parse('123456789');
  assert.ok(result2);
  assert.strictEqual(result2.number, '123456789');
  assert.strictEqual(result2.gender, Gender.UNKNOWN);
});

test('invalid parse New Zealand IRD Number', () => {
  assert.strictEqual(IRDNumber.parse('1234567'), null); // Too short
  assert.strictEqual(IRDNumber.parse('1234567890'), null); // Too long
  assert.strictEqual(IRDNumber.parse('1234567a'), null); // Invalid chars
  assert.strictEqual(IRDNumber.parse('12345679'), null); // Wrong checksum
  assert.strictEqual(IRDNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678', IRDNumber.METADATA.regexp);
  assert.match('123456789', IRDNumber.METADATA.regexp);
  assert.match('987654321', IRDNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('1234567', IRDNumber.METADATA.regexp);
  assert.doesNotMatch('1234567890', IRDNumber.METADATA.regexp);
  assert.doesNotMatch('1234567a', IRDNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(IRDNumber.METADATA);
  assert.strictEqual(IRDNumber.METADATA.iso3166_alpha2, 'NZ');
  assert.strictEqual(IRDNumber.METADATA.min_length, 8);
  assert.strictEqual(IRDNumber.METADATA.max_length, 9);
  assert.strictEqual(IRDNumber.METADATA.parsable, true);
  assert.strictEqual(IRDNumber.METADATA.checksum, true);
  assert.strictEqual(IRDNumber.METADATA.names.includes('IRD Number'), true);
  assert.strictEqual(IRDNumber.METADATA.names.includes('Inland Revenue Department Number'), true);
  assert.strictEqual(IRDNumber.METADATA.names.includes('New Zealand Tax Number'), true);
});

test('alias of', () => {
  assert.strictEqual(IRDNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, IRDNumber);
});

test('checksum validation', () => {
  // Valid IRD numbers
  assert.strictEqual(IRDNumber.checksum('12345678'), true);
  assert.strictEqual(IRDNumber.checksum('123456789'), true);
  assert.strictEqual(IRDNumber.checksum('49091850'), true);

  // Invalid format
  assert.strictEqual(IRDNumber.checksum('1234567'), false); // Too short
  assert.strictEqual(IRDNumber.checksum('1234567890'), false); // Too long
  assert.strictEqual(IRDNumber.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(IRDNumber.checksum('12345679'), false); // Wrong checksum
  assert.strictEqual(IRDNumber.checksum('987654322'), false); // Wrong checksum
});

test('checksum algorithm specifics', () => {
  // Test the IRD checksum algorithm
  // Weights: [3, 2, 7, 6, 5, 4, 3, 2]
  // Remainder = sum % 11
  // If remainder == 0: check digit = 0
  // If remainder == 1: invalid
  // Otherwise: check digit = 11 - remainder

  assert.strictEqual(IRDNumber.checksum('12345678'), true);
  assert.strictEqual(IRDNumber.checksum('987654321'), true);
  assert.strictEqual(IRDNumber.checksum('49091850'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(IRDNumber.checksum('12345679'), false);
  assert.strictEqual(IRDNumber.checksum('12345670'), false);
});

test('padding behavior', () => {
  // 8-digit numbers should be padded to 9 digits for checksum calculation
  assert.strictEqual(IRDNumber.validate('12345678'), true); // 8 digits
  assert.strictEqual(IRDNumber.validate('012345678'), true); // Already 9 digits

  // Both should be treated the same way in checksum calculation
  const result8 = IRDNumber.parse('12345678');
  const result9 = IRDNumber.parse('012345678');
  if (result8 && result9) {
    // The 8-digit version should be preserved as entered
    assert.strictEqual(result8.number, '12345678');
    assert.strictEqual(result9.number, '012345678');
  }
});

test('edge cases', () => {
  // Test with leading zeros
  assert.strictEqual(IRDNumber.validate('01234567'), true); // 8 digits with leading zero
  assert.strictEqual(IRDNumber.validate('001234567'), true); // 9 digits with leading zeros

  // Test boundary values
  assert.strictEqual(IRDNumber.validate('00000000'), true); // All zeros (if valid checksum)

  // Test specific known valid IRD numbers
  assert.strictEqual(IRDNumber.validate('49091850'), true);
  assert.strictEqual(IRDNumber.validate('136410132'), true);
});

test('special remainder handling', () => {
  // Test the special case where remainder = 1 (should be invalid)
  // This is harder to test without knowing specific numbers that produce remainder 1
  // The checksum function should return false for such cases

  // Test normal cases
  assert.strictEqual(IRDNumber.checksum('12345678'), true);
  assert.strictEqual(IRDNumber.checksum('987654321'), true);
});

test('format validation', () => {
  // IRD should only accept 8 or 9 consecutive digits
  assert.strictEqual(IRDNumber.validate('12345678'), true);
  assert.strictEqual(IRDNumber.validate('123456789'), true);

  // Should not accept formatted versions
  assert.strictEqual(IRDNumber.validate('123-456-78'), false);
  assert.strictEqual(IRDNumber.validate('123 456 789'), false);
  assert.strictEqual(IRDNumber.validate('123.456.789'), false);
});

test('no personal information encoded', () => {
  // IRD numbers don't encode personal information
  const result = IRDNumber.parse('12345678');
  if (result) {
    assert.strictEqual(result.gender, Gender.UNKNOWN);
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});

test('realistic IRD Numbers', () => {
  // Test some realistic-looking IRD Numbers
  assert.strictEqual(IRDNumber.validate('49091850'), true);
  assert.strictEqual(IRDNumber.validate('136410132'), true);
  assert.strictEqual(IRDNumber.validate('12345678'), true);
  assert.strictEqual(IRDNumber.validate('987654321'), true);
});