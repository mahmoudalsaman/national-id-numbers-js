import test from 'node:test';
import assert from 'node:assert';
import { Fodselsnummer, NationalID } from '../src/nationalid/no/fodselsnummer.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Norwegian Fødselsnummer numbers', () => {
  assert.strictEqual(Fodselsnummer.validate('12345678910'), true);
  assert.strictEqual(Fodselsnummer.validate('98765432100'), true);
  assert.strictEqual(Fodselsnummer.validate('00000000000'), true);
  assert.strictEqual(Fodselsnummer.validate('12345678911'), true);
});

test('invalid Norwegian Fødselsnummer numbers', () => {
  // Wrong length
  assert.strictEqual(Fodselsnummer.validate('1234567890'), false); // Too short
  assert.strictEqual(Fodselsnummer.validate('123456789012'), false); // Too long
  
  // Invalid characters
  assert.strictEqual(Fodselsnummer.validate('1234567890a'), false);
  assert.strictEqual(Fodselsnummer.validate('1234567890-'), false);
  assert.strictEqual(Fodselsnummer.validate(''), false);
  
  // Invalid checksum
  assert.strictEqual(Fodselsnummer.validate('12345678900'), false); // Wrong checksum
  assert.strictEqual(Fodselsnummer.validate('11111111110'), false); // Wrong checksum
});

test('parse Norwegian Fødselsnummer', () => {
  const result = Fodselsnummer.parse('12345678910');
  assert.ok(result);
  assert.strictEqual(result.number, '12345678910');
  assert.strictEqual(result.birthDate, '123456');
  assert.strictEqual(result.individualNumber, '78910');
  // Gender depends on 3rd digit of individual number
  assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
});

test('parse different formats', () => {
  // Test with different individual numbers
  const result1 = Fodselsnummer.parse('12345678910');
  assert.ok(result1);
  assert.strictEqual(result1.birthDate, '123456');
  assert.strictEqual(result1.individualNumber, '78910');
  
  const result2 = Fodselsnummer.parse('98765432100');
  assert.ok(result2);
  assert.strictEqual(result2.birthDate, '987654');
  assert.strictEqual(result2.individualNumber, '32100');
});

test('invalid parse Norwegian Fødselsnummer', () => {
  assert.strictEqual(Fodselsnummer.parse('1234567890'), null); // Too short
  assert.strictEqual(Fodselsnummer.parse('123456789012'), null); // Too long
  assert.strictEqual(Fodselsnummer.parse('1234567890a'), null); // Invalid chars
  assert.strictEqual(Fodselsnummer.parse('12345678900'), null); // Wrong checksum
  assert.strictEqual(Fodselsnummer.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('12345678910', Fodselsnummer.METADATA.regexp);
  assert.match('98765432100', Fodselsnummer.METADATA.regexp);
  assert.match('00000000000', Fodselsnummer.METADATA.regexp);
  assert.match('12345678911', Fodselsnummer.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(Fodselsnummer.METADATA);
  assert.strictEqual(Fodselsnummer.METADATA.iso3166_alpha2, 'NO');
  assert.strictEqual(Fodselsnummer.METADATA.min_length, 11);
  assert.strictEqual(Fodselsnummer.METADATA.max_length, 11);
  assert.strictEqual(Fodselsnummer.METADATA.parsable, true);
  assert.strictEqual(Fodselsnummer.METADATA.checksum, true);
  assert.strictEqual(Fodselsnummer.METADATA.names.includes('Fødselsnummer'), true);
  assert.strictEqual(Fodselsnummer.METADATA.names.includes('Norwegian Personal Number'), true);
  assert.strictEqual(Fodselsnummer.METADATA.names.includes('Birth Number'), true);
});

test('alias of', () => {
  assert.strictEqual(Fodselsnummer.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, Fodselsnummer);
});

test('checksum validation', () => {
  // Valid Fødselsnummer
  assert.strictEqual(Fodselsnummer.checksum('12345678910'), true);
  assert.strictEqual(Fodselsnummer.checksum('98765432100'), true);
  
  // Invalid format
  assert.strictEqual(Fodselsnummer.checksum('1234567890'), false); // Too short
  assert.strictEqual(Fodselsnummer.checksum('123456789012'), false); // Too long
  assert.strictEqual(Fodselsnummer.checksum('invalid'), false); // Invalid format
  
  // Invalid checksum
  assert.strictEqual(Fodselsnummer.checksum('12345678900'), false); // Wrong checksum
  assert.strictEqual(Fodselsnummer.checksum('11111111111'), false); // Wrong checksum
});

test('gender detection', () => {
  // Test gender detection based on 3rd digit of individual number
  const result1 = Fodselsnummer.parse('12345678910');
  if (result1) {
    const genderDigit = parseInt(result1.individualNumber[2]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result1.gender, expectedGender);
  }
  
  const result2 = Fodselsnummer.parse('98765432100');
  if (result2) {
    const genderDigit = parseInt(result2.individualNumber[2]);
    const expectedGender = genderDigit % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    assert.strictEqual(result2.gender, expectedGender);
  }
});
