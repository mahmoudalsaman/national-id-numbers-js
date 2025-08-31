import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/vnm/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid VNM numbers', () => {
  assert.strictEqual(NationalID.validate('020093001656'), true);
});

test('invalid VNM numbers', () => {
  assert.strictEqual(NationalID.validate('0200930016561'), false);
  assert.strictEqual(NationalID.validate('02009316561'), false);
});

test('parse VNM', () => {
  const result = NationalID.parse('020093001656');
  assert.strictEqual(result.province_country_code, '020');
  assert.strictEqual(result.yyyy, 1993);
  assert.strictEqual(result.gender, Gender.MALE);
  assert.strictEqual(result.sn, '001656');
});

test('with regexp', () => {
  assert.match('020093001656', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
