const build = require('../machine');

const main = [
  ['CreateClosure', [0], [0], '#2'],
  ['Star0'],
  ['LdaSmi', [-5]],
  ['Star2'],
  ['CallUndefinedReceiver1', 'r0', 'r2', [4]],
  ['LdaUndefined'],
  ['Return'],
];

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

const mainConstants = [main.length + 13];

const earlyReturnConstants = [
  'console',
  'log',
  'Less than zero',
  'Zero or more',
  main.length,
];

const instructions = [...main, ...earlyReturn];
const constants = [...earlyReturnConstants, ...mainConstants];

build(constants)(instructions);
