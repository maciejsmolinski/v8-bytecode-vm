const build = require('../machine');

const instructions = [
  ['LdaZero'],
  ['Star0'],
  ['Star1'],
  ['Star2'],
  ['TestLessThan', 'a0', [0]],
];

build()(instructions);
