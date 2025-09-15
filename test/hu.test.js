import test from 'node:test';
import assert from 'node:assert';
import { SzemelyiSzam, NationalID } from '../src/nationalid/hu/szemelyi_szam.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Hungarian Személyi szám numbers', () => {
  assert.strictEqual(SzemelyiSzam.validate('12345678905'), true);
  assert.strictEqual(SzemelyiSzam.validate('98765432105'), true);
  assert.strictEqual(SzemelyiSzam.validate('11111111115'), true);
  assert.strictEqual(SzemelyiSzam.validate('00000000000'), true);
});

test('invalid Hungarian Személyi szám numbers', () => {
  // Wrong length
  assert.strictEqual(SzemelyiSzam.validate('1234567890'), false); // Too short
  assert.strictEqual(SzemelyiSzam.validate('123456789012'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(SzemelyiSzam.validate('1234567890a'), false);
  assert.strictEqual(SzemelyiSzam.validate('1234567890-'), false);
  assert.strictEqual(SzemelyiSzam.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(SzemelyiSzam.validate('12345678900'), false); // Wrong checksum
  assert.strictEqual(SzemelyiSzam.validate('11111111110'), false); // Wrong checksum
});

test('parse Hungarian Személyi szám', () => {
  const result = SzemelyiSzam.parse('12345678905');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678905');
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
  assert.ok(result.birthDate);
  assert.ok(result.year);
  assert.ok(result.month);
  assert.ok(result.day);
});

test('parse different formats', () => {
  // Test with different Személyi szám numbers
  const result1 = SzemelyiSzam.parse('12345678905');
  assert.ok(result1);
  assert.strictEqual(result1.number, '12345678905');
  
  const result2 = SzemelyiSzam.parse('98765432105');
  assert.ok(result2);
  assert.strictEqual(result2.number, '98765432105');
});

test('invalid parse Hungarian Személyi szám', () => {
  assert.strictEqual(SzemelyiSzam.parse('1234567890'), null); // Too short
  assert.strictEqual(SzemelyiSzam.parse('123456789012'), null); // Too long
  assert.strictEqual(SzemelyiSzam.parse('1234567890a'), null); // Invalid chars
  assert.strictEqual(SzemelyiSzam.parse('12345678900'), null); // Wrong checksum
  assert.strictEqual(SzemelyiSzam.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678905', SzemelyiSzam.METADATA.regexp);
  assert.match('98765432105', SzemelyiSzam.METADATA.regexp);
  assert.match('11111111111', SzemelyiSzam.METADATA.regexp);
  assert.match('00000000000', SzemelyiSzam.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(SzemelyiSzam.METADATA);
  assert.strictEqual(SzemelyiSzam.METADATA.iso3166_alpha2, 'HU');
  assert.strictEqual(SzemelyiSzam.METADATA.min_length, 11);
  assert.strictEqual(SzemelyiSzam.METADATA.max_length, 11);
  assert.strictEqual(SzemelyiSzam.METADATA.parsable, true);
  assert.strictEqual(SzemelyiSzam.METADATA.checksum, true);
  assert.strictEqual(SzemelyiSzam.METADATA.names.includes('Személyi szám'), true);
  assert.strictEqual(SzemelyiSzam.METADATA.names.includes('Hungarian Personal ID'), true);
  assert.strictEqual(SzemelyiSzam.METADATA.names.includes('Hungarian National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(SzemelyiSzam.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, SzemelyiSzam);
});

test('checksum validation', () => {
  // Valid Személyi szám
  assert.strictEqual(SzemelyiSzam.checksum('12345678905'), true);
  assert.strictEqual(SzemelyiSzam.checksum('98765432105'), true);
  
  // Invalid format
  assert.strictEqual(SzemelyiSzam.checksum('1234567890'), false); // Too short
  assert.strictEqual(SzemelyiSzam.checksum('123456789012'), false); // Too long
  assert.strictEqual(SzemelyiSzam.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(SzemelyiSzam.checksum('12345678900'), false); // Wrong checksum
  assert.strictEqual(SzemelyiSzam.checksum('11111111110'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on month range
  const result1 = SzemelyiSzam.parse('12345678905');
  if (result1) {
    const month = parseInt(result1.number.slice(2, 4));
    const expectedGender = (month >= 41 && month <= 52) || (month >= 21 && month <= 32) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = SzemelyiSzam.parse('98765432105');
  if (result2) {
    const month = parseInt(result2.number.slice(2, 4));
    const expectedGender = (month >= 41 && month <= 52) || (month >= 21 && month <= 32) ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});

test('birth date parsing', () => {
  // Test birth date extraction
  const result = SzemelyiSzam.parse('12345678905');
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
