import test from 'node:test';
import assert from 'node:assert';
import { SocialInsuranceNumber, NationalID } from '../src/nationalid/ca/social_insurance.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Canadian SIN numbers', () => {
  assert.strictEqual(SocialInsuranceNumber.validate('130-692-544'), true);
  assert.strictEqual(SocialInsuranceNumber.validate('046-454-286'), true);
  assert.strictEqual(SocialInsuranceNumber.validate('046-454-286'), true);
});

test('invalid Canadian SIN numbers', () => {
  // Invalid checksum
  assert.strictEqual(SocialInsuranceNumber.validate('123-456-781'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('123-456-783'), false);
  
  // Invalid sequences
  assert.strictEqual(SocialInsuranceNumber.validate('000-000-000'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('666-666-666'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('900-000-000'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('999-999-999'), false);
  
  // All same digits
  assert.strictEqual(SocialInsuranceNumber.validate('111-111-111'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('222-222-222'), false);
  
  // Wrong format
  assert.strictEqual(SocialInsuranceNumber.validate('123456789'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('12-34-56-78-9'), false);
  assert.strictEqual(SocialInsuranceNumber.validate('123.456.789'), false);
});

test('parse Canadian SIN', () => {
  const result = SocialInsuranceNumber.parse('130-692-544');
  assert.ok(result);
  assert.strictEqual(result.area, '130');
  assert.strictEqual(result.group, '692');
  assert.strictEqual(result.serial, '544');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('invalid parse Canadian SIN', () => {
  assert.strictEqual(SocialInsuranceNumber.parse('123-456-781'), null);
  assert.strictEqual(SocialInsuranceNumber.parse('000-000-000'), null);
  assert.strictEqual(SocialInsuranceNumber.parse('666-666-666'), null);
  assert.strictEqual(SocialInsuranceNumber.parse('900-000-000'), null);
  assert.strictEqual(SocialInsuranceNumber.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('130-692-544', SocialInsuranceNumber.METADATA.regexp);
  assert.match('046-454-286', SocialInsuranceNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(SocialInsuranceNumber.METADATA);
  assert.strictEqual(SocialInsuranceNumber.METADATA.iso3166_alpha2, 'CA');
  assert.strictEqual(SocialInsuranceNumber.METADATA.min_length, 9);
  assert.strictEqual(SocialInsuranceNumber.METADATA.max_length, 9);
  assert.strictEqual(SocialInsuranceNumber.METADATA.parsable, true);
  assert.strictEqual(SocialInsuranceNumber.METADATA.checksum, true);
  assert.strictEqual(SocialInsuranceNumber.METADATA.names.includes('Social Insurance Number'), true);
  assert.strictEqual(SocialInsuranceNumber.METADATA.names.includes('SIN'), true);
});

test('alias of', () => {
  assert.strictEqual(SocialInsuranceNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, SocialInsuranceNumber);
});

test('checksum validation', () => {
  // Valid SINs
  assert.strictEqual(SocialInsuranceNumber.checksum('130-692-544'), true);
  assert.strictEqual(SocialInsuranceNumber.checksum('046-454-286'), true);
  
  // Invalid SINs
  assert.strictEqual(SocialInsuranceNumber.checksum('123-456-781'), false);
  assert.strictEqual(SocialInsuranceNumber.checksum('000-000-000'), false);
  assert.strictEqual(SocialInsuranceNumber.checksum('666-666-666'), false);
  assert.strictEqual(SocialInsuranceNumber.checksum('900-000-000'), false);
});