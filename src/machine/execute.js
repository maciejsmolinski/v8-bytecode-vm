const { logger } = require('../utils');
const HANDLERS = require('./ops');

const mapping = {
  Star0: 'Star',
  Star1: 'Star',
  Star2: 'Star',
  Star3: 'Star',
  Star4: 'Star',
  Star5: 'Star',
  Star6: 'Star',
  Star7: 'Star',
  Star8: 'Star',
  Star9: 'Star',
  Star10: 'Star',
  Star11: 'Star',
  Star12: 'Star',
  Star13: 'Star',
  Star14: 'Star',
  Star15: 'Star',
  CallUndefinedReceiver1: 'CallUndefinedReceiver',
};

module.exports = function execute(machine, instructions) {
  machine.ip.set(0);

  let instruction;

  while ((instruction = instructions[machine.ip.get()])) {
    const ip = machine.ip.get();
    const [mnemonic, ...args] = instruction;

    logger.op(instruction);

    const handler = HANDLERS[mnemonic] || HANDLERS[mapping[mnemonic]];

    // Handle the instruction
    if (handler) {
      handler({ machine, logger, mnemonic }).execute(...args);
    }

    // Increment instruction pointer if no jumps were made
    if (machine.ip.get() === ip) {
      machine.ip.set(machine.ip.get() + 1);
    }
  }

  logger.state(machine.inspect());

  return machine;
};
