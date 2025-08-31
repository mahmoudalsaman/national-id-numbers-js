import test from 'node:test';
import assert from 'node:assert';
import {
  luhnDigit,
  verhoeffCheck,
  weightedModulusDigit,
  mnModulusDigit,
  modulusOverflowMod10,
  letterToNumber,
  ean13Digit,
} from '../src/nationalid/util.js';
import { Gender, Citizenship } from '../src/nationalid/constant.js';

test('constants', () => {
  assert.strictEqual(Gender.MALE, 'male');
  assert.strictEqual(Citizenship.FOREIGN, 'foreign');
});

test('luhn digit', () => {
  assert.strictEqual(luhnDigit([1,2,3,4,5,6,7,8]), 2);
  assert.strictEqual(luhnDigit([1,2,3,4,5,6,7,8], true), 6);
});

test('verhoeff check', () => {
  assert.strictEqual(verhoeffCheck([1,2,3,4,5]), false);
  assert.strictEqual(verhoeffCheck([0,0,0,0]), false);
});

test('weighted modulus digit', () => {
  assert.strictEqual(weightedModulusDigit([1,2,3], [3,2,1], 11), 1);
});

test('mn modulus digit', () => {
  assert.strictEqual(mnModulusDigit([1,2,3], 11, 9), 5);
});

test('modulus overflow', () => {
  assert.strictEqual(modulusOverflowMod10(18), 8);
});

test('letter to number', () => {
  assert.strictEqual(letterToNumber('C'), 3);
  assert.strictEqual(letterToNumber('c', false), 3);
});

test('ean13 digit', () => {
  assert.strictEqual(ean13Digit([8,9,0,1,2,3,4,5,6,7,8,9]), 4);
});
