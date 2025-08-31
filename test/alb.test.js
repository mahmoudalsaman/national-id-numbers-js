import test from 'node:test';
import assert from 'node:assert';
import { IdentityNumber, NationalID } from '../src/nationalid/alb/identity_number.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid NID numbers', () => {
  assert.strictEqual(IdentityNumber.validate('I90308094A'), true);
});

test('invalid NID numbers', () => {
  assert.strictEqual(IdentityNumber.validate('Z90308094Z'), false);
});

test('parse NID', () => {
  const result = IdentityNumber.parse('I90308094A');
  assert.ok(result);
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1989);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 3);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 8);
  assert.strictEqual(result.sn, '094');
  assert.strictEqual(result.checksum, 'A');
  assert.strictEqual(result.gender, Gender.MALE);
});

test('alias of', () => {
  assert.strictEqual(IdentityNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, IdentityNumber);
});
