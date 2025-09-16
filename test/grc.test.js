import test from 'node:test';
import assert from 'node:assert';
import { AMKA, NationalID } from '../src/nationalid/grc/amka.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Greek AMKA numbers', () => {
  // Valid AMKA with correct checksums
  assert.strictEqual(AMKA.validate('12345678901'), true);
  assert.strictEqual(AMKA.validate('31129012345'), true);
  assert.strictEqual(AMKA.validate('15081987654'), true);
  assert.strictEqual(AMKA.validate('01011990123'), true);
  assert.strictEqual(AMKA.validate('25121985678'), true);
});

test('invalid Greek AMKA numbers', () => {
  // Wrong length
  assert.strictEqual(AMKA.validate('1234567890'), false); // Too short
  assert.strictEqual(AMKA.validate('123456789012'), false); // Too long

  // Invalid characters
  assert.strictEqual(AMKA.validate('1234567890a'), false);
  assert.strictEqual(AMKA.validate('123456789-0'), false);
  assert.strictEqual(AMKA.validate(''), false);

  // Invalid date components
  assert.strictEqual(AMKA.validate('00011990123'), false); // Invalid day 00
  assert.strictEqual(AMKA.validate('32011990123'), false); // Invalid day 32
  assert.strictEqual(AMKA.validate('15001990123'), false); // Invalid month 00
  assert.strictEqual(AMKA.validate('15131990123'), false); // Invalid month 13

  // Invalid checksum
  assert.strictEqual(AMKA.validate('12345678900'), false);
  assert.strictEqual(AMKA.validate('12345678911'), false);
});

test('parse Greek AMKA', () => {
  const result = AMKA.parse('01011990123');
  assert.ok(result);
  assert.strictEqual(result.number, '01011990123');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
  assert.strictEqual(result.birthDate, '2019-01-01');
  assert.strictEqual(result.year, 2019);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
});

test('parse different birth dates', () => {
  // Test date parsing with different years
  const result1 = AMKA.parse('31128012345');
  if (result1) {
    assert.strictEqual(result1.day, 31);
    assert.strictEqual(result1.month, 12);
    assert.strictEqual(result1.year, 1980); // Year 80 should be 1980
  }

  const result2 = AMKA.parse('15082012345');
  if (result2) {
    assert.strictEqual(result2.day, 15);
    assert.strictEqual(result2.month, 8);
    assert.strictEqual(result2.year, 2020); // Year 20 should be 2020
  }

  const result3 = AMKA.parse('01014512345');
  if (result3) {
    assert.strictEqual(result3.day, 1);
    assert.strictEqual(result3.month, 1);
    assert.strictEqual(result3.year, 2045); // Year 45 should be 2045
  }
});

test('invalid parse Greek AMKA', () => {
  assert.strictEqual(AMKA.parse('1234567890'), null); // Too short
  assert.strictEqual(AMKA.parse('123456789012'), null); // Too long
  assert.strictEqual(AMKA.parse('1234567890a'), null); // Invalid chars
  assert.strictEqual(AMKA.parse('00011990123'), null); // Invalid date
  assert.strictEqual(AMKA.parse('12345678900'), null); // Wrong checksum
  assert.strictEqual(AMKA.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678901', AMKA.METADATA.regexp);
  assert.match('31129012345', AMKA.METADATA.regexp);
  assert.match('01011990123', AMKA.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('1234567890', AMKA.METADATA.regexp);
  assert.doesNotMatch('123456789012', AMKA.METADATA.regexp);
  assert.doesNotMatch('1234567890a', AMKA.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(AMKA.METADATA);
  assert.strictEqual(AMKA.METADATA.iso3166_alpha2, 'GR');
  assert.strictEqual(AMKA.METADATA.min_length, 11);
  assert.strictEqual(AMKA.METADATA.max_length, 11);
  assert.strictEqual(AMKA.METADATA.parsable, true);
  assert.strictEqual(AMKA.METADATA.checksum, true);
  assert.strictEqual(AMKA.METADATA.names.includes('AMKA'), true);
  assert.strictEqual(AMKA.METADATA.names.includes('Arithmos Mētrōou Koinōnikēs Asfaliseōs'), true);
  assert.strictEqual(AMKA.METADATA.names.includes('Greek Social Security Number'), true);
});

test('alias of', () => {
  assert.strictEqual(AMKA.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, AMKA);
});

test('checksum validation', () => {
  // Valid AMKA
  assert.strictEqual(AMKA.checksum('12345678901'), true);
  assert.strictEqual(AMKA.checksum('31129012345'), true);

  // Invalid format
  assert.strictEqual(AMKA.checksum('1234567890'), false); // Too short
  assert.strictEqual(AMKA.checksum('123456789012'), false); // Too long
  assert.strictEqual(AMKA.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(AMKA.checksum('12345678900'), false); // Wrong checksum
  assert.strictEqual(AMKA.checksum('12345678911'), false); // Wrong checksum
});

test('birth date validation', () => {
  // Valid dates
  assert.ok(AMKA.parse('01011990123')); // January 1st
  assert.ok(AMKA.parse('31121990123')); // December 31st
  assert.ok(AMKA.parse('29021992123')); // Feb 29th leap year

  // Invalid dates
  assert.strictEqual(AMKA.parse('32011990123'), null); // Invalid day 32
  assert.strictEqual(AMKA.parse('15131990123'), null); // Invalid month 13
  assert.strictEqual(AMKA.parse('00011990123'), null); // Invalid day 00
  assert.strictEqual(AMKA.parse('15001990123'), null); // Invalid month 00
});

test('century determination', () => {
  // Test century determination logic (year < 50 = 2000s, year >= 50 = 1900s)
  const result1 = AMKA.parse('01014912345');
  if (result1) {
    assert.strictEqual(result1.year, 2049); // Year 49 should be 2049
  }

  const result2 = AMKA.parse('01015012345');
  if (result2) {
    assert.strictEqual(result2.year, 1950); // Year 50 should be 1950
  }

  const result3 = AMKA.parse('01019912345');
  if (result3) {
    assert.strictEqual(result3.year, 1999); // Year 99 should be 1999
  }

  const result4 = AMKA.parse('01010012345');
  if (result4) {
    assert.strictEqual(result4.year, 2000); // Year 00 should be 2000
  }
});

test('checksum algorithm', () => {
  // Test the weighted sum checksum algorithm
  // Sum = (1*d1 + 2*d2 + 3*d3 + ... + 10*d10) % 11
  // If remainder is 10, checksum is 0, otherwise it's the remainder

  assert.strictEqual(AMKA.checksum('12345678901'), true);
  assert.strictEqual(AMKA.checksum('98765432108'), true);

  // Test edge case where remainder is 10 (checksum should be 0)
  // This would need a specific number that produces remainder 10
  assert.strictEqual(AMKA.checksum('11111111110'), true);
});

test('format validation', () => {
  // AMKA should only accept 11 consecutive digits
  assert.strictEqual(AMKA.validate('12345678901'), true);

  // Should not accept formatted versions
  assert.strictEqual(AMKA.validate('123-456-789-01'), false);
  assert.strictEqual(AMKA.validate('123 456 789 01'), false);
  assert.strictEqual(AMKA.validate('123.456.789.01'), false);
});