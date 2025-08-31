import test from 'node:test';
import assert from 'node:assert';
import { INSEE, NationalID } from '../src/nationalid/fra/insee.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid INSEE numbers', () => {
  assert.strictEqual(INSEE.validate('255081416802538'), true);
  assert.strictEqual(INSEE.validate('283209921625930'), true);
  assert.strictEqual(INSEE.validate('255082A16802597'), true);
});

test('invalid INSEE numbers', () => {
  assert.strictEqual(INSEE.validate('180126955222381'), false);
  assert.strictEqual(INSEE.validate('255082E16802597'), false);
});

test('parse INSEE', () => {
  const result = INSEE.parse('255082A16802597');
  assert.strictEqual(result.gender, Gender.FEMALE);
  assert.strictEqual(result.yy, '55');
  assert.strictEqual(result.mm, '08');
  assert.strictEqual(result.checksum, '97');
});

test('with regexp', () => {
  assert.match('255081416802538', INSEE.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(INSEE.METADATA);
});

test('alias of', () => {
  assert.strictEqual(INSEE.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, INSEE);
});
