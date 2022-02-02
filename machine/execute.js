const { debug: d } = require('./utils');
const debug = {
  op: (...args) => !process.env.EXPLAIN && d('OP', ...args),
  explain: (...args) => process.env.EXPLAIN && d('EX', ...args),
  state: (...args) => d('ST', ...args),
};

module.exports = function execute(machine, instructions) {
  machine.ip.set(0);

  let instruction;

  while ((instruction = instructions[machine.ip.get()])) {
    debug.op(instruction);

    switch (instruction[0]) {
      case 'LdaZero': {
        debug.explain('registers.accumulator := 0');

        machine.registers.accumulator.set(0);
        break;
      }
      case 'LdaSmi': {
        const value = instruction[1][0]; // Immediate value

        debug.explain('registers.accumulator := ' + value);

        machine.registers.accumulator.set(value);
        break;
      }
      case 'LdaUndefined': {
        debug.explain('registers.accumulator := undefined');

        machine.registers.accumulator.set(undefined);
        break;
      }
      case 'Star0': {
        debug.explain('registers.r0 := registers.accumulator');

        machine.registers.r0.set(machine.registers.accumulator.get());
        break;
      }
      case 'Star1': {
        debug.explain('registers.r1 := registers.accumulator');

        machine.registers.r1.set(machine.registers.accumulator.get());
        break;
      }
      case 'Star2': {
        debug.explain('registers.r2 := registers.accumulator');

        machine.registers.r2.set(machine.registers.accumulator.get());
        break;
      }
      case 'Return': {
        debug.explain('machine.return := registers.accumulator');

        machine.return.set(machine.registers.accumulator.get());
        break;
      }
      case 'MulSmi': {
        const value = instruction[1][0]; // Immediate value

        debug.explain(
          `registers.accumulator := registers.accumulator * ${value}`
        );

        machine.registers.accumulator.set(
          machine.registers.accumulator.get() * value
        );
        break;
      }
      case 'TestLessThan': {
        const register = instruction[1];

        debug.explain(
          `flags.boolean := registers.${register} < registers.accumulator`
        );

        machine.flags.boolean.set(
          machine.registers[register].get() <
            machine.registers.accumulator.get()
        );
        break;
      }
      case 'LdaConstant': {
        const [const_index] = [instruction[1][0]];

        debug.explain(`registers.accumulator := constants[${const_index}]`);

        machine.registers.accumulator.set(machine.constants[const_index]);
        break;
      }
      case 'Ldar': {
        const register = instruction[1];

        debug.explain(`registers.accumulator := registers.${register}`);

        machine.registers.accumulator.set(machine.registers[register].get());
        break;
      }
      case 'LdaGlobal': {
        const name_index = instruction[1][0]; // immediate value
        const property = machine.constants[name_index];

        debug.explain(`registers.accumulator := constants[${name_index}]`);

        machine.registers.accumulator.set(global[property]);
        break;
      }
      case 'LdaNamedProperty': {
        const [register, name_index] = [instruction[1], instruction[2][0]];
        const property = machine.constants[name_index];

        debug.explain(
          `registers.accumulator := machine.registers.${register}[${property}]`
        );

        machine.registers.accumulator.set(
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

        debug.explain(
          `registers.accumulator := machine.registers.${calleeReg}.call(machine.registers.${thisArgReg}, machine.registers.${arg1Reg})`
        );

        machine.registers.accumulator.set(callee.call(thisArg, arg1));
        break;
      }
      case 'Jump': {
        const const_index = instruction[1][0];
        const address = machine.constants[const_index];

        debug.explain(
          `[jump] ip := constants[${const_index}] (${address}) [Jump]`
        );

        machine.ip.set(address);
        continue;
      }
      case 'JumpIfFalse': {
        const const_index = instruction[1][0];
        const address = machine.constants[const_index];

        if (machine.flags.boolean.get() !== false) {
          debug.explain(
            `[skip] ip := constants[${const_index}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
          );

          break;
        }

        debug.explain(
          `[jump] ip := constants[${const_index}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
        );

        machine.ip.set(address);
        continue;
      }
      default:
        break;
    }

    machine.ip.set(machine.ip.get() + 1);
  }

  debug.state(machine.inspect());

  return machine;
};
