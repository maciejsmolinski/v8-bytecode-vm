const build = require('../machine');

const instructions = [
  ['LdaZero'],
  ['Star0'],
  ['Star1'],
  ['Star2'],
  ['TestLessThan', 'a0', [0]],
  ['LdaGlobal', [0], [1]],
  ['Star1'],
  ['LdaConstant', [2]],
  ['Star2'],
  ['LdaZero'],
  ['Return'],
];

const constants = ['console', 'log', 'Less than zero', 'Zero or more'];

build(constants)(instructions);
