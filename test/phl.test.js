import test from 'node:test';
import assert from 'node:assert';
import { PhilID, NationalID } from '../src/nationalid/phl/phil_id.js';

test('valid PhilID numbers', () => {
  assert.strictEqual(PhilID.validate('1234-5678912-3'), true);
  assert.strictEqual(PhilID.validate('123456789123'), true);
});

test('invalid PhilID numbers', () => {
  assert.strictEqual(PhilID.validate('1234567890'), false);
});

test('alias of', () => {
  assert.strictEqual(PhilID.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, PhilID);
});
