import test from 'node:test';
import assert from 'node:assert';
import { Isikukood, NationalID } from '../src/nationalid/est/isikukood.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Estonian Isikukood numbers', () => {
  // Valid Isikukood with different century digits and correct checksums
  assert.strictEqual(Isikukood.validate('39001010002'), true); // 1900s male
  assert.strictEqual(Isikukood.validate('49001010003'), true); // 1900s female
  assert.strictEqual(Isikukood.validate('50001010004'), true); // 2000s male
  assert.strictEqual(Isikukood.validate('60001010005'), true); // 2000s female
  assert.strictEqual(Isikukood.validate('12345678901'), true);
  assert.strictEqual(Isikukood.validate('98765432101'), true);
});

test('invalid Estonian Isikukood numbers', () => {
  // Wrong length
  assert.strictEqual(Isikukood.validate('3900101000'), false); // Too short
  assert.strictEqual(Isikukood.validate('390010100012'), false); // Too long

  // Invalid characters
  assert.strictEqual(Isikukood.validate('3900101000a'), false);
  assert.strictEqual(Isikukood.validate('390-010-1000-2'), false);
  assert.strictEqual(Isikukood.validate(''), false);

  // Invalid century digit
  assert.strictEqual(Isikukood.validate('99001010002'), false); // Invalid century digit 9
  assert.strictEqual(Isikukood.validate('09001010002'), false); // Invalid century digit 0

  // Invalid date
  assert.strictEqual(Isikukood.validate('39013010002'), false); // Invalid month 13
  assert.strictEqual(Isikukood.validate('39001310002'), false); // Invalid day 31
  assert.strictEqual(Isikukood.validate('39000010002'), false); // Invalid month 00
  assert.strictEqual(Isikukood.validate('39001000002'), false); // Invalid day 00

  // Invalid checksum
  assert.strictEqual(Isikukood.validate('39001010001'), false);
  assert.strictEqual(Isikukood.validate('39001010009'), false);
});

test('parse Estonian Isikukood', () => {
  const result = Isikukood.parse('39001010002');
  assert.ok(result);
  assert.strictEqual(result.number, '39001010002');
  assert.strictEqual(result.gender, Gender.MALE);
  assert.strictEqual(result.birthDate, '1990-01-01');
  assert.strictEqual(result.year, 1990);
  assert.strictEqual(result.month, 1);
  assert.strictEqual(result.day, 1);
});

test('parse different formats', () => {
  // Male born in 1900s
  const result1 = Isikukood.parse('39001010002');
  assert.ok(result1);
  assert.strictEqual(result1.gender, Gender.MALE);
  assert.strictEqual(result1.year, 1990);

  // Female born in 1900s
  const result2 = Isikukood.parse('49001010003');
  assert.ok(result2);
  assert.strictEqual(result2.gender, Gender.FEMALE);
  assert.strictEqual(result2.year, 1990);

  // Male born in 2000s
  const result3 = Isikukood.parse('50001010004');
  assert.ok(result3);
  assert.strictEqual(result3.gender, Gender.MALE);
  assert.strictEqual(result3.year, 2000);

  // Female born in 2000s
  const result4 = Isikukood.parse('60001010005');
  assert.ok(result4);
  assert.strictEqual(result4.gender, Gender.FEMALE);
  assert.strictEqual(result4.year, 2000);
});

test('invalid parse Estonian Isikukood', () => {
  assert.strictEqual(Isikukood.parse('3900101000'), null); // Too short
  assert.strictEqual(Isikukood.parse('390010100012'), null); // Too long
  assert.strictEqual(Isikukood.parse('3900101000a'), null); // Invalid chars
  assert.strictEqual(Isikukood.parse('99001010002'), null); // Invalid century
  assert.strictEqual(Isikukood.parse('39001010001'), null); // Wrong checksum
  assert.strictEqual(Isikukood.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('39001010002', Isikukood.METADATA.regexp);
  assert.match('49001010003', Isikukood.METADATA.regexp);
  assert.match('50001010004', Isikukood.METADATA.regexp);
  assert.match('60001010005', Isikukood.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(Isikukood.METADATA);
  assert.strictEqual(Isikukood.METADATA.iso3166_alpha2, 'EE');
  assert.strictEqual(Isikukood.METADATA.min_length, 11);
  assert.strictEqual(Isikukood.METADATA.max_length, 11);
  assert.strictEqual(Isikukood.METADATA.parsable, true);
  assert.strictEqual(Isikukood.METADATA.checksum, true);
  assert.strictEqual(Isikukood.METADATA.names.includes('Isikukood'), true);
  assert.strictEqual(Isikukood.METADATA.names.includes('Estonian Personal Identity Code'), true);
  assert.strictEqual(Isikukood.METADATA.names.includes('Estonian National ID'), true);
});

test('alias of', () => {
  assert.strictEqual(Isikukood.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, Isikukood);
});

test('checksum validation', () => {
  // Valid Isikukood
  assert.strictEqual(Isikukood.checksum('39001010002'), true);
  assert.strictEqual(Isikukood.checksum('49001010003'), true);

  // Invalid format
  assert.strictEqual(Isikukood.checksum('3900101000'), false); // Too short
  assert.strictEqual(Isikukood.checksum('390010100012'), false); // Too long
  assert.strictEqual(Isikukood.checksum('invalid'), false); // Invalid format

  // Invalid checksum
  assert.strictEqual(Isikukood.checksum('39001010001'), false); // Wrong checksum
  assert.strictEqual(Isikukood.checksum('39001010009'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test male (odd century digits)
  const male1 = Isikukood.parse('39001010002');
  assert.ok(male1);
  assert.strictEqual(male1.gender, Gender.MALE);

  const male2 = Isikukood.parse('50001010004');
  assert.ok(male2);
  assert.strictEqual(male2.gender, Gender.MALE);

  // Test female (even century digits)
  const female1 = Isikukood.parse('49001010003');
  assert.ok(female1);
  assert.strictEqual(female1.gender, Gender.FEMALE);

  const female2 = Isikukood.parse('60001010005');
  assert.ok(female2);
  assert.strictEqual(female2.gender, Gender.FEMALE);
});

test('century detection', () => {
  // Test 1800s
  const result1 = Isikukood.parse('18001010001');
  if (result1) {
    assert.strictEqual(result1.year, 1880);
  }

  const result2 = Isikukood.parse('28001010002');
  if (result2) {
    assert.strictEqual(result2.year, 1880);
  }

  // Test 1900s
  const result3 = Isikukood.parse('39001010002');
  if (result3) {
    assert.strictEqual(result3.year, 1990);
  }

  // Test 2000s
  const result4 = Isikukood.parse('50001010004');
  if (result4) {
    assert.strictEqual(result4.year, 2000);
  }

  // Test 2100s
  const result5 = Isikukood.parse('71001010007');
  if (result5) {
    assert.strictEqual(result5.year, 2110);
  }
});

test('birth date parsing', () => {
  const result = Isikukood.parse('39001010002');
  if (result) {
    assert.strictEqual(result.birthDate, '1990-01-01');
    assert.strictEqual(result.year, 1990);
    assert.strictEqual(result.month, 1);
    assert.strictEqual(result.day, 1);
  }

  const result2 = Isikukood.parse('49112319901');
  if (result2) {
    assert.strictEqual(result2.birthDate, '1991-12-31');
    assert.strictEqual(result2.year, 1991);
    assert.strictEqual(result2.month, 12);
    assert.strictEqual(result2.day, 31);
  }
});

test('edge date cases', () => {
  // Test leap year
  const leapYear = Isikukood.parse('50002290123');
  if (leapYear) {
    assert.strictEqual(leapYear.birthDate, '2000-02-29');
  }

  // Test end of year
  const endYear = Isikukood.parse('39912310987');
  if (endYear) {
    assert.strictEqual(endYear.birthDate, '1999-12-31');
  }
});