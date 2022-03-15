module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const [register, nameIndex] = [args[0], args[1][0]];
      const property = machine.constants[nameIndex];

      logger.explain(
        `registers.accumulator := machine.registers.${register}[${property}]`
      );

      machine.registers.accumulator.set(
        machine.registers[register].get()[property]
      );
    },
  };
};
