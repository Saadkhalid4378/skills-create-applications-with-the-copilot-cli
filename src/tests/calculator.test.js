const { addNumbers, subtractNumbers, multiplyNumbers, divideNumbers, modulo, power, squareRoot } = require('../calculator');
const { execSync } = require('child_process');

describe('Calculator functions', () => {
  test('addition: 2 + 3 = 5', () => {
    expect(addNumbers(2, 3)).toBe(5);
  });

  test('subtraction: 10 - 4 = 6', () => {
    expect(subtractNumbers(10, 4)).toBe(6);
  });

  test('multiplication: 45 * 2 = 90', () => {
    expect(multiplyNumbers(45, 2)).toBe(90);
  });

  test('division: 20 / 5 = 4', () => {
    expect(divideNumbers(20, 5)).toBe(4);
  });

  test('division produces floating results', () => {
    expect(divideNumbers(5, 2)).toBeCloseTo(2.5);
  });

  test('division by zero throws', () => {
    expect(() => divideNumbers(1, 0)).toThrow('Division by zero');
  });

  test('non-numeric operands throw TypeError', () => {
    expect(() => addNumbers('a', 1)).toThrow(TypeError);
    expect(() => subtractNumbers(1, 'b')).toThrow(TypeError);
    expect(() => multiplyNumbers(null, 2)).toThrow(TypeError);
    expect(() => divideNumbers(1, undefined)).toThrow(TypeError);
  });

  // New tests for extended operations
  test('modulo: 5 % 2 = 1', () => {
    expect(modulo(5, 2)).toBe(1);
  });

  test('power: 2 ^ 3 = 8', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('squareRoot: sqrt(16) = 4', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('squareRoot of negative number throws', () => {
    expect(() => squareRoot(-4)).toThrow('Square root of negative number');
  });

  test('modulo by zero throws', () => {
    expect(() => modulo(5, 0)).toThrow('Division by zero');
  });
});

describe('CLI integration', () => {
  test('node src/calculator.js add 2 3 prints 5', () => {
    const out = execSync('node src/calculator.js add 2 3', { encoding: 'utf8' }).trim();
    expect(out).toBe('5');
  });

  test('node src/calculator.js divide 4 0 exits with error', () => {
    let ok = false;
    try {
      execSync('node src/calculator.js divide 4 0', { encoding: 'utf8' });
    } catch (err) {
      ok = true; // should throw
      expect(err.status).toBe(1);
      expect(err.stderr.toString()).toMatch(/division by zero|Division by zero/i);
    }
    expect(ok).toBe(true);
  });

  // CLI tests for new operations
  test('node src/calculator.js modulo 5 2 prints 1', () => {
    const out = execSync('node src/calculator.js modulo 5 2', { encoding: 'utf8' }).trim();
    expect(out).toBe('1');
  });

  test('node src/calculator.js pow 2 3 prints 8', () => {
    const out = execSync('node src/calculator.js pow 2 3', { encoding: 'utf8' }).trim();
    expect(out).toBe('8');
  });

  test('node src/calculator.js sqrt 16 prints 4', () => {
    const out = execSync('node src/calculator.js sqrt 16', { encoding: 'utf8' }).trim();
    expect(out).toBe('4');
  });

  test('node src/calculator.js sqrt -1 exits with error', () => {
    let ok = false;
    try {
      execSync('node src/calculator.js sqrt -1', { encoding: 'utf8' });
    } catch (err) {
      ok = true;
      expect(err.status).toBe(1);
      expect(err.stderr.toString()).toMatch(/square root of negative|Square root of negative number/i);
    }
    expect(ok).toBe(true);
  });
});
