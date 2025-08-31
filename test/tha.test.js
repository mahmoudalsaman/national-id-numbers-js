import test from 'node:test';
import assert from 'node:assert';
import { NationalID, ThaiCitizenship } from '../src/nationalid/tha/national_id.js';

test('valid THA numbers', () => {
  assert.strictEqual(NationalID.validate('3-8013-00141-07-4'), true);
  assert.strictEqual(NationalID.validate('3 8013 00141 07 4'), true);
  assert.strictEqual(NationalID.validate('3801300141074'), true);
  assert.strictEqual(NationalID.validate('3 6701 01122 56 9'), true);
  assert.strictEqual(NationalID.validate('3 4117 00830 33 4'), true);
  assert.strictEqual(NationalID.validate('1 9099 00064 64 0'), true);
  assert.strictEqual(NationalID.validate('5 9306 00015 56 7'), true);
  assert.strictEqual(NationalID.validate('2 9014 01009 21 1'), true);
});

test('invalid THA numbers', () => {
  assert.strictEqual(NationalID.validate('3-8013/00141-07-4'), false);
  assert.strictEqual(NationalID.validate('3 8010141 07 4'), false);
  assert.strictEqual(NationalID.validate('3801300141071'), false);
});

test('parse THA', () => {
  const result = NationalID.parse('3 4117 00830 33 4');
  assert.strictEqual(result.citizenship, ThaiCitizenship.CITIZEN_BEFORE_1984);
  assert.strictEqual(result.province_code, '41');
  assert.strictEqual(result.district_code, '17');
  assert.strictEqual(result.sn, '0083033');
  assert.strictEqual(result.checksum, 4);
});

test('with regexp', () => {
  assert.match('3801300141074', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
