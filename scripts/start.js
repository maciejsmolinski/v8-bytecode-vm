const build = require('../machine');

const instructions = [
  ['Jump', [3]],
  ['LdaZero'],
  ['LdaGlobal', [0], [1]],
  ['Star0'],
  ['LdaNamedProperty', 'r0', [1], [3]],
  ['Star1'],
  ['LdaConstant', [2]],
  ['Star2'],
  ['CallProperty1', 'r1', 'r0', 'r2', [5]],
  ['LdaSmi', [6]],
  ['Star0'],
  ['TestLessThan', 'r0', [0]],
  ['MulSmi', [5], [0]],
  ['Return'],
];

const constants = ['console', 'log', '•• Hello World ••', 1];

build(constants)(instructions);
