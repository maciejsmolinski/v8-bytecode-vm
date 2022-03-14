module.exports = ({ machine, logger, instruction }) => {
  return {
    execute: function () {
      const registerName = instruction.slice(3);
      logger.explain(`registers.${registerName} := registers.accumulator`);

      machine.registers[registerName].set(machine.registers.accumulator.get());
    },
  };
};
