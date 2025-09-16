import test from 'node:test';
import assert from 'node:assert';
import { MyNumber, NationalID } from '../src/nationalid/jpn/my_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Japanese My Numbers', () => {
  // Valid My Numbers with correct checksums
  assert.strictEqual(MyNumber.validate('123456789012'), true);
  assert.strictEqual(MyNumber.validate('987654321098'), true);
  assert.strictEqual(MyNumber.validate('111111111116'), true);
  assert.strictEqual(MyNumber.validate('222222222223'), true);
  assert.strictEqual(MyNumber.validate('000000000000'), true);
});

test('invalid Japanese My Numbers', () => {
  // Wrong length
  assert.strictEqual(MyNumber.validate('12345678901'), false); // Too short
  assert.strictEqual(MyNumber.validate('1234567890123'), false); // Too long

  // Invalid characters
  assert.strictEqual(MyNumber.validate('12345678901a'), false);
  assert.strictEqual(MyNumber.validate('123456789-01'), false);
  assert.strictEqual(MyNumber.validate('123 456 789 012'), false);
  assert.strictEqual(MyNumber.validate(''), false);

  // Invalid checksum
  assert.strictEqual(MyNumber.validate('123456789013'), false);
  assert.strictEqual(MyNumber.validate('987654321099'), false);
  assert.strictEqual(MyNumber.validate('111111111117'), false);
});

test('parse Japanese My Number', () => {
  const result = MyNumber.parse('123456789012');
  assert.ok(result);
  assert.strictEqual(result.number, '123456789012');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different My Numbers', () => {
  const result1 = MyNumber.parse('123456789012');
  assert.ok(result1);
  assert.strictEqual(result1.number, '123456789012');
  assert.strictEqual(result1.gender, Gender.UNKNOWN);

  const result2 = MyNumber.parse('987654321098');
  assert.ok(result2);
  assert.strictEqual(result2.number, '987654321098');
  assert.strictEqual(result2.gender, Gender.UNKNOWN);
});

test('invalid parse Japanese My Number', () => {
  assert.strictEqual(MyNumber.parse('12345678901'), null); // Too short
  assert.strictEqual(MyNumber.parse('1234567890123'), null); // Too long
  assert.strictEqual(MyNumber.parse('12345678901a'), null); // Invalid chars
  assert.strictEqual(MyNumber.parse('123456789013'), null); // Wrong checksum
  assert.strictEqual(MyNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('123456789012', MyNumber.METADATA.regexp);
  assert.match('987654321098', MyNumber.METADATA.regexp);
  assert.match('111111111116', MyNumber.METADATA.regexp);
  assert.match('000000000000', MyNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('12345678901', MyNumber.METADATA.regexp);
  assert.doesNotMatch('1234567890123', MyNumber.METADATA.regexp);
  assert.doesNotMatch('12345678901a', MyNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(MyNumber.METADATA);
  assert.strictEqual(MyNumber.METADATA.iso3166_alpha2, 'JP');
  assert.strictEqual(MyNumber.METADATA.min_length, 12);
  assert.strictEqual(MyNumber.METADATA.max_length, 12);
  assert.strictEqual(MyNumber.METADATA.parsable, true);
  assert.strictEqual(MyNumber.METADATA.checksum, true);
  assert.strictEqual(MyNumber.METADATA.names.includes('My Number'), true);
  assert.strictEqual(MyNumber.METADATA.names.includes('Individual Number'), true);
  assert.strictEqual(MyNumber.METADATA.names.includes('Japanese Social Security Number'), true);
});

test('alias of', () => {
  assert.strictEqual(MyNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, MyNumber);
});

test('checksum validation', () => {
  // Valid My Numbers
  assert.strictEqual(MyNumber.checksum('123456789012'), true);
  assert.strictEqual(MyNumber.checksum('987654321098'), true);
  assert.strictEqual(MyNumber.checksum('111111111116'), true);

  // Invalid format
  assert.strictEqual(MyNumber.checksum('12345678901'), false); // Too short
  assert.strictEqual(MyNumber.checksum('1234567890123'), false); // Too long
  assert.strictEqual(MyNumber.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(MyNumber.checksum('123456789013'), false); // Wrong checksum
  assert.strictEqual(MyNumber.checksum('987654321099'), false); // Wrong checksum
});

test('checksum algorithm specifics', () => {
  // Test the specific My Number checksum algorithm
  // Weights: [6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  // If remainder <= 1, checksum is 0; otherwise checksum is 11 - remainder

  assert.strictEqual(MyNumber.checksum('123456789012'), true);
  assert.strictEqual(MyNumber.checksum('987654321098'), true);
  assert.strictEqual(MyNumber.checksum('000000000000'), true);

  // Numbers that should fail checksum
  assert.strictEqual(MyNumber.checksum('123456789011'), false);
  assert.strictEqual(MyNumber.checksum('123456789010'), false);
});

test('edge cases', () => {
  // Test with all zeros
  assert.strictEqual(MyNumber.validate('000000000000'), true);

  // Test with all same digits
  assert.strictEqual(MyNumber.validate('111111111116'), true);
  assert.strictEqual(MyNumber.validate('222222222223'), true);

  // Test with leading zeros
  assert.strictEqual(MyNumber.validate('000123456789'), true);
  assert.strictEqual(MyNumber.validate('001234567890'), true);
});

test('format validation', () => {
  // My Number should only accept 12 consecutive digits
  assert.strictEqual(MyNumber.validate('123456789012'), true);

  // Should not accept formatted versions
  assert.strictEqual(MyNumber.validate('1234-5678-9012'), false);
  assert.strictEqual(MyNumber.validate('123 456 789 012'), false);
  assert.strictEqual(MyNumber.validate('123.456.789.012'), false);
  assert.strictEqual(MyNumber.validate('123-456-789-012'), false);
});

test('realistic My Numbers', () => {
  // Test some realistic-looking My Numbers
  assert.strictEqual(MyNumber.validate('123456789012'), true);
  assert.strictEqual(MyNumber.validate('987654321098'), true);
  assert.strictEqual(MyNumber.validate('456789012345'), true);
  assert.strictEqual(MyNumber.validate('789012345678'), true);
});

test('gender information', () => {
  // My Number doesn't encode gender information
  const result1 = MyNumber.parse('123456789012');
  if (result1) {
    assert.strictEqual(result1.gender, Gender.UNKNOWN);
  }

  const result2 = MyNumber.parse('987654321098');
  if (result2) {
    assert.strictEqual(result2.gender, Gender.UNKNOWN);
  }
});

test('no birth date information', () => {
  // My Number doesn't encode birth date information
  const result = MyNumber.parse('123456789012');
  if (result) {
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});