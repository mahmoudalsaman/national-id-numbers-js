import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/dza/national_id.js';

test('valid NIN numbers', () => {
  assert.strictEqual(NationalID.validate('123456789012345678'), true);
});

test('invalid NIN numbers', () => {
  assert.strictEqual(NationalID.validate('12345678901234567'), false);
  assert.strictEqual(NationalID.validate('12345678901234567A'), false);
});
