export function validateRegexp(idNumber, regexp) {
  if (typeof idNumber !== 'string') {
    throw new TypeError('id_number MUST be str');
  }
  return regexp.test(idNumber);
}

export function luhnDigit(digits, multipliersStartByTwo = false) {
  let totalSum = 0;
  const workingDigits = multipliersStartByTwo ? [0, ...digits] : digits;
  workingDigits.forEach((intVal, idx) => {
    if (idx % 2 === 0) {
      totalSum += intVal;
    } else if (intVal > 4) {
      totalSum += 2 * intVal - 9;
    } else {
      totalSum += 2 * intVal;
    }
  });
  return (10 - (totalSum % 10)) % 10;
}

const VERHOEFF = {
  D_TABLE: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0],
  ],
  P_TABLE: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8],
  ],
};

export function verhoeffCheck(digits) {
  const revDigits = [...digits].reverse();
  let c = 0;
  revDigits.forEach((num, idx) => {
    const pVal = VERHOEFF.P_TABLE[idx % 8][num];
    c = VERHOEFF.D_TABLE[c][pVal];
  });
  return c === 0;
}

export function weightedModulusDigit(numbers, weights, divider, modulusOnly = false) {
  const actualWeights = weights ?? Array(numbers.length).fill(1);
  if (numbers.length > actualWeights.length) {
    throw new Error('numbers length must be less than or equal to weights length');
  }
  const modulus = numbers.reduce((sum, val, idx) => sum + val * actualWeights[idx], 0) % divider;
  return modulusOnly ? modulus : divider - modulus;
}

export function mnModulusDigit(numbers, m, n) {
  let product = m;
  for (const number of numbers) {
    let total = (number + product) % m;
    if (total === 0) {
      total = m;
    }
    product = (2 * total) % n;
  }
  return n - product;
}

export function modulusOverflowMod10(modulus) {
  return modulus > 9 ? modulus % 10 : modulus;
}

export function letterToNumber(letter, capital = true) {
  if (typeof letter !== 'string' || letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
    throw new TypeError('only allow one alphabet');
  }
  const code = letter.charCodeAt(0);
  return capital ? code - 64 : code - 96;
}

export function ean13Digit(numbers) {
  let odd = 0;
  let even = 0;
  numbers.forEach((value, index) => {
    if ((index + 1) % 2 === 0) {
      even += value;
    } else {
      odd += value;
    }
  });
  const total = even * 2 + odd;
  const modulus = total % 10;
  return modulus === 0 ? 0 : 10 - modulus;
}

export function aliasOf(cls) {
  if (!('METADATA' in cls)) {
    throw new Error(`the type ${cls} must have METADATA attribute`);
  }
  const metadata = { ...cls.METADATA, alias_of: cls };
  class AliasType extends cls {}
  AliasType.METADATA = metadata;
  return AliasType;
}
