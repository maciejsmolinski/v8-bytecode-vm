const { debug } = require('./utils');

module.exports = function execute(machine, instructions) {
  let pointer = 0;
  let instruction = instructions[pointer];

  while (instruction) {
    debug('OP', instruction);

    switch (instruction[0]) {
      case 'LdaZero':
        machine.accumulators.a0.set(0);
        break;
      case 'Star0':
        machine.registers.r0.set(machine.accumulators.a0.get());
        break;
      case 'Star1':
        machine.registers.r1.set(machine.accumulators.a0.get());
        break;
      case 'Star2':
        machine.registers.r2.set(machine.accumulators.a0.get());
        break;
      case 'TestLessThan':
        const first = instruction[1];
        const second = instruction[2][0]; // Immediate value

        machine.flags.boolean.set(machine.accumulators[first] < second);
        break;
      default:
        break;
    }
    instruction = instructions[++pointer];
  }

  debug('ST', machine.inspect());
};
