module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const register = args[0];

      logger.explain(`registers.accumulator := registers.${register}`);

      machine.registers.accumulator.set(machine.registers[register].get());
    },
  };
};
