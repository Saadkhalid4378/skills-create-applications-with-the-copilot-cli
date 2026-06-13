#!/usr/bin/env node

// Supported operations:
// - addition (+)        : command "add"
// - subtraction (-)     : command "subtract"
// - multiplication (*)  : command "multiply"
// - division (/)        : command "divide"

// Simple Node.js CLI calculator that accepts commands like:
//   node src/calculator.js add 2 3
// and prints the numeric result to stdout.
// Returns non-zero exit codes for invalid input or errors.

function printHelp() {
  console.log(`Usage: node src/calculator.js <command> <a> <b>

Commands:
  add       Add a + b
  subtract  Subtract a - b
  multiply  Multiply a * b
  divide    Divide a / b
  modulo    Remainder of a divided by b
  pow       Power: base ^ exponent
  sqrt      Square root of a single operand

Examples:
  node src/calculator.js add 4 5       # outputs: 9
  node src/calculator.js divide 10 2   # outputs: 5
  node src/calculator.js modulo 10 3   # outputs: 1
  node src/calculator.js pow 2 8       # outputs: 256
  node src/calculator.js sqrt 9        # outputs: 3

Flags:
  --help    Show this help message
`);
}

function isNumeric(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

function parseNumber(s) {
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function exitWithError(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

// Exported arithmetic functions for testing and reuse
function addNumbers(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) throw new TypeError('Operands must be numbers');
  return a + b;
}

function subtractNumbers(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) throw new TypeError('Operands must be numbers');
  return a - b;
}

function multiplyNumbers(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) throw new TypeError('Operands must be numbers');
  return a * b;
}

function divideNumbers(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) throw new TypeError('Operands must be numbers');
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

function modulo(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) throw new TypeError('Operands must be numbers');
  if (b === 0) throw new Error('Division by zero');
  return a % b;
}

function power(base, exponent) {
  if (!isNumeric(base) || !isNumeric(exponent)) throw new TypeError('Operands must be numbers');
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (!isNumeric(n)) throw new TypeError('Operand must be a number');
  if (n < 0) throw new Error('Square root of negative number');
  return Math.sqrt(n);
}

function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const [cmd, aStr, bStr] = argv;

  const lc = cmd && cmd.toLowerCase();

  // Determine how many operands the command requires
  const unaryCommands = new Set(['sqrt', 'squareroot']);
  const binaryCommands = new Set(['add', 'subtract', 'multiply', 'divide', 'modulo', 'pow', 'power']);

  if (!lc) {
    exitWithError('Error: command is required. Use --help for usage.');
  }

  try {
    let result;
    if (unaryCommands.has(lc)) {
      if (aStr === undefined) {
        exitWithError('Error: command requires one numeric operand. Use --help for usage.');
      }
      const a = parseNumber(aStr);
      if (a === null) exitWithError('Error: operand must be a valid number.');

      switch (lc) {
        case 'sqrt':
        case 'squareroot':
          result = squareRoot(a);
          break;
        default:
          exitWithError(`Error: unknown command '${cmd}'.`);
      }
    } else if (binaryCommands.has(lc)) {
      if (aStr === undefined || bStr === undefined) {
        exitWithError('Error: command requires two numeric operands. Use --help for usage.');
      }
      const a = parseNumber(aStr);
      const b = parseNumber(bStr);
      if (a === null || b === null) exitWithError('Error: operands must be valid numbers.');

      switch (lc) {
        case 'add':
          result = addNumbers(a, b);
          break;
        case 'subtract':
          result = subtractNumbers(a, b);
          break;
        case 'multiply':
          result = multiplyNumbers(a, b);
          break;
        case 'divide':
          result = divideNumbers(a, b);
          break;
        case 'modulo':
          result = modulo(a, b);
          break;
        case 'pow':
        case 'power':
          result = power(a, b);
          break;
        default:
          exitWithError(`Error: unknown command '${cmd}'.`);
      }
    } else {
      exitWithError(`Error: unknown command '${cmd}'. Supported commands: add, subtract, multiply, divide, modulo, pow, sqrt.`);
    }

    // Print numeric result to stdout
    if (Number.isInteger(result)) {
      console.log(result);
    } else {
      console.log(parseFloat(result.toPrecision(12)).toString());
    }
  } catch (err) {
    exitWithError(`Error: ${err.message}`);
  }
}

// Entry
if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, addNumbers, subtractNumbers, multiplyNumbers, divideNumbers, modulo, power, squareRoot };
