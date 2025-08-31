import test from 'node:test';
import assert from 'node:assert';
import { EmiratesIDNumber, NationalID } from '../src/nationalid/are/emirates_id.js';

test('valid Emirates ID numbers', () => {
  assert.strictEqual(EmiratesIDNumber.validate('784-1980-1234567-8'), true);
  assert.strictEqual(EmiratesIDNumber.validate('784198012345678'), true);
  assert.strictEqual(EmiratesIDNumber.validate('784-1979-1234567-1'), true);
  assert.strictEqual(EmiratesIDNumber.validate('784-1952-0464048-6'), true);
  assert.strictEqual(EmiratesIDNumber.validate('784-1968-6570305-0'), true);
});

test('invalid Emirates ID numbers', () => {
  assert.strictEqual(EmiratesIDNumber.validate('784-1981-1234567-9'), false);
  assert.strictEqual(EmiratesIDNumber.validate('784198212345679'), false);
  assert.strictEqual(EmiratesIDNumber.validate('784-199234567-1'), false);
  assert.strictEqual(EmiratesIDNumber.validate('784-2002-12345'), false);
});

test('parse Emirates ID', () => {
  const result = EmiratesIDNumber.parse('784-1968-6570305-0');
  assert.ok(result);
  assert.strictEqual(result.yyyy, 1968);
  assert.strictEqual(result.sn, '6570305');
  assert.strictEqual(result.checksum, 0);
});

test('alias of', () => {
  assert.strictEqual(EmiratesIDNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, EmiratesIDNumber);
});
