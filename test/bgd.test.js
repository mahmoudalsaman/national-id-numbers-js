import test from 'node:test';
import assert from 'node:assert';
import { OldNationalID, ResidentialType } from '../src/nationalid/bgd/old_national_id.js';
import { NationalID } from '../src/nationalid/bgd/national_id.js';

test('valid Bangladesh IDs', () => {
  assert.strictEqual(OldNationalID.validate('1592824588424'), true);
  assert.strictEqual(OldNationalID.validate('2610413965404'), true);
  assert.strictEqual(NationalID.validate('19841592824588424'), true);
  assert.strictEqual(NationalID.validate('19892610413965404'), true);
});

test('invalid Bangladesh IDs', () => {
  assert.strictEqual(OldNationalID.validate('159282458842'), false);
  assert.strictEqual(OldNationalID.validate('1572824588424'), false);
  assert.strictEqual(NationalID.validate('1984159282458844'), false);
});

test('parse old Bangladesh ID', () => {
  const result = OldNationalID.parse('1592824588424');
  assert.ok(result);
  assert.strictEqual(result.distinct, '15');
  assert.strictEqual(result.residential_type, ResidentialType.CITY_CORPORATION);
  assert.strictEqual(result.policy_station_no, '28');
  assert.strictEqual(result.union_code, '24');
  assert.strictEqual(result.sn, '588424');
});

test('parse new Bangladesh ID', () => {
  const result = NationalID.parse('19892610413965404');
  assert.ok(result);
  assert.strictEqual(result.yyyy, 1989);
  assert.strictEqual(result.distinct, '26');
  assert.strictEqual(result.residential_type, ResidentialType.RURAL);
  assert.strictEqual(result.policy_station_no, '04');
  assert.strictEqual(result.union_code, '13');
  assert.strictEqual(result.sn, '965404');
});
