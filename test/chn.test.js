import test from 'node:test';
import assert from 'node:assert';
import { ResidentID, NationalID } from '../src/nationalid/chn/resident_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid ResidentID numbers', () => {
  assert.strictEqual(ResidentID.validate('11010219840406970X'), true);
  assert.strictEqual(ResidentID.validate('440524188001010014'), true);
  assert.strictEqual(ResidentID.validate('11010519491231002X'), true);
});

test('invalid ResidentID numbers', () => {
  assert.strictEqual(ResidentID.validate('11010219840506970X'), false);
  assert.strictEqual(ResidentID.validate('440524189001010014'), false);
  assert.strictEqual(ResidentID.validate('11020519491231002X'), false);
});

test('parse ResidentID', () => {
  const result = ResidentID.parse('11010219840406970X');
  assert.ok(result);
  assert.strictEqual(result.address_code, '110102');
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1984);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 4);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 6);
  assert.strictEqual(result.sn, '970');
  assert.strictEqual(result.gender, Gender.FEMALE);
  assert.strictEqual(result.checksum, 'X');

  const result2 = ResidentID.parse('440524188001010014');
  assert.ok(result2);
  assert.strictEqual(result2.address_code, '440524');
  assert.strictEqual(result2.yyyymmdd.getUTCFullYear(), 1880);
  assert.strictEqual(result2.yyyymmdd.getUTCMonth() + 1, 1);
  assert.strictEqual(result2.yyyymmdd.getUTCDate(), 1);
  assert.strictEqual(result2.sn, '001');
  assert.strictEqual(result2.gender, Gender.MALE);
  assert.strictEqual(result2.checksum, 4);
});

test('alias of', () => {
  assert.strictEqual(ResidentID.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, ResidentID);
});
