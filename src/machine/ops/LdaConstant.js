module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const constIndex = args[0][0];

      logger.explain(`registers.accumulator := constants[${constIndex}]`);

      machine.registers.accumulator.set(machine.constants[constIndex]);
    },
  };
};
