const Register = require('./register');
const Accumulator = require('./accumulator');
const Machine = require('./machine');
const execute = require('./execute');

function build(constants) {
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

  const machine = Machine(accumulators, registers, flags, constants);

  return function (instructions) {
    return execute(machine, instructions);
  };
}

module.exports = build;
