import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/afg/national_id.js';

test('valid Tazkira numbers', () => {
  assert.strictEqual(NationalID.validate('1234-5678-90123'), true);
  assert.strictEqual(NationalID.validate('1234567890123'), true);
});

test('invalid Tazkira numbers', () => {
  assert.strictEqual(NationalID.validate('1234-5678-9012'), false);
  assert.strictEqual(NationalID.validate('1234-567-90123'), false);
});

