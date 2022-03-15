module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const nameIndex = args[0][0]; // immediate value
      const property = machine.constants[nameIndex];

      logger.explain(`registers.accumulator := constants[${nameIndex}]`);

      machine.registers.accumulator.set(global[property]);
    },
  };
};
