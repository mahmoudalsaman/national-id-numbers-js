import test from 'node:test';
import assert from 'node:assert';
import { RUT } from '../src/nationalid/chl/rut.js';

test('valid Chilean RUT numbers', () => {
  // Valid RUTs with different formats and check digits
  assert.strictEqual(RUT.validate('11.111.111-1'), true);
  assert.strictEqual(RUT.validate('22.220.013-K'), true);
  assert.strictEqual(RUT.validate('12345678-5'), true);
  assert.strictEqual(RUT.validate('99.999.999-9'), true);
  assert.strictEqual(RUT.validate('1.000.007-6'), true);

  // Without formatting
  assert.strictEqual(RUT.validate('111111111'), true);
  assert.strictEqual(RUT.validate('100000004K'), true);
  assert.strictEqual(RUT.validate('123456785'), true);

  // Partial formatting
  assert.strictEqual(RUT.validate('11111111-1'), true);
  assert.strictEqual(RUT.validate('22.220.013K'), true);
});

test('invalid Chilean RUT numbers', () => {
  // Wrong check digits
  assert.strictEqual(RUT.validate('11.111.111-2'), false);
  assert.strictEqual(RUT.validate('22.220.013-1'), false);
  assert.strictEqual(RUT.validate('12345678-9'), false);

  // Invalid characters
  assert.strictEqual(RUT.validate('11.111.111-X'), false);
  assert.strictEqual(RUT.validate('11.111.111-Z'), false);
  assert.strictEqual(RUT.validate(''), false);

  // Invalid format
  assert.strictEqual(RUT.validate('1111111'), false); // Too short
  assert.strictEqual(RUT.validate('111111111111'), false); // Too long
  assert.strictEqual(RUT.validate('11.111.111'), false); // Missing check digit
  assert.strictEqual(RUT.validate('abc.def.ghi-1'), false); // Invalid characters in number
});

test('with regexp', () => {
  assert.match('11.111.111-1', RUT.METADATA.regexp);
  assert.match('22.222.222-K', RUT.METADATA.regexp);
  assert.match('123456785', RUT.METADATA.regexp);
  assert.match('12345678-5', RUT.METADATA.regexp);
  assert.match('1.234.567-k', RUT.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('1111111', RUT.METADATA.regexp);
  assert.doesNotMatch('11.111.111', RUT.METADATA.regexp);
  assert.doesNotMatch('11.111.111-X', RUT.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(RUT.METADATA);
  assert.strictEqual(RUT.METADATA.iso3166_alpha2, 'CL');
  assert.strictEqual(RUT.METADATA.min_length, 8);
  assert.strictEqual(RUT.METADATA.max_length, 12);
  assert.strictEqual(RUT.METADATA.parsable, false);
  assert.strictEqual(RUT.METADATA.checksum, true);
  assert.strictEqual(RUT.METADATA.names.includes('Rol Único Tributario'), true);
  assert.strictEqual(RUT.METADATA.names.includes('RUT'), true);
  assert.strictEqual(RUT.METADATA.names.includes('RUN'), true);
});

test('alias of', () => {
  assert.strictEqual(RUT.METADATA.alias_of, null);
});

test('edge cases', () => {
  // Test edge case RUT numbers
  assert.strictEqual(RUT.validate('1000007-6'), true);
  assert.strictEqual(RUT.validate('99.999.999-9'), true);

  // Test with different separators and formatting
  assert.strictEqual(RUT.validate('1.000.007-6'), true);
  assert.strictEqual(RUT.validate('10000076'), true);
  assert.strictEqual(RUT.validate('1000007-6'), true);
});

test('checksum algorithm validation', () => {
  // Test specific RUTs with known check digits
  // RUT: 12.345.678 should have check digit 5
  assert.strictEqual(RUT.validate('12345678-5'), true);
  assert.strictEqual(RUT.validate('12345678-4'), false);

  // RUT: 11.111.111 should have check digit 1
  assert.strictEqual(RUT.validate('11111111-1'), true);
  assert.strictEqual(RUT.validate('11111111-0'), false);

  // RUT with K check digit
  assert.strictEqual(RUT.validate('22220013-K'), true);
  assert.strictEqual(RUT.validate('22220013-k'), true);
  assert.strictEqual(RUT.validate('22220013-1'), false);

  // RUT with 0 check digit (remainder 11)
  assert.strictEqual(RUT.validate('30000001-0'), true);
});

test('format variations', () => {
  // Test all valid format variations for the same RUT
  const validFormats = [
    '12345678-5',
    '12.345.678-5',
    '123456785'
  ];

  validFormats.forEach(format => {
    assert.strictEqual(RUT.validate(format), true);
  });

  // Test invalid format variations
  assert.strictEqual(RUT.validate('12-345-678-5'), false);
  assert.strictEqual(RUT.validate('12 345 678 5'), false);
  assert.strictEqual(RUT.validate('12/345/678-5'), false);
});

test('case sensitivity for check digit', () => {
  // Both uppercase and lowercase K should be valid
  assert.strictEqual(RUT.validate('22220013-K'), true);
  assert.strictEqual(RUT.validate('22220013-k'), true);
  assert.strictEqual(RUT.validate('22.220.013-K'), true);
  assert.strictEqual(RUT.validate('22.220.013-k'), true);
});