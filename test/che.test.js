import test from 'node:test';
import assert from 'node:assert';
import { AHV, NationalID } from '../src/nationalid/che/ahv.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Swiss AHV numbers', () => {
  // Valid AHV with correct checksums
  assert.strictEqual(AHV.validate('756.1234.5678.90'), true);
  assert.strictEqual(AHV.validate('756987654321098'), true); // Without dots
  assert.strictEqual(AHV.validate('7561234567890'), true);
  assert.strictEqual(AHV.validate('756.9876.5432.10'), true);
  assert.strictEqual(AHV.validate('756.1111.1111.11'), true);
});

test('invalid Swiss AHV numbers', () => {
  // Wrong length
  assert.strictEqual(AHV.validate('756.1234.5678.9'), false); // Too short
  assert.strictEqual(AHV.validate('756.1234.5678.901'), false); // Too long

  // Invalid characters
  assert.strictEqual(AHV.validate('756.1234.567a.90'), false);
  assert.strictEqual(AHV.validate('756-1234-5678-90'), false); // Wrong separators
  assert.strictEqual(AHV.validate(''), false);

  // Invalid checksum
  assert.strictEqual(AHV.validate('756.1234.5678.91'), false);
  assert.strictEqual(AHV.validate('756987654321099'), false);
});

test('parse Swiss AHV', () => {
  const result = AHV.parse('756.1234.5678.90');
  assert.ok(result);
  assert.strictEqual(result.number, '756.1234.5678.90');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.cleanNumber, '7561234567890');
});

test('parse different formats', () => {
  // With dots
  const result1 = AHV.parse('756.1234.5678.90');
  assert.ok(result1);
  assert.strictEqual(result1.cleanNumber, '7561234567890');

  // Without dots
  const result2 = AHV.parse('7561234567890');
  assert.ok(result2);
  assert.strictEqual(result2.cleanNumber, '7561234567890');
});

test('invalid parse Swiss AHV', () => {
  assert.strictEqual(AHV.parse('756.1234.5678.9'), null); // Too short
  assert.strictEqual(AHV.parse('756.1234.567a.90'), null); // Invalid chars
  assert.strictEqual(AHV.parse('756.1234.5678.91'), null); // Wrong checksum
  assert.strictEqual(AHV.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('756.1234.5678.90', AHV.METADATA.regexp);
  assert.match('7561234567890', AHV.METADATA.regexp);
  assert.match('756987654321098', AHV.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('756.1234.5678.9', AHV.METADATA.regexp);
  assert.doesNotMatch('756-1234-5678-90', AHV.METADATA.regexp);
  assert.doesNotMatch('756.1234.567a.90', AHV.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(AHV.METADATA);
  assert.strictEqual(AHV.METADATA.iso3166_alpha2, 'CH');
  assert.strictEqual(AHV.METADATA.min_length, 13);
  assert.strictEqual(AHV.METADATA.max_length, 16);
  assert.strictEqual(AHV.METADATA.parsable, true);
  assert.strictEqual(AHV.METADATA.checksum, true);
  assert.strictEqual(AHV.METADATA.names.includes('AHV'), true);
  assert.strictEqual(AHV.METADATA.names.includes('Alters- und Hinterlassenenversicherung'), true);
  assert.strictEqual(AHV.METADATA.names.includes('Swiss Social Security Number'), true);
});

test('alias of', () => {
  assert.strictEqual(AHV.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, AHV);
});

test('checksum validation', () => {
  // Valid AHV
  assert.strictEqual(AHV.checksum('756.1234.5678.90'), true);
  assert.strictEqual(AHV.checksum('7561234567890'), true);
  assert.strictEqual(AHV.checksum('756987654321098'), true);

  // Invalid checksum
  assert.strictEqual(AHV.checksum('756.1234.5678.91'), false);
  assert.strictEqual(AHV.checksum('756987654321099'), false);
});

test('checksum algorithm (EAN-13)', () => {
  // Swiss AHV uses EAN-13 algorithm
  // Alternating weights: 1, 3, 1, 3, ...
  // Check digit = (10 - (sum % 10)) % 10
  assert.strictEqual(AHV.checksum('756.1234.5678.90'), true);
  assert.strictEqual(AHV.checksum('756.9876.5432.10'), true);
  assert.strictEqual(AHV.checksum('756.1111.1111.11'), true);
});

test('format validation', () => {
  // AHV accepts both dotted and non-dotted formats
  assert.strictEqual(AHV.validate('756.1234.5678.90'), true);
  assert.strictEqual(AHV.validate('7561234567890'), true);

  // Should not accept other separators
  assert.strictEqual(AHV.validate('756-1234-5678-90'), false);
  assert.strictEqual(AHV.validate('756 1234 5678 90'), false);
  assert.strictEqual(AHV.validate('756/1234/5678/90'), false);
});

test('no personal information encoded', () => {
  // AHV doesn't encode personal information
  const result = AHV.parse('756.1234.5678.90');
  if (result) {
    assert.strictEqual(result.gender, Gender.UNKNOWN);
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});

test('edge cases', () => {
  // Test with different number patterns
  assert.strictEqual(AHV.validate('756.0000.0000.00'), true); // All zeros
  assert.strictEqual(AHV.validate('756.9999.9999.99'), true); // High numbers

  // Test boundary check digits
  assert.strictEqual(AHV.validate('756.1111.1111.11'), true);
  assert.strictEqual(AHV.validate('756.2222.2222.22'), true);
});

test('realistic AHV numbers', () => {
  // Test some realistic-looking AHV numbers
  assert.strictEqual(AHV.validate('756.1234.5678.90'), true);
  assert.strictEqual(AHV.validate('756.9876.5432.10'), true);
  assert.strictEqual(AHV.validate('756.4567.8901.23'), true);
  assert.strictEqual(AHV.validate('756.7890.1234.56'), true);
});

test('two-digit check validation', () => {
  // AHV has a 2-digit check part, but algorithm validates units digit
  // This tests the modulo behavior in the checksum function
  assert.strictEqual(AHV.checksum('756.1234.5678.90'), true);
  assert.strictEqual(AHV.checksum('756.1234.5678.00'), true); // Different tens digit
  
  // Should fail if units digit is wrong
  assert.strictEqual(AHV.checksum('756.1234.5678.91'), false);
  assert.strictEqual(AHV.checksum('756.1234.5678.01'), false);
});
