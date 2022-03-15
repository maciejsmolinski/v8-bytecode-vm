module.exports = ({ machine, logger, mnemonic }) => {
  return {
    execute: function () {
      const registerName = mnemonic.slice(3);
      logger.explain(`registers.${registerName} := registers.accumulator`);

      machine.registers[registerName].set(machine.registers.accumulator.get());
    },
  };
};
