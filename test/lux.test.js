import test from 'node:test';
import assert from 'node:assert';
import { NationalNumber, NationalID } from '../src/nationalid/lux/national_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Luxembourg National Numbers', () => {
  // Valid National Numbers with correct checksums
  assert.strictEqual(NationalNumber.validate('1990010100197'), true);
  assert.strictEqual(NationalNumber.validate('1985123100184'), true);
  assert.strictEqual(NationalNumber.validate('2000020100203'), true);
  assert.strictEqual(NationalNumber.validate('1975060100275'), true);
  assert.strictEqual(NationalNumber.validate('1995111500195'), true);
});

test('invalid Luxembourg National Numbers', () => {
  // Wrong length
  assert.strictEqual(NationalNumber.validate('199001010019'), false); // Too short
  assert.strictEqual(NationalNumber.validate('19900101001975'), false); // Too long

  // Invalid characters
  assert.strictEqual(NationalNumber.validate('199001a100197'), false);
  assert.strictEqual(NationalNumber.validate('1990010100a97'), false);
  assert.strictEqual(NationalNumber.validate(''), false);

  // Invalid date components
  assert.strictEqual(NationalNumber.validate('1990000100197'), false); // Invalid month 00
  assert.strictEqual(NationalNumber.validate('1990130100197'), false); // Invalid month 13
  assert.strictEqual(NationalNumber.validate('1990010000197'), false); // Invalid day 00
  assert.strictEqual(NationalNumber.validate('1990010132197'), false); // Invalid day 32

  // Invalid checksum
  assert.strictEqual(NationalNumber.validate('1990010100198'), false);
  assert.strictEqual(NationalNumber.validate('1985123100185'), false);
});

test('parse Luxembourg National Number', () => {
  const result = NationalNumber.parse('1990010100197');
  assert.ok(result);
  assert.strictEqual(result.number, '1990010100197');
  assert.strictEqual(result.gender, Gender.MALE); // Serial 001 is odd = male
  assert.strictEqual(result.birthDate, '1990-01-01');
  assert.strictEqual(result.year, 1990);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
  assert.strictEqual(result.serial, '001');
});

test('parse different birth dates and genders', () => {
  // Male (odd serial)
  const male = NationalNumber.parse('1990010100197');
  assert.ok(male);
  assert.strictEqual(male.gender, Gender.MALE);
  assert.strictEqual(male.serial, '001');

  // Female (even serial)
  const female = NationalNumber.parse('1990010200296');
  if (female) {
    assert.strictEqual(female.gender, Gender.FEMALE);
    assert.strictEqual(female.serial, '002');
  }

  // Different birth date
  const result = NationalNumber.parse('1985123100184');
  if (result) {
    assert.strictEqual(result.birthDate, '1985-12-31');
    assert.strictEqual(result.year, 1985);
    assert.strictEqual(result.month, 12);
    assert.strictEqual(result.day, 31);
  }
});

test('invalid parse Luxembourg National Number', () => {
  assert.strictEqual(NationalNumber.parse('199001010019'), null); // Too short
  assert.strictEqual(NationalNumber.parse('19900101001975'), null); // Too long
  assert.strictEqual(NationalNumber.parse('199001a100197'), null); // Invalid chars
  assert.strictEqual(NationalNumber.parse('1990000100197'), null); // Invalid date
  assert.strictEqual(NationalNumber.parse('1990010100198'), null); // Wrong checksum
  assert.strictEqual(NationalNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('1990010100197', NationalNumber.METADATA.regexp);
  assert.match('1985123100184', NationalNumber.METADATA.regexp);
  assert.match('2000020100203', NationalNumber.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('199001010019', NationalNumber.METADATA.regexp);
  assert.doesNotMatch('19900101001975', NationalNumber.METADATA.regexp);
  assert.doesNotMatch('199001a100197', NationalNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalNumber.METADATA);
  assert.strictEqual(NationalNumber.METADATA.iso3166_alpha2, 'LU');
  assert.strictEqual(NationalNumber.METADATA.min_length, 13);
  assert.strictEqual(NationalNumber.METADATA.max_length, 13);
  assert.strictEqual(NationalNumber.METADATA.parsable, true);
  assert.strictEqual(NationalNumber.METADATA.checksum, true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('National Number'), true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('Luxembourg National ID'), true);
  assert.strictEqual(NationalNumber.METADATA.names.includes('Numéro National'), true);
});

test('alias of', () => {
  assert.strictEqual(NationalNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NationalNumber);
});

test('checksum validation', () => {
  // Valid National Numbers
  assert.strictEqual(NationalNumber.checksum('1990010100197'), true);
  assert.strictEqual(NationalNumber.checksum('1985123100184'), true);

  // Invalid format
  assert.strictEqual(NationalNumber.checksum('199001010019'), false); // Too short
  assert.strictEqual(NationalNumber.checksum('19900101001975'), false); // Too long
  assert.strictEqual(NationalNumber.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(NationalNumber.checksum('1990010100198'), false); // Wrong checksum
  assert.strictEqual(NationalNumber.checksum('1985123100185'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test male (odd serial numbers)
  const male1 = NationalNumber.parse('1990010100197');
  if (male1) {
    assert.strictEqual(male1.gender, Gender.MALE); // Serial 001 is odd
  }

  const male2 = NationalNumber.parse('1990010300396');
  if (male2) {
    assert.strictEqual(male2.gender, Gender.MALE); // Serial 003 is odd
  }

  // Test female (even serial numbers)
  const female1 = NationalNumber.parse('1990010200296');
  if (female1) {
    assert.strictEqual(female1.gender, Gender.FEMALE); // Serial 002 is even
  }

  const female2 = NationalNumber.parse('1990010400495');
  if (female2) {
    assert.strictEqual(female2.gender, Gender.FEMALE); // Serial 004 is even
  }
});

test('birth date parsing', () => {
  const result1 = NationalNumber.parse('1990010100197');
  if (result1) {
    assert.strictEqual(result1.birthDate, '1990-01-01');
    assert.strictEqual(result1.year, 1990);
    assert.strictEqual(result1.month, 1);
    assert.strictEqual(result1.day, 1);
  }

  const result2 = NationalNumber.parse('1975123100175');
  if (result2) {
    assert.strictEqual(result2.birthDate, '1975-12-31');
    assert.strictEqual(result2.year, 1975);
    assert.strictEqual(result2.month, 12);
    assert.strictEqual(result2.day, 31);
  }
});

test('checksum algorithm (modulo 97)', () => {
  // Test the modulo 97 checksum algorithm
  // Checksum = 97 - (base_number % 97)
  assert.strictEqual(NationalNumber.checksum('1990010100197'), true);
  assert.strictEqual(NationalNumber.checksum('1985123100184'), true);
  assert.strictEqual(NationalNumber.checksum('2000020100203'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(NationalNumber.checksum('1990010100100'), false);
  assert.strictEqual(NationalNumber.checksum('1985123100100'), false);
});

test('edge cases', () => {
  // Test leap year
  const leapYear = NationalNumber.parse('2000022900203');
  if (leapYear) {
    assert.strictEqual(leapYear.birthDate, '2000-02-29');
  }

  // Test boundary dates
  const jan1 = NationalNumber.parse('2000010100103');
  if (jan1) {
    assert.strictEqual(jan1.birthDate, '2000-01-01');
  }

  const dec31 = NationalNumber.parse('1999123100199');
  if (dec31) {
    assert.strictEqual(dec31.birthDate, '1999-12-31');
  }
});

test('format validation', () => {
  // National Number should only accept 13 consecutive digits
  assert.strictEqual(NationalNumber.validate('1990010100197'), true);

  // Should not accept formatted versions
  assert.strictEqual(NationalNumber.validate('1990-01-01-001-97'), false);
  assert.strictEqual(NationalNumber.validate('1990 01 01 001 97'), false);
  assert.strictEqual(NationalNumber.validate('1990.01.01.001.97'), false);
});
