const { logger } = require('../utils');
const {
  CallProperty1,
  CallUndefinedReceiver,
  Debugger,
  Jump,
  LdaConstant,
  LdaGlobal,
  LdaNamedProperty,
  Ldar,
  LdaSmi,
  LdaUndefined,
  LdaZero,
  MulSmi,
  Return,
  Star,
  TestLessThan,
} = require('./ops');

module.exports = function execute(machine, instructions) {
  machine.ip.set(0);

  let instruction;

  while ((instruction = instructions[machine.ip.get()])) {
    const [instructionName, ...args] = instruction;

    logger.op(instruction);

    switch (instruction[0]) {
      case 'LdaZero': {
        LdaZero({ machine, logger }).execute();
        break;
      }
      case 'LdaSmi': {
        LdaSmi({ machine, logger }).execute(...args);
        break;
      }
      case 'LdaUndefined': {
        LdaUndefined({ machine, logger }).execute();
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
        Star({ machine, logger, instruction: instructionName }).execute();
        break;
      }
      case 'Return': {
        Return({ machine, logger }).execute();
        continue;
      }
      case 'MulSmi': {
        MulSmi({ machine, logger }).execute(...args);
        break;
      }
      case 'TestLessThan': {
        TestLessThan({ machine, logger }).execute(...args);
        break;
      }
      case 'LdaConstant': {
        LdaConstant({ machine, logger }).execute(...args);
        break;
      }
      case 'Ldar': {
        Ldar({ machine, logger }).execute(...args);
        break;
      }
      case 'LdaGlobal': {
        LdaGlobal({ machine, logger }).execute(...args);
        break;
      }
      case 'LdaNamedProperty': {
        LdaNamedProperty({ machine, logger }).execute(...args);
        break;
      }
      case 'CallProperty1': {
        CallProperty1({ machine, logger }).execute(...args);
        break;
      }
      case 'Jump': {
        Jump({ machine, logger }).execute(...args);
        continue;
      }
      case 'JumpIfFalse': {
        const constIndex = instruction[1][0];
        const address = machine.constants[constIndex];

        if (machine.flags.boolean.get() !== false) {
          logger.explain(
            `[skip] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
          );

          break;
        }

        logger.explain(
          `[jump] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
        );

        machine.ip.set(address);
        continue;
      }
      case 'CallUndefinedReceiver':
      case 'CallUndefinedReceiver1': {
        CallUndefinedReceiver({ machine, logger }).execute(...args);
        continue;
      }
      case 'Debugger': {
        Debugger({ machine, logger }).execute();
        break;
      }
      default:
        break;
    }

    machine.ip.set(machine.ip.get() + 1);
  }

  logger.state(machine.inspect());

  return machine;
};
