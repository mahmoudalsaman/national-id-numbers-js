import test from 'node:test';
import assert from 'node:assert';
import { validate } from '../src/nationalid/esp/dni.js';

test('valid DNI numbers', () => {
  assert.strictEqual(validate('12345678Z'), true);
  assert.strictEqual(validate('10469226V'), true);
});

test('invalid DNI numbers', () => {
  assert.strictEqual(validate('1234567A'), false);
  assert.strictEqual(validate('12345678A'), false);
});
