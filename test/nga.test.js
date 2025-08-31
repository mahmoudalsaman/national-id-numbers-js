import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/nga/national_id.js';

test('valid NIN numbers', () => {
  assert.strictEqual(NationalID.validate('12345678901'), true);
});

test('invalid NIN numbers', () => {
  assert.strictEqual(NationalID.validate('1234567890A'), false);
});

test('with regexp', () => {
  assert.match('12345678901', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
