import test from 'node:test';
import assert from 'node:assert';
import { NRIC, NationalID } from '../src/nationalid/mys/nric.js';
import { Citizenship } from '../src/nationalid/constant.js';

test('valid NRIC numbers', () => {
  assert.strictEqual(NRIC.validate('691206-10-5330'), true);
  assert.strictEqual(NRIC.validate('510317-13-5131'), true);
  assert.strictEqual(NRIC.validate('690602-13-6118'), true);
  assert.strictEqual(NRIC.validate('801101-06-6085'), true);
});

test('invalid NRIC numbers', () => {
  assert.strictEqual(NRIC.validate('6912010533'), false);
});

test('parse NRIC', () => {
  const result = NRIC.parse('690602-13-6118');
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1969);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 6);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 2);
  assert.strictEqual(result.location, '13');
  assert.strictEqual(result.citizenship, Citizenship.CITIZEN);
  assert.strictEqual(result.sn, '6118');
});

test('with regexp', () => {
  assert.match('690602-13-6118', NRIC.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NRIC.METADATA);
});

test('alias of', () => {
  assert.strictEqual(NRIC.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NRIC);
});
