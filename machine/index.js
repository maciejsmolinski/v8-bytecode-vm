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
    r3: Register(),
    r4: Register(),
    r5: Register(),
    r6: Register(),
    r7: Register(),
    r8: Register(),
    r9: Register(),
    r10: Register(),
    r11: Register(),
    r12: Register(),
    r13: Register(),
    r14: Register(),
    r15: Register(),
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
