import test from 'node:test';
import assert from 'node:assert';
import { NationalID, CNIC } from '../src/nationalid/pak/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid CNIC numbers', () => {
  assert.strictEqual(NationalID.validate('57469-0532456-7'), true);
  assert.strictEqual(NationalID.validate('0975345678053'), true);
  assert.strictEqual(NationalID.validate('0975431479567'), true);
  assert.strictEqual(NationalID.validate('73654-8723402-3'), true);
  assert.strictEqual(NationalID.validate('2374982638947'), true);
  assert.strictEqual(NationalID.validate('26349-6293643-8'), true);
});

test('invalid CNIC numbers', () => {
  assert.strictEqual(NationalID.validate('57469-0532456'), false);
});

test('parse CNIC', () => {
  const result = NationalID.parse('57469-0532456-7');
  assert.ok(result);
  assert.strictEqual(result.location, '57469');
  assert.strictEqual(result.sn, '0532456');
  assert.strictEqual(result.gender, Gender.MALE);
});

test('alias of', () => {
  assert.strictEqual(NationalID.METADATA.alias_of, null);
  assert.strictEqual(CNIC.METADATA.alias_of, NationalID);
});
