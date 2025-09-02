import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/jor/national_id.js';

test('valid Jordanian national numbers', () => {
  assert.strictEqual(NationalID.validate('1234567890'), true);
});

test('invalid Jordanian national numbers', () => {
  assert.strictEqual(NationalID.validate('123456789'), false);
});

test('with regexp', () => {
  assert.match('1234567890', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
