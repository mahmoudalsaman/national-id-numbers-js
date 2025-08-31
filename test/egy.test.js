import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/egy/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Egyptian ID numbers', () => {
  assert.strictEqual(NationalID.validate('29001010100015'), true);
});

test('invalid Egyptian ID numbers', () => {
  assert.strictEqual(NationalID.validate('29001010100014'), false);
});

test('parse Egyptian ID', () => {
  const result = NationalID.parse('29001010100015');
  assert.ok(result);
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1990);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 1);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 1);
  assert.strictEqual(result.governorate, '01');
  assert.strictEqual(result.sn, '0001');
  assert.strictEqual(result.gender, Gender.MALE);
  assert.strictEqual(result.checksum, 5);
});
