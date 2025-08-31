import test from 'node:test';
import assert from 'node:assert';
import { FiscalCode, NationalID } from '../src/nationalid/ita/fiscal_code.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Fiscal Code numbers', () => {
  assert.strictEqual(FiscalCode.validate('MRTMTT91D08F205J'), true);
  assert.strictEqual(FiscalCode.validate('MLLSNT82P65Z404U'), true);
});

test('invalid Fiscal Code numbers', () => {
  assert.strictEqual(FiscalCode.validate('MRTMT91D08F205J'), false);
  assert.strictEqual(FiscalCode.validate('MLLSNT82X65Z404U'), false);
});

test('parse Fiscal Code', () => {
  let result = FiscalCode.parse('MLLSNT82P65Z404U');
  assert.strictEqual(result.surname_consonants, 'MLL');
  assert.strictEqual(result.firstname_consonants, 'SNT');
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1982);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 9);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 25);
  assert.strictEqual(result.area_code, 'Z404');
  assert.strictEqual(result.checksum, 'U');
  result = FiscalCode.parse('MRTMTT91D08F205J');
  assert.strictEqual(result.surname_consonants, 'MRT');
  assert.strictEqual(result.firstname_consonants, 'MTT');
  assert.strictEqual(result.yyyymmdd.getUTCFullYear(), 1991);
  assert.strictEqual(result.yyyymmdd.getUTCMonth() + 1, 4);
  assert.strictEqual(result.yyyymmdd.getUTCDate(), 8);
  assert.strictEqual(result.area_code, 'F205');
  assert.strictEqual(result.checksum, 'J');
});

test('with regexp', () => {
  assert.match('MRTMTT91D08F205J', FiscalCode.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(FiscalCode.METADATA);
});

test('alias of', () => {
  assert.strictEqual(FiscalCode.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, FiscalCode);
});
