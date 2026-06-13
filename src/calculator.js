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

Examples:
  node src/calculator.js add 4 5       # outputs: 9
  node src/calculator.js divide 10 2   # outputs: 5

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

function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const [cmd, aStr, bStr] = argv;

  if (!cmd || aStr === undefined || bStr === undefined) {
    exitWithError('Error: command and two numeric operands are required. Use --help for usage.');
  }

  const a = parseNumber(aStr);
  const b = parseNumber(bStr);
  if (a === null || b === null) {
    exitWithError('Error: operands must be valid numbers.');
  }

  let result;
  try {
    switch (cmd.toLowerCase()) {
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
      default:
        exitWithError(`Error: unknown command '${cmd}'. Supported commands: add, subtract, multiply, divide.`);
    }
  } catch (err) {
    exitWithError(`Error: ${err.message}`);
  }

  // Print numeric result to stdout
  if (Number.isInteger(result)) {
    console.log(result);
  } else {
    // Print a clean floating result (trim unnecessary trailing zeros)
    console.log(parseFloat(result.toPrecision(12)).toString());
  }
}

// Entry
if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, addNumbers, subtractNumbers, multiplyNumbers, divideNumbers };
