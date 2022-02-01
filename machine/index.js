const Register = require('./register');
const Accumulator = require('./accumulator');
const Machine = require('./machine');
const execute = require('./execute');

function build(constants) {
  const registers = {
    accumulator: Accumulator(),
    r0: Register(),
    r1: Register(),
    r2: Register(),
    a0: Register(),
    a1: Register(),
    a2: Register(),
  };

  const flags = {
    boolean: Register(),
  };

  const ip = Register();

  const machine = Machine(registers, flags, ip, constants);

  return function (instructions) {
    return execute(machine, instructions);
  };
}

module.exports = build;
