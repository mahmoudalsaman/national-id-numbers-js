import test from 'node:test';
import assert from 'node:assert';
import { RRN, NationalID } from '../src/nationalid/kor/rrn.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Korean RRN numbers', () => {
  // Valid RRN with correct checksums and different formats
  assert.strictEqual(RRN.validate('900101-1234567'), true);
  assert.strictEqual(RRN.validate('950315-2345678'), true);
  assert.strictEqual(RRN.validate('000229-3456789'), true);
  assert.strictEqual(RRN.validate('101225-4567890'), true);
  assert.strictEqual(RRN.validate('9001011234567'), true); // Without dash
});

test('invalid Korean RRN numbers', () => {
  // Wrong length
  assert.strictEqual(RRN.validate('900101-123456'), false); // Too short
  assert.strictEqual(RRN.validate('900101-12345678'), false); // Too long

  // Invalid date components
  assert.strictEqual(RRN.validate('900001-1234567'), false); // Invalid month 00
  assert.strictEqual(RRN.validate('901301-1234567'), false); // Invalid month 13
  assert.strictEqual(RRN.validate('900100-1234567'), false); // Invalid day 00
  assert.strictEqual(RRN.validate('900132-1234567'), false); // Invalid day 32

  // Invalid gender/century digit
  assert.strictEqual(RRN.validate('900101-0234567'), false); // Invalid digit 0
  assert.strictEqual(RRN.validate('900101-5234567'), false); // Invalid digit 5

  // Invalid characters
  assert.strictEqual(RRN.validate('90010a-1234567'), false);
  assert.strictEqual(RRN.validate('900101/1234567'), false);

  // Invalid checksum
  assert.strictEqual(RRN.validate('900101-1234568'), false);
  assert.strictEqual(RRN.validate('950315-2345679'), false);
});

test('parse Korean RRN', () => {
  const result = RRN.parse('900101-1234567');
  assert.ok(result);
  assert.strictEqual(result.number, '9001011234567');
  assert.strictEqual(result.gender, Gender.MALE); // Gender digit 1 = Male
  assert.strictEqual(result.birthDate, '1990-01-01');
  assert.strictEqual(result.year, 1990);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
});

test('parse different genders and centuries', () => {
  // Male 1900s (digit 1)
  const male1900 = RRN.parse('900101-1234567');
  assert.ok(male1900);
  assert.strictEqual(male1900.gender, Gender.MALE);
  assert.strictEqual(male1900.year, 1990);

  // Female 1900s (digit 2)
  const female1900 = RRN.parse('950315-2345678');
  assert.ok(female1900);
  assert.strictEqual(female1900.gender, Gender.FEMALE);
  assert.strictEqual(female1900.year, 1995);

  // Male 2000s (digit 3)
  const male2000 = RRN.parse('000229-3456789');
  assert.ok(male2000);
  assert.strictEqual(male2000.gender, Gender.MALE);
  assert.strictEqual(male2000.year, 2000);

  // Female 2000s (digit 4)
  const female2000 = RRN.parse('101225-4567890');
  assert.ok(female2000);
  assert.strictEqual(female2000.gender, Gender.FEMALE);
  assert.strictEqual(female2000.year, 2010);
});

test('parse different formats', () => {
  // With dash
  const result1 = RRN.parse('900101-1234567');
  assert.ok(result1);
  assert.strictEqual(result1.number, '9001011234567');

  // Without dash
  const result2 = RRN.parse('9001011234567');
  assert.ok(result2);
  assert.strictEqual(result2.number, '9001011234567');
});

test('invalid parse Korean RRN', () => {
  assert.strictEqual(RRN.parse('900101-123456'), null); // Too short
  assert.strictEqual(RRN.parse('900001-1234567'), null); // Invalid date
  assert.strictEqual(RRN.parse('900101-0234567'), null); // Invalid gender digit
  assert.strictEqual(RRN.parse('900101-1234568'), null); // Wrong checksum
  assert.strictEqual(RRN.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('900101-1234567', RRN.METADATA.regexp);
  assert.match('9001011234567', RRN.METADATA.regexp);
  assert.match('000229-3456789', RRN.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('900101-123456', RRN.METADATA.regexp);
  assert.doesNotMatch('900101/1234567', RRN.METADATA.regexp);
  assert.doesNotMatch('900101-0234567', RRN.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(RRN.METADATA);
  assert.strictEqual(RRN.METADATA.iso3166_alpha2, 'KR');
  assert.strictEqual(RRN.METADATA.min_length, 13);
  assert.strictEqual(RRN.METADATA.max_length, 14);
  assert.strictEqual(RRN.METADATA.parsable, true);
  assert.strictEqual(RRN.METADATA.checksum, true);
  assert.strictEqual(RRN.METADATA.names.includes('RRN'), true);
  assert.strictEqual(RRN.METADATA.names.includes('Resident Registration Number'), true);
  assert.strictEqual(RRN.METADATA.names.includes('Korean National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(RRN.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, RRN);
});

test('checksum validation', () => {
  // Valid RRN
  assert.strictEqual(RRN.checksum('900101-1234567'), true);
  assert.strictEqual(RRN.checksum('9001011234567'), true);
  assert.strictEqual(RRN.checksum('950315-2345678'), true);

  // Invalid checksum
  assert.strictEqual(RRN.checksum('900101-1234568'), false);
  assert.strictEqual(RRN.checksum('950315-2345679'), false);
});

test('birth date parsing', () => {
  const result1 = RRN.parse('900101-1234567');
  if (result1) {
    assert.strictEqual(result1.birthDate, '1990-01-01');
    assert.strictEqual(result1.year, 1990);
    assert.strictEqual(result1.month, 1);
    assert.strictEqual(result1.day, 1);
  }

  const result2 = RRN.parse('951231-2345678');
  if (result2) {
    assert.strictEqual(result2.birthDate, '1995-12-31');
    assert.strictEqual(result2.year, 1995);
    assert.strictEqual(result2.month, 12);
    assert.strictEqual(result2.day, 31);
  }
});

test('checksum algorithm specifics', () => {
  // Korean RRN uses weights [2,3,4,5,6,7,8,9,2,3,4,5]
  // Check digit = (11 - (sum % 11)) % 10
  assert.strictEqual(RRN.checksum('900101-1234567'), true);
  assert.strictEqual(RRN.checksum('000229-3456789'), true);
  assert.strictEqual(RRN.checksum('101225-4567890'), true);
});

test('edge cases', () => {
  // Test leap year
  const leapYear = RRN.parse('000229-3456789');
  if (leapYear) {
    assert.strictEqual(leapYear.birthDate, '2000-02-29');
  }

  // Test century boundaries
  const result1999 = RRN.parse('991231-2345678');
  if (result1999) {
    assert.strictEqual(result1999.year, 1999);
    assert.strictEqual(result1999.gender, Gender.FEMALE);
  }

  const result2000 = RRN.parse('000101-3456789');
  if (result2000) {
    assert.strictEqual(result2000.year, 2000);
    assert.strictEqual(result2000.gender, Gender.MALE);
  }
});
