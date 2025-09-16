import test from 'node:test';
import assert from 'node:assert';
import { NIC, NationalID } from '../src/nationalid/prt/nic.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Portuguese NIC numbers', () => {
  // Valid NIC with correct checksums
  assert.strictEqual(NIC.validate('123456789'), true);
  assert.strictEqual(NIC.validate('987654321'), true);
  assert.strictEqual(NIC.validate('111111111'), true);
  assert.strictEqual(NIC.validate('222222222'), true);
  assert.strictEqual(NIC.validate('000000000'), true);
});

test('invalid Portuguese NIC numbers', () => {
  // Wrong length
  assert.strictEqual(NIC.validate('12345678'), false); // Too short
  assert.strictEqual(NIC.validate('1234567890'), false); // Too long

  // Invalid characters
  assert.strictEqual(NIC.validate('12345678a'), false);
  assert.strictEqual(NIC.validate('123456-78'), false);
  assert.strictEqual(NIC.validate(''), false);

  // Invalid checksum
  assert.strictEqual(NIC.validate('123456788'), false);
  assert.strictEqual(NIC.validate('987654320'), false);
  assert.strictEqual(NIC.validate('111111110'), false);
});

test('parse Portuguese NIC', () => {
  const result = NIC.parse('123456789');
  assert.ok(result);
  assert.strictEqual(result.number, '123456789');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('parse different NIC numbers', () => {
  const result1 = NIC.parse('123456789');
  assert.ok(result1);
  assert.strictEqual(result1.number, '123456789');
  assert.strictEqual(result1.gender, Gender.UNKNOWN);

  const result2 = NIC.parse('987654321');
  assert.ok(result2);
  assert.strictEqual(result2.number, '987654321');
  assert.strictEqual(result2.gender, Gender.UNKNOWN);
});

test('invalid parse Portuguese NIC', () => {
  assert.strictEqual(NIC.parse('12345678'), null); // Too short
  assert.strictEqual(NIC.parse('1234567890'), null); // Too long
  assert.strictEqual(NIC.parse('12345678a'), null); // Invalid chars
  assert.strictEqual(NIC.parse('123456788'), null); // Wrong checksum
  assert.strictEqual(NIC.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('123456789', NIC.METADATA.regexp);
  assert.match('987654321', NIC.METADATA.regexp);
  assert.match('111111111', NIC.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('12345678', NIC.METADATA.regexp);
  assert.doesNotMatch('1234567890', NIC.METADATA.regexp);
  assert.doesNotMatch('12345678a', NIC.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NIC.METADATA);
  assert.strictEqual(NIC.METADATA.iso3166_alpha2, 'PT');
  assert.strictEqual(NIC.METADATA.min_length, 9);
  assert.strictEqual(NIC.METADATA.max_length, 9);
  assert.strictEqual(NIC.METADATA.parsable, true);
  assert.strictEqual(NIC.METADATA.checksum, true);
  assert.strictEqual(NIC.METADATA.names.includes('NIC'), true);
  assert.strictEqual(NIC.METADATA.names.includes('Número de Identificação Civil'), true);
  assert.strictEqual(NIC.METADATA.names.includes('Portuguese Civil Identification Number'), true);
});

test('alias of', () => {
  assert.strictEqual(NIC.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NIC);
});

test('checksum validation', () => {
  // Valid NIC
  assert.strictEqual(NIC.checksum('123456789'), true);
  assert.strictEqual(NIC.checksum('987654321'), true);

  // Invalid format
  assert.strictEqual(NIC.checksum('12345678'), false); // Too short
  assert.strictEqual(NIC.checksum('1234567890'), false); // Too long
  assert.strictEqual(NIC.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(NIC.checksum('123456788'), false); // Wrong checksum
  assert.strictEqual(NIC.checksum('987654320'), false); // Wrong checksum
});

test('checksum algorithm specifics', () => {
  // Test the Portuguese NIC modulo 11 checksum algorithm
  // Weights: [9, 8, 7, 6, 5, 4, 3, 2]
  // If remainder < 2: check digit = 0
  // Otherwise: check digit = 11 - remainder

  assert.strictEqual(NIC.checksum('123456789'), true);
  assert.strictEqual(NIC.checksum('987654321'), true);
  assert.strictEqual(NIC.checksum('111111111'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(NIC.checksum('123456780'), false);
  assert.strictEqual(NIC.checksum('123456788'), false);
});

test('edge cases', () => {
  // Test with all zeros
  assert.strictEqual(NIC.validate('000000000'), true);

  // Test with leading zeros
  assert.strictEqual(NIC.validate('012345678'), true);
  assert.strictEqual(NIC.validate('001234567'), true);

  // Test boundary values
  assert.strictEqual(NIC.validate('999999999'), true); // If valid checksum
});

test('format validation', () => {
  // NIC should only accept 9 consecutive digits
  assert.strictEqual(NIC.validate('123456789'), true);

  // Should not accept formatted versions
  assert.strictEqual(NIC.validate('123-456-789'), false);
  assert.strictEqual(NIC.validate('123 456 789'), false);
  assert.strictEqual(NIC.validate('123.456.789'), false);
});

test('no personal information encoded', () => {
  // NIC doesn't encode personal information
  const result = NIC.parse('123456789');
  if (result) {
    assert.strictEqual(result.gender, Gender.UNKNOWN);
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});

test('realistic NIC numbers', () => {
  // Test some realistic-looking NIC numbers
  assert.strictEqual(NIC.validate('123456789'), true);
  assert.strictEqual(NIC.validate('987654321'), true);
  assert.strictEqual(NIC.validate('456789012'), true);
  assert.strictEqual(NIC.validate('789012345'), true);
});

test('modulo 11 edge cases', () => {
  // Test specific cases for modulo 11 algorithm
  // When remainder < 2, check digit should be 0
  assert.strictEqual(NIC.checksum('000000000'), true); // All zeros should work
  
  // Test the boundary condition where remainder = 2
  // This would produce check digit = 11 - 2 = 9
  assert.strictEqual(NIC.validate('111111119'), true);
  
  // Test other modulo cases
  assert.strictEqual(NIC.validate('222222222'), true);
  assert.strictEqual(NIC.validate('333333333'), true);
});
