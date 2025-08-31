import test from 'node:test';
import assert from 'node:assert';
import { NationalInsuranceNumber, NationalID } from '../src/nationalid/gbr/national_insurance.js';

test('valid NINO numbers', () => {
  assert.strictEqual(NationalInsuranceNumber.validate('AB123456A'), true);
  assert.strictEqual(NationalInsuranceNumber.validate('AA012344B'), true);
});

test('invalid NINO numbers', () => {
  assert.strictEqual(NationalInsuranceNumber.validate('AD123456A'), false);
  assert.strictEqual(NationalInsuranceNumber.validate('BO012344B'), false);
  assert.strictEqual(NationalInsuranceNumber.validate('GB012344B'), false);
  assert.strictEqual(NationalInsuranceNumber.validate('AB111111G'), false);
});

test('with regexp', () => {
  assert.match('AB123456A', NationalInsuranceNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalInsuranceNumber.METADATA);
});

test('alias of', () => {
  assert.strictEqual(NationalInsuranceNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, NationalInsuranceNumber);
});
