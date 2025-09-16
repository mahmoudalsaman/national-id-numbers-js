import test from 'node:test';
import assert from 'node:assert';
import { Cedula } from '../src/nationalid/col/cedula.js';

test('valid Colombian Cédula numbers', () => {
  // Valid Cédulas with different lengths (6-10 digits)
  assert.strictEqual(Cedula.validate('123456'), true); // 6 digits (minimum)
  assert.strictEqual(Cedula.validate('1234567'), true); // 7 digits
  assert.strictEqual(Cedula.validate('12345678'), true); // 8 digits
  assert.strictEqual(Cedula.validate('123456789'), true); // 9 digits
  assert.strictEqual(Cedula.validate('1234567890'), true); // 10 digits (maximum)

  // Common format variations
  assert.strictEqual(Cedula.validate('80123456'), true);
  assert.strictEqual(Cedula.validate('1020304050'), true);
  assert.strictEqual(Cedula.validate('987654321'), true);
});

test('invalid Colombian Cédula numbers', () => {
  // Too short
  assert.strictEqual(Cedula.validate('12345'), false); // 5 digits
  assert.strictEqual(Cedula.validate('1234'), false); // 4 digits

  // Too long
  assert.strictEqual(Cedula.validate('12345678901'), false); // 11 digits
  assert.strictEqual(Cedula.validate('123456789012'), false); // 12 digits

  // Invalid characters
  assert.strictEqual(Cedula.validate('12345678a'), false);
  assert.strictEqual(Cedula.validate('123456-789'), false);
  assert.strictEqual(Cedula.validate('123 456 789'), false);
  assert.strictEqual(Cedula.validate('123.456.789'), false);
  assert.strictEqual(Cedula.validate(''), false);

  // Non-numeric characters
  assert.strictEqual(Cedula.validate('abc123456'), false);
  assert.strictEqual(Cedula.validate('123456abc'), false);
  assert.strictEqual(Cedula.validate('12ab5678'), false);
});

test('with regexp', () => {
  assert.match('123456', Cedula.METADATA.regexp);
  assert.match('1234567', Cedula.METADATA.regexp);
  assert.match('12345678', Cedula.METADATA.regexp);
  assert.match('123456789', Cedula.METADATA.regexp);
  assert.match('1234567890', Cedula.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('12345', Cedula.METADATA.regexp);
  assert.doesNotMatch('12345678901', Cedula.METADATA.regexp);
  assert.doesNotMatch('12345678a', Cedula.METADATA.regexp);
  assert.doesNotMatch('123-456-789', Cedula.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(Cedula.METADATA);
  assert.strictEqual(Cedula.METADATA.iso3166_alpha2, 'CO');
  assert.strictEqual(Cedula.METADATA.min_length, 6);
  assert.strictEqual(Cedula.METADATA.max_length, 10);
  assert.strictEqual(Cedula.METADATA.parsable, false);
  assert.strictEqual(Cedula.METADATA.checksum, false);
  assert.strictEqual(Cedula.METADATA.names.includes('Cédula de Ciudadanía'), true);
  assert.strictEqual(Cedula.METADATA.names.includes('CC'), true);
});

test('alias of', () => {
  assert.strictEqual(Cedula.METADATA.alias_of, null);
});

test('edge cases', () => {
  // Test boundary lengths
  assert.strictEqual(Cedula.validate('000000'), true); // 6 digits with zeros
  assert.strictEqual(Cedula.validate('0000000000'), true); // 10 digits with zeros

  // Test with leading zeros
  assert.strictEqual(Cedula.validate('000123456'), true);
  assert.strictEqual(Cedula.validate('001234567'), true);

  // Test sequential numbers
  assert.strictEqual(Cedula.validate('123456'), true);
  assert.strictEqual(Cedula.validate('654321'), true);
  assert.strictEqual(Cedula.validate('1111111111'), true);
});

test('realistic Colombian Cédula numbers', () => {
  // Test some realistic ranges for Colombian Cédulas
  assert.strictEqual(Cedula.validate('12345678'), true);
  assert.strictEqual(Cedula.validate('80123456'), true);
  assert.strictEqual(Cedula.validate('1020304050'), true);
  assert.strictEqual(Cedula.validate('987654321'), true);
  assert.strictEqual(Cedula.validate('1098765432'), true);
});

test('format validation', () => {
  // Cédula should only accept pure numeric format
  assert.strictEqual(Cedula.validate('123456789'), true);

  // Should not accept formatted versions
  assert.strictEqual(Cedula.validate('123.456.789'), false);
  assert.strictEqual(Cedula.validate('123-456-789'), false);
  assert.strictEqual(Cedula.validate('123 456 789'), false);
  assert.strictEqual(Cedula.validate('123,456,789'), false);
});

test('zero handling', () => {
  // Test numbers with zeros in different positions
  assert.strictEqual(Cedula.validate('102030405'), true);
  assert.strictEqual(Cedula.validate('100000000'), true);
  assert.strictEqual(Cedula.validate('000000001'), true);
  assert.strictEqual(Cedula.validate('123000789'), true);
});