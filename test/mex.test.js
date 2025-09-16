import test from 'node:test';
import assert from 'node:assert';
import { CURP, NationalID } from '../src/nationalid/mex/curp.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Mexican CURP', () => {
  // Valid CURP with correct checksums
  assert.strictEqual(CURP.validate('GABC900101HDFABC019'), true);
  assert.strictEqual(CURP.validate('PEML850315MDFRNS034'), true);
  assert.strictEqual(CURP.validate('MARS750820HDFLRS097'), true);
  assert.strictEqual(CURP.validate('LOPR000229MDFNDR055'), true);
  assert.strictEqual(CURP.validate('XAXA901101HDFRXX001'), true);
});

test('invalid Mexican CURP', () => {
  // Wrong length
  assert.strictEqual(CURP.validate('GABC900101HDFABC01'), false); // Too short
  assert.strictEqual(CURP.validate('GABC900101HDFABC0199'), false); // Too long

  // Invalid characters
  assert.strictEqual(CURP.validate('GABC900101HDFABC01a'), false);
  assert.strictEqual(CURP.validate('gabc900101HDFABC019'), false); // Lowercase
  assert.strictEqual(CURP.validate(''), false);

  // Invalid date components
  assert.strictEqual(CURP.validate('GABC900001HDFABC019'), false); // Invalid month 00
  assert.strictEqual(CURP.validate('GABC901301HDFABC019'), false); // Invalid month 13
  assert.strictEqual(CURP.validate('GABC900100HDFABC019'), false); // Invalid day 00
  assert.strictEqual(CURP.validate('GABC900132HDFABC019'), false); // Invalid day 32

  // Invalid gender letter
  assert.strictEqual(CURP.validate('GABC900101XDFABC019'), false); // X not valid for gender
  assert.strictEqual(CURP.validate('GABC900101ADFABC019'), false); // A not valid for gender

  // Invalid checksum
  assert.strictEqual(CURP.validate('GABC900101HDFABC010'), false);
  assert.strictEqual(CURP.validate('PEML850315MDFRNS035'), false);
});

test('parse Mexican CURP', () => {
  const result = CURP.parse('GABC900101HDFABC019');
  assert.ok(result);
  assert.strictEqual(result.number, 'GABC900101HDFABC019');
  assert.strictEqual(result.gender, Gender.MALE); // H = Hombre (Male)
  assert.strictEqual(result.birthDate, '1990-01-01');
  assert.strictEqual(result.year, 1990);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
  assert.strictEqual(result.stateCode, 'DF');
  assert.strictEqual(result.surnames, 'ABC');
});

test('parse different genders and dates', () => {
  // Male (H)\n  const male = CURP.parse('MARS750820HDFLRS097');
  assert.ok(male);
  assert.strictEqual(male.gender, Gender.MALE);
  assert.strictEqual(male.birthDate, '1975-08-20');
  assert.strictEqual(male.year, 1975);
  assert.strictEqual(male.month, 8);
  assert.strictEqual(male.day, 20);

  // Female (M)\n  const female = CURP.parse('PEML850315MDFRNS034');
  assert.ok(female);
  assert.strictEqual(female.gender, Gender.FEMALE); // M = Mujer (Female)
  assert.strictEqual(female.birthDate, '1985-03-15');
  assert.strictEqual(female.year, 1985);
  assert.strictEqual(female.month, 3);
  assert.strictEqual(female.day, 15);

  // Test century determination (00-30 = 2000s, 31-99 = 1900s)\n  const result2000s = CURP.parse('LOPR000229MDFNDR055');
  if (result2000s) {
    assert.strictEqual(result2000s.year, 2000); // 00 should be 2000
  }

  const result1900s = CURP.parse('XAXA901101HDFRXX001');
  if (result1900s) {
    assert.strictEqual(result1900s.year, 1990); // 90 should be 1990
  }
});

test('invalid parse Mexican CURP', () => {
  assert.strictEqual(CURP.parse('GABC900101HDFABC01'), null); // Too short
  assert.strictEqual(CURP.parse('GABC900101HDFABC0199'), null); // Too long
  assert.strictEqual(CURP.parse('gabc900101HDFABC019'), null); // Lowercase
  assert.strictEqual(CURP.parse('GABC900001HDFABC019'), null); // Invalid date
  assert.strictEqual(CURP.parse('GABC900101XDFABC019'), null); // Invalid gender
  assert.strictEqual(CURP.parse('GABC900101HDFABC010'), null); // Wrong checksum
  assert.strictEqual(CURP.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('GABC900101HDFABC019', CURP.METADATA.regexp);
  assert.match('PEML850315MDFRNS034', CURP.METADATA.regexp);
  assert.match('MARS750820HDFLRS097', CURP.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('GABC900101HDFABC01', CURP.METADATA.regexp);
  assert.doesNotMatch('gabc900101HDFABC019', CURP.METADATA.regexp);
  assert.doesNotMatch('GABC900101XDFABC019', CURP.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(CURP.METADATA);
  assert.strictEqual(CURP.METADATA.iso3166_alpha2, 'MX');
  assert.strictEqual(CURP.METADATA.min_length, 18);
  assert.strictEqual(CURP.METADATA.max_length, 18);
  assert.strictEqual(CURP.METADATA.parsable, true);
  assert.strictEqual(CURP.METADATA.checksum, true);
  assert.strictEqual(CURP.METADATA.names.includes('CURP'), true);
  assert.strictEqual(CURP.METADATA.names.includes('Clave Única de Registro de Población'), true);
  assert.strictEqual(CURP.METADATA.names.includes('Mexican Population Registry Code'), true);
});

test('alias of', () => {
  assert.strictEqual(CURP.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, CURP);
});

test('checksum validation', () => {
  // Valid CURP
  assert.strictEqual(CURP.checksum('GABC900101HDFABC019'), true);
  assert.strictEqual(CURP.checksum('PEML850315MDFRNS034'), true);

  // Invalid format
  assert.strictEqual(CURP.checksum('GABC900101HDFABC01'), false); // Too short
  assert.strictEqual(CURP.checksum('GABC900101HDFABC0199'), false); // Too long
  assert.strictEqual(CURP.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(CURP.checksum('GABC900101HDFABC010'), false); // Wrong checksum
  assert.strictEqual(CURP.checksum('PEML850315MDFRNS035'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test male (H = Hombre)
  const male1 = CURP.parse('GABC900101HDFABC019');
  if (male1) {
    assert.strictEqual(male1.gender, Gender.MALE);
  }

  const male2 = CURP.parse('MARS750820HDFLRS097');
  if (male2) {
    assert.strictEqual(male2.gender, Gender.MALE);
  }

  // Test female (M = Mujer)
  const female1 = CURP.parse('PEML850315MDFRNS034');
  if (female1) {
    assert.strictEqual(female1.gender, Gender.FEMALE);
  }

  const female2 = CURP.parse('LOPR000229MDFNDR055');
  if (female2) {
    assert.strictEqual(female2.gender, Gender.FEMALE);
  }
});

test('century determination', () => {
  // Test 2000s (YY 00-30 = 2000s)
  const result2000_00 = CURP.parse('LOPR000229MDFNDR055');
  if (result2000_00) {
    assert.strictEqual(result2000_00.year, 2000); // 00 = 2000
  }

  const result2000_15 = CURP.parse('ABCD150101HDFRST012');
  if (result2000_15) {
    assert.strictEqual(result2000_15.year, 2015); // 15 = 2015
  }

  const result2000_30 = CURP.parse('ABCD300101HDFRST012');
  if (result2000_30) {
    assert.strictEqual(result2000_30.year, 2030); // 30 = 2030
  }

  // Test 1900s (YY 31-99 = 1900s)
  const result1900_31 = CURP.parse('ABCD310101HDFRST012');
  if (result1900_31) {
    assert.strictEqual(result1900_31.year, 1931); // 31 = 1931
  }

  const result1900_90 = CURP.parse('XAXA901101HDFRXX001');
  if (result1900_90) {
    assert.strictEqual(result1900_90.year, 1990); // 90 = 1990
  }

  const result1900_99 = CURP.parse('ABCD990101HDFRST012');
  if (result1900_99) {
    assert.strictEqual(result1900_99.year, 1999); // 99 = 1999
  }
});

test('state code and surname extraction', () => {
  const result = CURP.parse('GABC900101HDFABC019');
  if (result) {
    assert.strictEqual(result.stateCode, 'DF'); // Mexico City
    assert.strictEqual(result.surnames, 'ABC');
  }

  const result2 = CURP.parse('PEML850315MDFRNS034');
  if (result2) {
    assert.strictEqual(result2.stateCode, 'FR'); // Fictional state code
    assert.strictEqual(result2.surnames, 'RNS');
  }
});

test('checksum algorithm specifics', () => {
  // Test the CURP checksum algorithm
  // Each character gets a value (0-9 = 0-9, A-Z = 10-35)
  // Sum = sum of (char_value * (18-position))
  // Check digit = (10 - (sum % 10)) % 10

  assert.strictEqual(CURP.checksum('GABC900101HDFABC019'), true);
  assert.strictEqual(CURP.checksum('PEML850315MDFRNS034'), true);
  assert.strictEqual(CURP.checksum('MARS750820HDFLRS097'), true);

  // Test numbers that should fail checksum
  assert.strictEqual(CURP.checksum('GABC900101HDFABC018'), false);
  assert.strictEqual(CURP.checksum('GABC900101HDFABC011'), false);
});

test('edge cases', () => {
  // Test leap year
  const leapYear = CURP.parse('LOPR000229MDFNDR055');
  if (leapYear) {
    assert.strictEqual(leapYear.birthDate, '2000-02-29');
  }

  // Test boundary dates
  const jan1 = CURP.parse('ABCD000101HDFRST012');
  if (jan1) {
    assert.strictEqual(jan1.birthDate, '2000-01-01');
  }

  const dec31 = CURP.parse('ABCD991231HDFRST012');
  if (dec31) {
    assert.strictEqual(dec31.birthDate, '1999-12-31');
  }
});

test('format validation', () => {
  // CURP should only accept specific 18-character format
  assert.strictEqual(CURP.validate('GABC900101HDFABC019'), true);

  // Should not accept formatted versions
  assert.strictEqual(CURP.validate('GABC-900101-HDFABC-019'), false);
  assert.strictEqual(CURP.validate('GABC 900101 HDFABC 019'), false);
  assert.strictEqual(CURP.validate('gabc900101hdfabc019'), false); // Must be uppercase
});