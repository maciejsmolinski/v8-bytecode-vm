module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const [calleeReg, thisArgReg, arg1Reg] = [args[0], args[1], args[2]];

      const [callee, thisArg, arg1] = [
        machine.registers[calleeReg].get(),
        machine.registers[thisArgReg].get(),
        machine.registers[arg1Reg].get(),
      ];

      logger.explain(
        `registers.accumulator := machine.registers.${calleeReg}.call(machine.registers.${thisArgReg}, machine.registers.${arg1Reg})`
      );

      machine.registers.accumulator.set(callee.call(thisArg, arg1));
    },
  };
};
