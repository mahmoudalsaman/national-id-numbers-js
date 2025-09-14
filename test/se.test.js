import test from 'node:test';
import assert from 'node:assert';
import { Personnummer, NationalID } from '../src/nationalid/se/personnummer.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Swedish Personnummer numbers', () => {
  assert.strictEqual(Personnummer.validate('123456-7893'), true);
  assert.strictEqual(Personnummer.validate('987654+3213'), true);
  assert.strictEqual(Personnummer.validate('000000-0000'), true);
  assert.strictEqual(Personnummer.validate('111111-1117'), true);
});

test('invalid Swedish Personnummer numbers', () => {
  // Wrong length
  assert.strictEqual(Personnummer.validate('123456789'), false); // Too short
  assert.strictEqual(Personnummer.validate('12345678901'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(Personnummer.validate('123456789a'), false);
  assert.strictEqual(Personnummer.validate('123456-789a'), false);
  assert.strictEqual(Personnummer.validate(''), false);
  
  // Invalid format
  assert.strictEqual(Personnummer.validate('1234567890'), false); // Missing separator
  assert.strictEqual(Personnummer.validate('12345-67890'), false); // Wrong length
  
  // Invalid checksum
  assert.strictEqual(Personnummer.validate('123456-7891'), false); // Wrong checksum
  assert.strictEqual(Personnummer.validate('111111-1112'), false); // Wrong checksum
});

test('parse Swedish Personnummer', () => {
  const result = Personnummer.parse('123456-7893');
  assert.ok(result);
  assert.strictEqual(result.number, '1234567893');
  assert.strictEqual(result.birthDate, '123456');
  assert.strictEqual(result.individualNumber, '7893');
  // Gender depends on 3rd digit of individual number
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
});

test('parse different formats', () => {
  // Test with different individual numbers
  const result1 = Personnummer.parse('123456-7893');
  assert.ok(result1);
  assert.strictEqual(result1.birthDate, '123456');
  assert.strictEqual(result1.individualNumber, '7893');
  
  const result2 = Personnummer.parse('987654+3213');
  assert.ok(result2);
  assert.strictEqual(result2.birthDate, '987654');
  assert.strictEqual(result2.individualNumber, '3213');
});

test('invalid parse Swedish Personnummer', () => {
  assert.strictEqual(Personnummer.parse('123456789'), null); // Too short
  assert.strictEqual(Personnummer.parse('12345678901'), null); // Too long
  assert.strictEqual(Personnummer.parse('123456789a'), null); // Invalid chars
  assert.strictEqual(Personnummer.parse('123456-7891'), null); // Wrong checksum
  assert.strictEqual(Personnummer.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('123456-7893', Personnummer.METADATA.regexp);
  assert.match('987654+3213', Personnummer.METADATA.regexp);
  assert.match('000000-0000', Personnummer.METADATA.regexp);
  assert.match('111111-1117', Personnummer.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(Personnummer.METADATA);
  assert.strictEqual(Personnummer.METADATA.iso3166_alpha2, 'SE');
  assert.strictEqual(Personnummer.METADATA.min_length, 11);
  assert.strictEqual(Personnummer.METADATA.max_length, 11);
  assert.strictEqual(Personnummer.METADATA.parsable, true);
  assert.strictEqual(Personnummer.METADATA.checksum, true);
  assert.strictEqual(Personnummer.METADATA.names.includes('Personnummer'), true);
  assert.strictEqual(Personnummer.METADATA.names.includes('Swedish Personal Number'), true);
  assert.strictEqual(Personnummer.METADATA.names.includes('Personal Identity Number'), true);
});

test('alias of', () => {
  assert.strictEqual(Personnummer.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, Personnummer);
});

test('checksum validation', () => {
  // Valid Personnummer
  assert.strictEqual(Personnummer.checksum('123456-7893'), true);
  assert.strictEqual(Personnummer.checksum('987654+3213'), true);
  
  // Invalid format
  assert.strictEqual(Personnummer.checksum('123456789'), false); // Too short
  assert.strictEqual(Personnummer.checksum('12345678901'), false); // Too long
  assert.strictEqual(Personnummer.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(Personnummer.checksum('123456-7891'), false); // Wrong checksum
  assert.strictEqual(Personnummer.checksum('111111-1112'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on 3rd digit of individual number
  const result1 = Personnummer.parse('123456-7893');
  if (result1) {
    const genderDigit = parseInt(result1.individualNumber[2]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = Personnummer.parse('987654+3213');
  if (result2) {
    const genderDigit = parseInt(result2.individualNumber[2]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});
