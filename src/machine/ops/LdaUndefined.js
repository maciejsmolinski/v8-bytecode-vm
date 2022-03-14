module.exports = ({ machine, logger }) => {
  return {
    execute: function () {
      logger.explain('registers.accumulator := undefined');

      machine.registers.accumulator.set(undefined);
    },
  };
};
