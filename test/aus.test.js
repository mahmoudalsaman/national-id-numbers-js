import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/aus/tax_file_number.js';

test('valid TFN numbers', () => {
  assert.strictEqual(NationalID.validate('123456782'), true);
  assert.strictEqual(NationalID.validate('100000001'), true);
  assert.strictEqual(NationalID.validate('123 456 782'), true);
});

test('invalid TFN numbers', () => {
  assert.strictEqual(NationalID.validate('123456789'), false);
  assert.strictEqual(NationalID.validate('12345678A'), false);
});
