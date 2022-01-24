const Register = require('./register');
const Accumulator = require('./accumulator');
const Machine = require('./machine');
const execute = require('./execute');

const registers = {
  r0: Register(),
  r1: Register(),
  r2: Register(),
};

const accumulators = {
  a0: Accumulator(),
};

const flags = {
  boolean: Register(),
};

const machine = Machine(accumulators, registers, flags);

const testInstructions = [
  ['LdaZero'],
  ['Star0'],
  ['Star1'],
  ['TestLessThan', 'a0', [0]],
];

execute(machine, testInstructions);
