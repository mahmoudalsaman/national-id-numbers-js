import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/irn/national_id.js';

test('valid Iran national ID numbers', () => {
  assert.strictEqual(NationalID.validate('472-171992-2'), true);
  assert.strictEqual(NationalID.validate('4608968882'), true);
  assert.strictEqual(NationalID.validate('1111111111'), true);
  assert.strictEqual(NationalID.validate('0939092001'), true);
});

test('invalid Iran national ID numbers', () => {
  assert.strictEqual(NationalID.validate('472-171992-1'), false);
  assert.strictEqual(NationalID.validate('2130396217'), false);
  assert.strictEqual(NationalID.validate('0000000001'), false);
  assert.strictEqual(NationalID.validate('abcd1234'), false);
});
