import test from 'node:test';
import assert from 'node:assert';
import { AsmensKodas, NationalID } from '../src/nationalid/lt/asmens_kodas.js';
import { Gender } from '../src/nationalid/constant.js';

test('valid Lithuanian Asmens kodas numbers', () => {
    assert.strictEqual(AsmensKodas.validate('12301010000'), true);
    assert.strictEqual(AsmensKodas.validate('22301010009'), true);
    assert.strictEqual(AsmensKodas.validate('32301010008'), true);
    assert.strictEqual(AsmensKodas.validate('42301010007'), true);
});

test('invalid Lithuanian Asmens kodas numbers', () => {
    // Wrong length
    assert.strictEqual(AsmensKodas.validate('1234567890'), false); // Too short
    assert.strictEqual(AsmensKodas.validate('123456789012'), false); // Too long

    // Invalid characters
    assert.strictEqual(AsmensKodas.validate('1234567890a'), false);
    assert.strictEqual(AsmensKodas.validate('1234567890-'), false);
    assert.strictEqual(AsmensKodas.validate(''), false);

    // Invalid checksum
    assert.strictEqual(AsmensKodas.validate('12345678900'), false); // Wrong checksum
    assert.strictEqual(AsmensKodas.validate('11111111110'), false); // Wrong checksum
});

test('parse Lithuanian Asmens kodas', () => {
    const result = AsmensKodas.parse('12345678901');
    assert.ok(result);
    assert.strictEqual(result.number, '12345678901');
    assert.ok(result.gender === Gender.MALE || result.gender === Gender.FEMALE);
    assert.ok(result.birthDate);
    assert.ok(result.year);
    assert.ok(result.month);
    assert.ok(result.day);
});

test('parse different formats', () => {
    // Test with different Asmens kodas numbers
    const result1 = AsmensKodas.parse('12301010000');
    assert.ok(result1);
    assert.strictEqual(result1.number, '12301010000');

    const result2 = AsmensKodas.parse('22301010009');
    assert.ok(result2);
    assert.strictEqual(result2.number, '22301010009');
});

test('invalid parse Lithuanian Asmens kodas', () => {
    assert.strictEqual(AsmensKodas.parse('1234567890'), null); // Too short
    assert.strictEqual(AsmensKodas.parse('123456789012'), null); // Too long
    assert.strictEqual(AsmensKodas.parse('1234567890a'), null); // Invalid chars
    assert.strictEqual(AsmensKodas.parse('12345678900'), null); // Wrong checksum
    assert.strictEqual(AsmensKodas.parse('invalid'), null);
});

test('with regexp', () => {
    assert.match('12301010000', AsmensKodas.METADATA.regexp);
    assert.match('22301010009', AsmensKodas.METADATA.regexp);
    assert.match('32301010008', AsmensKodas.METADATA.regexp);
    assert.match('42301010007', AsmensKodas.METADATA.regexp);
});

test('with metadata', () => {
    assert.ok(AsmensKodas.METADATA);
    assert.strictEqual(AsmensKodas.METADATA.iso3166_alpha2, 'LT');
    assert.strictEqual(AsmensKodas.METADATA.min_length, 11);
    assert.strictEqual(AsmensKodas.METADATA.max_length, 11);
    assert.strictEqual(AsmensKodas.METADATA.parsable, true);
    assert.strictEqual(AsmensKodas.METADATA.checksum, true);
    assert.strictEqual(AsmensKodas.METADATA.names.includes('Asmens kodas'), true);
    assert.strictEqual(AsmensKodas.METADATA.names.includes('Lithuanian Personal Code'), true);
    assert.strictEqual(AsmensKodas.METADATA.names.includes('Lithuanian National ID'), true);
});

test('alias of', () => {
    assert.strictEqual(AsmensKodas.METADATA.alias_of, null);
    assert.strictEqual(NationalID.METADATA.alias_of, AsmensKodas);
});

test('checksum validation', () => {
    // Valid Asmens kodas
    assert.strictEqual(AsmensKodas.checksum('12301010000'), true);
    assert.strictEqual(AsmensKodas.checksum('22301010009'), true);

    // Invalid format
    assert.strictEqual(AsmensKodas.checksum('1234567890'), false); // Too short
    assert.strictEqual(AsmensKodas.checksum('123456789012'), false); // Too long
    assert.strictEqual(AsmensKodas.checksum('invalid'), false); // Invalid format

    // Invalid checksum
    assert.strictEqual(AsmensKodas.checksum('12345678900'), false); // Wrong checksum
    assert.strictEqual(AsmensKodas.checksum('11111111110'), false); // Wrong checksum
});

test('gender detection', () => {
    // Test gender detection based on first digit
    const result1 = AsmensKodas.parse('12301010000');
    if (result1) {
        const firstDigit = parseInt(result1.number[0]);
        const expectedGender = (firstDigit % 2 === 0) ? Gender.FEMALE : Gender.MALE;
        assert.strictEqual(result1.gender, expectedGender);
    }

    const result2 = AsmensKodas.parse('22301010009');
    if (result2) {
        const firstDigit = parseInt(result2.number[0]);
        const expectedGender = (firstDigit % 2 === 0) ? Gender.FEMALE : Gender.MALE;
        assert.strictEqual(result2.gender, expectedGender);
    }
});

test('birth date parsing', () => {
    // Test birth date extraction
    const result = AsmensKodas.parse('12301010000');
    if (result) {
        assert.ok(result.birthDate);
        assert.ok(result.year);
        assert.ok(result.month);
        assert.ok(result.day);
        assert.strictEqual(typeof result.year, 'number');
        assert.strictEqual(typeof result.month, 'number');
        assert.strictEqual(typeof result.day, 'number');
    }
});
