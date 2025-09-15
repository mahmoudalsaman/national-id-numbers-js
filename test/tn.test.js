import test from 'node:test';
import assert from 'node:assert';
import { CIN, NationalID } from '../src/nationalid/tn/cin.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Tunisian CIN numbers', () => {
  assert.strictEqual(CIN.validate('12345679'), true);
  assert.strictEqual(CIN.validate('98765438'), true);
  assert.strictEqual(CIN.validate('11111110'), true);
  assert.strictEqual(CIN.validate('00000000'), true);
});

test('invalid Tunisian CIN numbers', () => {
  // Wrong length
  assert.strictEqual(CIN.validate('1234567'), false); // Too short
  assert.strictEqual(CIN.validate('123456789'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(CIN.validate('1234567a'), false);
  assert.strictEqual(CIN.validate('1234567-'), false);
  assert.strictEqual(CIN.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(CIN.validate('12345670'), false); // Wrong checksum
  assert.strictEqual(CIN.validate('11111111'), false); // Wrong checksum
});

test('parse Tunisian CIN', () => {
  const result = CIN.parse('12345679');
  assert.ok(result);
  assert.strictEqual(result.number, '12345679');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different CIN numbers
  const result1 = CIN.parse('12345679');
  assert.ok(result1);
  assert.strictEqual(result1.number, '12345679');
  
  const result2 = CIN.parse('98765438');
  assert.ok(result2);
  assert.strictEqual(result2.number, '98765438');
});

test('invalid parse Tunisian CIN', () => {
  assert.strictEqual(CIN.parse('1234567'), null); // Too short
  assert.strictEqual(CIN.parse('123456789'), null); // Too long
  assert.strictEqual(CIN.parse('1234567a'), null); // Invalid chars
  assert.strictEqual(CIN.parse('12345670'), null); // Wrong checksum
  assert.strictEqual(CIN.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345679', CIN.METADATA.regexp);
  assert.match('98765438', CIN.METADATA.regexp);
  assert.match('11111110', CIN.METADATA.regexp);
  assert.match('00000000', CIN.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(CIN.METADATA);
  assert.strictEqual(CIN.METADATA.iso3166_alpha2, 'TN');
  assert.strictEqual(CIN.METADATA.min_length, 8);
  assert.strictEqual(CIN.METADATA.max_length, 8);
  assert.strictEqual(CIN.METADATA.parsable, true);
  assert.strictEqual(CIN.METADATA.checksum, true);
  assert.strictEqual(CIN.METADATA.names.includes('CIN'), true);
  assert.strictEqual(CIN.METADATA.names.includes('Carte d\'Identité Nationale'), true);
  assert.strictEqual(CIN.METADATA.names.includes('Tunisian National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(CIN.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, CIN);
});

test('checksum validation', () => {
  // Valid CIN
  assert.strictEqual(CIN.checksum('12345679'), true);
  assert.strictEqual(CIN.checksum('98765438'), true);
  
  // Invalid format
  assert.strictEqual(CIN.checksum('1234567'), false); // Too short
  assert.strictEqual(CIN.checksum('123456789'), false); // Too long
  assert.strictEqual(CIN.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(CIN.checksum('12345670'), false); // Wrong checksum
  assert.strictEqual(CIN.checksum('11111111'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on serial number
  const result1 = CIN.parse('12345679');
  if (result1) {
    const serialNumber = parseInt(result1.number.slice(6, 8));
    const expectedGender = (serialNumber % 2 === 0) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = CIN.parse('98765438');
  if (result2) {
    const serialNumber = parseInt(result2.number.slice(6, 8));
    const expectedGender = (serialNumber % 2 === 0) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = CIN.parse('12345679');
  if (result) {
    assert.ok(result.birthDate);
    assert.ok(result.year);
    assert.ok(result.month);
    assert.ok(result.day);
    assert.strictEqual(typeof result.year, 'number');
    assert.strictEqual(typeof result.month, 'number');
    assert.strictEqual(typeof result.day, 'number');
  }
});
