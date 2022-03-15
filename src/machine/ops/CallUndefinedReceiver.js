const { registers: r } = require('../../utils');

module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const paramsRegister = args[1];
      const constIndex = args[2][0];
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

        logger.explain(`registers.a${index} := registers.r${registerNumber}`);
        machine.registers[`a${index}`].set(
          machine.registers[`r${registerNumber}`].get()
        );
      });

      const ip = machine.ip.get();

      logger.explain(`stack.push(ip) (${ip})`);

      machine.stack.push(ip);

      logger.explain(
        `[jump] ip := constants[${constIndex}] (${address}) [CallUndefinedReceiver]`
      );

      machine.ip.set(address);
    },
  };
};
