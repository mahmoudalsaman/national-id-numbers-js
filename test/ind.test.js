import test from 'node:test';
import assert from 'node:assert';
import { NationalID, UID } from '../src/nationalid/ind/national_id.js';

test('valid UID numbers', () => {
  assert.strictEqual(NationalID.validate('8924 7352 8038'), true);
  assert.strictEqual(NationalID.validate('3977 8800 0234'), true);
  assert.strictEqual(NationalID.validate('5485-5000-8800'), true);
  assert.strictEqual(NationalID.validate('475587669949'), true);
});

test('invalid UID numbers', () => {
  assert.strictEqual(NationalID.validate('47558'), false);
  assert.strictEqual(NationalID.validate('475587669940'), false);
  assert.strictEqual(NationalID.validate('175587669949'), false);
});

test('alias of', () => {
  assert.strictEqual(NationalID.METADATA.alias_of, null);
  assert.strictEqual(UID.METADATA.alias_of, NationalID);
});
