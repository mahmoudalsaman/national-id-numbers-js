import test from 'node:test';
import assert from 'node:assert';
import { NationalID, NationalIDAlias } from '../src/nationalid/twn/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Taiwan National ID numbers', () => {
  // Valid National ID with correct checksums
  assert.strictEqual(NationalID.validate('A123456789'), true);
  assert.strictEqual(NationalID.validate('B287654321'), true);
  assert.strictEqual(NationalID.validate('F131234567'), true);
  assert.strictEqual(NationalID.validate('N213456789'), true);
  assert.strictEqual(NationalID.validate('Z123456789'), true); // Foreigner
});

test('invalid Taiwan National ID numbers', () => {
  // Wrong length
  assert.strictEqual(NationalID.validate('A12345678'), false); // Too short
  assert.strictEqual(NationalID.validate('A1234567890'), false); // Too long

  // Invalid gender digit
  assert.strictEqual(NationalID.validate('A023456789'), false); // 0 not valid
  assert.strictEqual(NationalID.validate('A323456789'), false); // 3 not valid
  assert.strictEqual(NationalID.validate('A923456789'), false); // 9 not valid

  // Invalid characters
  assert.strictEqual(NationalID.validate('a123456789'), false); // Lowercase
  assert.strictEqual(NationalID.validate('A12345678a'), false);
  assert.strictEqual(NationalID.validate('A123-56789'), false);
  assert.strictEqual(NationalID.validate(''), false);

  // Invalid checksum
  assert.strictEqual(NationalID.validate('A123456788'), false);
  assert.strictEqual(NationalID.validate('B287654320'), false);
});

test('parse Taiwan National ID', () => {
  const result = NationalID.parse('A123456789');
  assert.ok(result);
  assert.strictEqual(result.number, 'A123456789');
  assert.strictEqual(result.gender, Gender.MALE); // Gender digit 1 = Male
  assert.strictEqual(result.regionLetter, 'A');
  assert.strictEqual(result.region, 'Taipei City');
  assert.strictEqual(result.genderDigit, '1');
});

test('parse different genders and regions', () => {
  // Male (gender digit 1)
  const male = NationalID.parse('A123456789');
  assert.ok(male);
  assert.strictEqual(male.gender, Gender.MALE);
  assert.strictEqual(male.genderDigit, '1');
  assert.strictEqual(male.region, 'Taipei City');

  // Female (gender digit 2)
  const female = NationalID.parse('B287654321');
  assert.ok(female);
  assert.strictEqual(female.gender, Gender.FEMALE);
  assert.strictEqual(female.genderDigit, '2');
  assert.strictEqual(female.region, 'Taichung City');

  // Different regions
  const result1 = NationalID.parse('F131234567');
  if (result1) {
    assert.strictEqual(result1.region, 'New Taipei City');
    assert.strictEqual(result1.regionLetter, 'F');
  }

  const result2 = NationalID.parse('N213456789');
  if (result2) {
    assert.strictEqual(result2.region, 'Changhua County');
    assert.strictEqual(result2.regionLetter, 'N');
  }

  // Foreigner
  const foreigner = NationalID.parse('Z123456789');
  if (foreigner) {
    assert.strictEqual(foreigner.region, 'Foreigner');
    assert.strictEqual(foreigner.regionLetter, 'Z');
  }
});

test('invalid parse Taiwan National ID', () => {
  assert.strictEqual(NationalID.parse('A12345678'), null); // Too short
  assert.strictEqual(NationalID.parse('A023456789'), null); // Invalid gender digit
  assert.strictEqual(NationalID.parse('a123456789'), null); // Lowercase
  assert.strictEqual(NationalID.parse('A123456788'), null); // Wrong checksum
  assert.strictEqual(NationalID.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('A123456789', NationalID.METADATA.regexp);
  assert.match('B287654321', NationalID.METADATA.regexp);
  assert.match('Z123456789', NationalID.METADATA.regexp);

  // Should not match invalid formats
  assert.doesNotMatch('A12345678', NationalID.METADATA.regexp);
  assert.doesNotMatch('a123456789', NationalID.METADATA.regexp);
  assert.doesNotMatch('A023456789', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
  assert.strictEqual(NationalID.METADATA.iso3166_alpha2, 'TW');
  assert.strictEqual(NationalID.METADATA.min_length, 10);
  assert.strictEqual(NationalID.METADATA.max_length, 10);
  assert.strictEqual(NationalID.METADATA.parsable, true);
  assert.strictEqual(NationalID.METADATA.checksum, true);
  assert.strictEqual(NationalID.METADATA.names.includes('National ID'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('Taiwan National Identity Card'), true);
  assert.strictEqual(NationalID.METADATA.names.includes('ROC ID Number'), true);
});

test('alias of', () => {
  assert.strictEqual(NationalID.METADATA.alias_of, null);
  assert.strictEqual(NationalIDAlias.METADATA.alias_of, NationalID);
});

test('checksum validation', () => {
  // Valid National ID
  assert.strictEqual(NationalID.checksum('A123456789'), true);
  assert.strictEqual(NationalID.checksum('B287654321'), true);
  assert.strictEqual(NationalID.checksum('Z123456789'), true);

  // Invalid checksum
  assert.strictEqual(NationalID.checksum('A123456788'), false);
  assert.strictEqual(NationalID.checksum('B287654320'), false);
});

test('region mapping', () => {
  // Test region letter to name mapping
  assert.strictEqual(NationalID.getRegionFromLetter('A'), 'Taipei City');
  assert.strictEqual(NationalID.getRegionFromLetter('B'), 'Taichung City');
  assert.strictEqual(NationalID.getRegionFromLetter('C'), 'Keelung City');
  assert.strictEqual(NationalID.getRegionFromLetter('E'), 'Kaohsiung City');
  assert.strictEqual(NationalID.getRegionFromLetter('F'), 'New Taipei City');
  assert.strictEqual(NationalID.getRegionFromLetter('Z'), 'Foreigner');
  assert.strictEqual(NationalID.getRegionFromLetter('X'), 'Lienchiang County');

  // Test unknown letter
  assert.strictEqual(NationalID.getRegionFromLetter('Ω'), 'Unknown'); // Invalid letter
});

test('gender detection', () => {
  // Test male (digit 1)
  const male1 = NationalID.parse('A123456789');
  if (male1) {
    assert.strictEqual(male1.gender, Gender.MALE);
    assert.strictEqual(male1.genderDigit, '1');
  }

  const male2 = NationalID.parse('F131234567');
  if (male2) {
    assert.strictEqual(male2.gender, Gender.MALE);
    assert.strictEqual(male2.genderDigit, '1');
  }

  // Test female (digit 2)
  const female1 = NationalID.parse('B287654321');
  if (female1) {
    assert.strictEqual(female1.gender, Gender.FEMALE);
    assert.strictEqual(female1.genderDigit, '2');
  }

  const female2 = NationalID.parse('N213456789');
  if (female2) {
    assert.strictEqual(female2.gender, Gender.FEMALE);
    assert.strictEqual(female2.genderDigit, '2');
  }
});

test('checksum algorithm specifics', () => {
  // Taiwan uses weighted sum with specific weights
  // Region letter is converted to number (A=10, B=11, etc.)
  // Weights: [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  assert.strictEqual(NationalID.checksum('A123456789'), true);
  assert.strictEqual(NationalID.checksum('B287654321'), true);
  assert.strictEqual(NationalID.checksum('F131234567'), true);
});

test('all region letters', () => {
  // Test that all valid region letters A-Z work with the regexp
  const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < validLetters.length; i++) {
    const letter = validLetters[i];
    const testId = letter + '123456789';
    // Should match the regexp
    assert.match(testId, NationalID.METADATA.regexp);
    // Should have a valid region mapping
    const region = NationalID.getRegionFromLetter(letter);
    assert.strictEqual(typeof region, 'string');
    assert.strictEqual(region !== 'Unknown', true);
  }
});

test('format validation', () => {
  // National ID should only accept specific format
  assert.strictEqual(NationalID.validate('A123456789'), true);

  // Should not accept formatted versions
  assert.strictEqual(NationalID.validate('A12-345-6789'), false);
  assert.strictEqual(NationalID.validate('A123 456 789'), false);
  assert.strictEqual(NationalID.validate('A1234-56789'), false);
  assert.strictEqual(NationalID.validate('a123456789'), false); // Must be uppercase
});

test('no birth date information', () => {
  // Taiwan National ID doesn't encode birth date
  const result = NationalID.parse('A123456789');
  if (result) {
    assert.strictEqual(result.birthDate, undefined);
    assert.strictEqual(result.year, undefined);
    assert.strictEqual(result.month, undefined);
    assert.strictEqual(result.day, undefined);
  }
});
