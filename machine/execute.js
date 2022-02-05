const { debug: d, registers: r } = require('./utils');
const debug = {
  op: (...args) => d('OP', ...args),
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
      case 'Star0':
      case 'Star1':
      case 'Star2':
      case 'Star3':
      case 'Star4':
      case 'Star5':
      case 'Star6':
      case 'Star7':
      case 'Star8':
      case 'Star9':
      case 'Star10':
      case 'Star11':
      case 'Star12':
      case 'Star13':
      case 'Star14':
      case 'Star15': {
        const registerName = instruction[0].slice(3);
        debug.explain(`registers.${registerName} := registers.accumulator`);

        machine.registers[registerName].set(
          machine.registers.accumulator.get()
        );
        break;
      }
      case 'Return': {
        const ip = machine.stack.pop();
        const target = typeof ip !== 'undefined' ? ip + 1 : null;

        debug.explain('machine.return := registers.accumulator');
        machine.return.set(machine.registers.accumulator.get());

        debug.explain(`[jump] ip := stack.pop() (${target}) [Return]`);

        machine.ip.set(target);
        continue;
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

        const result =
          machine.registers[register].get() <
          machine.registers.accumulator.get();

        debug.explain(
          `flags.boolean := registers.${register} < registers.accumulator (${result})`
        );

        machine.flags.boolean.set(result);
        break;
      }
      case 'LdaConstant': {
        const [constIndex] = [instruction[1][0]];

        debug.explain(`registers.accumulator := constants[${constIndex}]`);

        machine.registers.accumulator.set(machine.constants[constIndex]);
        break;
      }
      case 'Ldar': {
        const register = instruction[1];

        debug.explain(`registers.accumulator := registers.${register}`);

        machine.registers.accumulator.set(machine.registers[register].get());
        break;
      }
      case 'LdaGlobal': {
        const nameIndex = instruction[1][0]; // immediate value
        const property = machine.constants[nameIndex];

        debug.explain(`registers.accumulator := constants[${nameIndex}]`);

        machine.registers.accumulator.set(global[property]);
        break;
      }
      case 'LdaNamedProperty': {
        const [register, nameIndex] = [instruction[1], instruction[2][0]];
        const property = machine.constants[nameIndex];

        debug.explain(
          `registers.accumulator := machine.registers.${register}[${property}]`
        );

        machine.registers.accumulator.set(
          machine.registers[register].get()[property]
        );
        break;
      }
      case 'CallProperty1': {
        const [calleeReg, thisArgReg, arg1Reg] = [
          instruction[1],
          instruction[2],
          instruction[3],
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
        const constIndex = instruction[1][0];
        const address = machine.constants[constIndex];

        debug.explain(
          `[jump] ip := constants[${constIndex}] (${address}) [Jump]`
        );

        machine.ip.set(address);
        continue;
      }
      case 'JumpIfFalse': {
        const constIndex = instruction[1][0];
        const address = machine.constants[constIndex];

        if (machine.flags.boolean.get() !== false) {
          debug.explain(
            `[skip] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
          );

          break;
        }

        debug.explain(
          `[jump] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
        );

        machine.ip.set(address);
        continue;
      }
      case 'CallUndefinedReceiver':
      case 'CallUndefinedReceiver1': {
        const paramsRegister = instruction[2];
        const constIndex = instruction[3][0];
        const address = machine.constants[constIndex];

        let registers;

        try {
          registers = r.range(paramsRegister);
        } catch (e) {
          throw new Error(
            'CallUndefinedReceiver failed to understand registers range',
            paramsRegister
          );
        }

        registers.forEach((register, index) => {
          const registerNumber = register.slice(1); // r0 -> 0, r2 -> 2

          debug.explain(`registers.a${index} := registers.r${registerNumber}`);
          machine.registers[`a${index}`].set(
            machine.registers[`r${registerNumber}`].get()
          );
        });

        const ip = machine.ip.get();

        debug.explain(`stack.push(ip) (${ip})`);

        machine.stack.push(ip);

        debug.explain(
          `[jump] ip := constants[${constIndex}] (${address}) [CallUndefinedReceiver]`
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
