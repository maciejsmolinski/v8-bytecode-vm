const { debug } = require('./utils');

module.exports = function execute(machine, instructions) {
  let pointer = machine.ip.set(0);
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
      case 'Return':
        machine.return.set(machine.accumulators.a0.get());
        break;
      case 'TestLessThan':
        const first = instruction[1];
        const second = instruction[2][0]; // Immediate value

        machine.flags.boolean.set(machine.accumulators[first].get() < second);
        break;
      case 'LdaGlobal':
        const [a, b] = [instruction[1][0], instruction[2][0]];
        const [p1, p2] = [machine.constants[a], machine.constants[b]];

        machine.accumulators.a0.set(global[p1][p2]);
        break;
      default:
        break;
    }

    machine.ip.set(++pointer);
    instruction = instructions[pointer];
  }

  debug('ST', machine.inspect());

  return machine;
};
