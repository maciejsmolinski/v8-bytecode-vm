const build = require('../machine');

const instructions = [
  ['LdaZero'],
  ['TestLessThan', 'a0', [0]],
  ['LdaGlobal', [0], [1]],
  ['Star0'],
  ['LdaNamedProperty', 'r0', [1], [3]],
  ['Star1'],
  ['LdaConstant', [2]],
  ['Star2'],
  ['CallProperty1', 'r1', 'r0', 'r2', [5]],
  ['LdaZero'],
  ['Star0'],
  ['Return'],
];

const constants = ['console', 'log', '•• Hello World ••'];

build(constants)(instructions);
