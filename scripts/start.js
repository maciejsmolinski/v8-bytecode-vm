const build = require('../machine');

// Invokes early return
const main = [
  ['CreateClosure', [0], [0], '#2'],
  ['Star0'],
  ['LdaGlobal', [5 + 1], [0]],
  ['Star2'],
  ['LdaNamedProperty', 'r2', [5 + 2], [2]],
  ['Star1'],
  ['LdaSmi', [-123]], // <-- param's value
  ['Star4'],
  ['CallUndefinedReceiver1', 'r1', 'r4', [5]],
  ['Star3'],
  ['CallProperty1', 'r0', 'r2', 'r3', [6]],
  ['LdaUndefined'],
  ['Return'],
];

// Early return's definition
const earlyReturn = [
  ['LdaZero'],
  ['TestLessThan', 'a0', [0]],
  ['JumpIfFalse', [5]],
  ['LdaGlobal', [0], [1]],
  ['Star1'],
  ['LdaNamedProperty', 'r1', [1], [3]],
  ['Star0'],
  ['LdaConstant', [2]],
  ['Star2'],
  ['CallProperty1', 'r0', 'r1', 'r2', [5]],
  ['Ldar', 'a0'],
  ['MulSmi', [-1], [7]],
  ['Return'],
  ['LdaGlobal', [0], [1]],
  ['Star1'],
  ['LdaNamedProperty', 'r1', [1], [3]],
  ['Star0'],
  ['LdaConstant', [3]],
  ['Star2'],
  ['CallProperty1', 'r0', 'r1', 'r2', [8]],
  ['Ldar', 'a0'],
  ['Return'],
];

const instructions = [...main, ...earlyReturn];
const mainConstants = [main.length + 13, 'console', 'log'];
const earlyReturnConstants = [
  'console',
  'log',
  'Less than zero',
  'Zero or more',
  main.length,
];
const constants = [...earlyReturnConstants, ...mainConstants];

build(constants)(instructions);
