import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/lka/national_id.js';
import { OldNationalID } from '../src/nationalid/lka/old_national_id.js';
import { Gender, Citizenship } from '../src/nationalid/constant.js';

test('valid LKA numbers', () => {
  assert.strictEqual(NationalID.validate('198713001450'), true);
  assert.strictEqual(NationalID.validate('198571700717'), true);
  assert.strictEqual(NationalID.validate('198732403040'), true);
  assert.strictEqual(NationalID.validate('200159302029'), true);
  assert.strictEqual(NationalID.validate('199612003996'), true);
  assert.strictEqual(NationalID.validate('199234004783'), true);
  assert.strictEqual(OldNationalID.validate('961203996V'), true);
  assert.strictEqual(OldNationalID.validate('790930622V'), true);
  assert.strictEqual(OldNationalID.validate('843020461V'), true);
  assert.strictEqual(OldNationalID.validate('923404716V'), true);
});

test('invalid LKA numbers', () => {
  assert.strictEqual(NationalID.validate('197419202757'), false);
  assert.strictEqual(NationalID.validate('19741920275X'), false);
  assert.strictEqual(OldNationalID.validate('790930622A'), false);
});

test('parse LKA numbers', () => {
  const result = NationalID.parse('200159302029');
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 2001);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 4);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 3);
  assert.strictEqual(result.gender, Gender.FEMALE);
  assert.strictEqual(result.sn, '0202');
  assert.strictEqual(result.checksum, 9);
  const oldResult = OldNationalID.parse('923404716V');
  assert.strictEqual(oldResult.yyyymmdd.getUTCFullYear(), 1992);
  assert.strictEqual(oldResult.yyyymmdd.getUTCMonth() + 1, 12);
  assert.strictEqual(oldResult.yyyymmdd.getUTCDate(), 5);
  assert.strictEqual(oldResult.gender, Gender.MALE);
  assert.strictEqual(oldResult.sn, '0471');
  assert.strictEqual(oldResult.checksum, 6);
  assert.strictEqual(oldResult.citizenship, Citizenship.CITIZEN);
});

test('convert old to new', () => {
  assert.strictEqual(OldNationalID.toNew('961203996V'), '199612003996');
});
