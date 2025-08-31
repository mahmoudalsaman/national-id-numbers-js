import test from 'node:test';
import assert from 'node:assert';
import { SocialSecurityNumber, NationalID } from '../src/nationalid/usa/social_security.js';

test('valid SSN numbers', () => {
  assert.strictEqual(SocialSecurityNumber.validate('012-12-0928'), true);
});

test('invalid SSN numbers', () => {
  assert.strictEqual(SocialSecurityNumber.validate('987-12-0928'), false);
  assert.strictEqual(SocialSecurityNumber.validate('666-12-0000'), false);
});

test('with regexp', () => {
  assert.match('012-12-0928', SocialSecurityNumber.METADATA.regexp);
});

test('with metadata', () => {
  assert.ok(SocialSecurityNumber.METADATA);
});

test('alias of', () => {
  assert.strictEqual(SocialSecurityNumber.METADATA.alias_of, null);
  assert.strictEqual(NationalID.METADATA.alias_of, SocialSecurityNumber);
});
