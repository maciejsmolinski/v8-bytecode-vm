const { debug } = require('./utils');

module.exports = function execute(machine, instructions) {
  let pointer = machine.ip.set(0);
  let instruction = instructions[pointer];

  while (instruction) {
    debug('OP', instruction);

    switch (instruction[0]) {
      case 'LdaZero': {
        machine.accumulators.a0.set(0);
        break;
      }
      case 'Star0': {
        machine.registers.r0.set(machine.accumulators.a0.get());
        break;
      }
      case 'Star1': {
        machine.registers.r1.set(machine.accumulators.a0.get());
        break;
      }
      case 'Star2': {
        machine.registers.r2.set(machine.accumulators.a0.get());
        break;
      }
      case 'Return': {
        machine.return.set(machine.accumulators.a0.get());
        break;
      }
      case 'TestLessThan': {
        const first = instruction[1];
        const second = instruction[2][0]; // Immediate value

        machine.flags.boolean.set(machine.accumulators[first].get() < second);
        break;
      }
      case 'LdaConstant': {
        const [const_index] = [instruction[1][0]];

        machine.accumulators.a0.set(machine.constants[const_index]);
        break;
      }
      case 'LdaGlobal': {
        const [name_index, feedback_slot_index] = [
          instruction[1][0],
          instruction[2][0],
        ];
        const property = machine.constants[name_index];

        machine.accumulators.a0.set(global[property]);
        break;
      }
      case 'LdaNamedProperty': {
        const [register, name_index, feedback_slot_index] = [
          instruction[1],
          instruction[2][0],
          instruction[3][0],
        ];
        const property = machine.constants[name_index];

        machine.accumulators.a0.set(
          machine.registers[register].get()[property]
        );
        break;
      }
      case 'CallProperty1': {
        const [calleeReg, thisArgReg, arg1Reg, feedback_slot_index] = [
          instruction[1],
          instruction[2],
          instruction[3],
          instruction[4][0],
        ];

        const [callee, thisArg, arg1] = [
          machine.registers[calleeReg].get(),
          machine.registers[thisArgReg].get(),
          machine.registers[arg1Reg].get(),
        ];

        machine.accumulators.a0.set(callee.call(thisArg, arg1));
        break;
      }
      default:
        break;
    }

    machine.ip.set(++pointer);
    instruction = instructions[pointer];
  }

  debug('ST', machine.inspect());

  return machine;
};
