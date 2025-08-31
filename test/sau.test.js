import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/sau/national_id.js';
import { Citizenship } from '../src/nationalid/constant.js';

test('valid Saudi ID numbers', () => {
  assert.strictEqual(NationalID.validate('1234567893'), true);
  assert.strictEqual(NationalID.validate('2123456784'), true);
});

test('invalid Saudi ID numbers', () => {
  assert.strictEqual(NationalID.validate('1234567890'), false);
  assert.strictEqual(NationalID.validate('5234567893'), false);
});

test('parse Saudi ID', () => {
  const info = NationalID.parse('1234567893');
  assert.ok(info);
  assert.strictEqual(info.type, Citizenship.CITIZEN);
  assert.strictEqual(info.sn, '23456789');
  assert.strictEqual(info.checksum, 3);
});

test('with regexp', () => {
  assert.match('1234567893', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
});
