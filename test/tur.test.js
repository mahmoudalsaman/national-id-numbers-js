import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/tur/national_id.js';

test('valid TUR numbers', () => {
  assert.strictEqual(NationalID.validate('10000000146'), true);
  assert.strictEqual(NationalID.validate('15973515680'), true);
});

test('invalid TUR numbers', () => {
  assert.strictEqual(NationalID.validate('00000000178'), false);
  assert.strictEqual(NationalID.validate('10000000145'), false);
});

test('with regexp', () => {
  assert.match('10000000146', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
