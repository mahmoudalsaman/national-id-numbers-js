import test from 'node:test';
import assert from 'node:assert';
import { NationalID } from '../src/index.js';

const validEgyptian = '29001010100015';

test('validate and parse Egyptian ID via NationalID class', () => {
  assert.strictEqual(NationalID.validate('EG', validEgyptian), true);
  const info = NationalID.parse('EG', validEgyptian);
  assert.strictEqual(info.governorate, '01');
});

test('validate US SSN via NationalID class', () => {
  assert.strictEqual(NationalID.validate('US', '012-12-0928'), true);
});

