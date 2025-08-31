import test from 'node:test';
import assert from 'node:assert';
import { TaxID, NationalID, IdNr } from '../src/nationalid/deu/tax_id.js';

test('valid Tax ID numbers', () => {
  assert.strictEqual(TaxID.validate('65929970489'), true);
  assert.strictEqual(TaxID.validate('26954371827'), true);
  assert.strictEqual(TaxID.validate('86095742719'), true);
});

test('invalid Tax ID numbers', () => {
  assert.strictEqual(TaxID.validate('65299970480'), false);
  assert.strictEqual(TaxID.validate('26954371820'), false);
});

test('with regexp', () => {
  assert.match('65929970489', TaxID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(TaxID.METADATA);
});

test('alias of', () => {
  assert.strictEqual(TaxID.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, TaxID);
  assert.strictEqual(IdNr.METADATA.alias_of, TaxID);
});
