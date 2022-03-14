module.exports = ({ machine, logger }) => {
  return {
    execute: function () {
      logger.explain('registers.accumulator := 0');

      machine.registers.accumulator.set(0);
    },
  };
};
