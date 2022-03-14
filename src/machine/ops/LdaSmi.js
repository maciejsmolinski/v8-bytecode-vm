module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const value = args[0][0]; // Immediate value

      logger.explain('registers.accumulator := ' + value);

      machine.registers.accumulator.set(value);
    },
  };
};
