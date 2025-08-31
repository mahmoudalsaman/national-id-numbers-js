import test from 'node:test';
import assert from 'node:assert';
import { NIK, NationalID } from '../src/nationalid/idn/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid NIK numbers', () => {
  assert.strictEqual(NIK.validate('7105100607610439'), true);
  assert.strictEqual(NIK.validate('7105102902040439'), true);
});

test('invalid NIK numbers', () => {
  assert.strictEqual(NIK.validate('7105102902020439'), false);
  assert.strictEqual(NIK.validate('0950060607610439'), false);
  assert.strictEqual(NIK.validate('7105101613610439'), false);
  assert.strictEqual(NIK.validate('7105100607610000'), false);
});

test('parse NIK', () => {
  const result = NIK.parse('7105100607610439');
  assert.strictEqual(result.dd, '06');
  assert.strictEqual(result.mm, '07');
  assert.strictEqual(result.yy, '61');
});

test('with regexp', () => {
  assert.match('7105100607610439', NIK.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NIK.METADATA);
});

test('alias of', () => {
  assert.strictEqual(NIK.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NIK);
});
