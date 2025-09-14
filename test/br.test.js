import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/nationalid/br/national_id.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Brazilian CPF numbers', () => {
  assert.strictEqual(NationalID.validate('111.444.777-35'), true);
  assert.strictEqual(NationalID.validate('123.456.789-09'), true);
  assert.strictEqual(NationalID.validate('987.654.321-00'), true);
});

test('invalid Brazilian CPF numbers', () => {
  assert.strictEqual(NationalID.validate('111.444.777-34'), false);
  assert.strictEqual(NationalID.validate('123.456.789-08'), false);
  assert.strictEqual(NationalID.validate('111.111.111-11'), false); // Invalid sequence
  assert.strictEqual(NationalID.validate('000.000.000-00'), false); // Invalid sequence
  assert.strictEqual(NationalID.validate('1234567890'), false); // Wrong format
});

test('parse Brazilian CPF', () => {
  const result = NationalID.parse('111.444.777-35');
  assert.ok(result);
  assert.strictEqual(result.region, '111');
  assert.strictEqual(result.sequence, '444');
  assert.strictEqual(result.check_digits, '35');
  assert.strictEqual(result.gender, Gender.UNKNOWN);
});

test('invalid parse Brazilian CPF', () => {
  assert.strictEqual(NationalID.parse('111.444.777-34'), null);
  assert.strictEqual(NationalID.parse('111.111.111-11'), null);
  assert.strictEqual(NationalID.parse('invalid'), null);
});

test('with regexp', () => {
  assert.match('111.444.777-35', NationalID.METADATA.regexp);
  assert.match('123.456.789-09', NationalID.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(NationalID.METADATA);
  assert.strictEqual(NationalID.METADATA.iso3166_alpha2, 'BR');
  assert.strictEqual(NationalID.METADATA.min_length, 11);
  assert.strictEqual(NationalID.METADATA.max_length, 11);
  assert.strictEqual(NationalID.METADATA.parsable, true);
  assert.strictEqual(NationalID.METADATA.checksum, true);
});
