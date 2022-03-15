module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const register = args[0];

      const result =
        machine.registers[register].get() < machine.registers.accumulator.get();

      logger.explain(
        `flags.boolean := registers.${register} < registers.accumulator (${result})`
      );

      machine.flags.boolean.set(result);
    },
  };
};
