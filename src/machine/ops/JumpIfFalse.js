module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const constIndex = args[0][0];
      const address = machine.constants[constIndex];

      if (machine.flags.boolean.get() !== false) {
        logger.explain(
          `[skip] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
        );

        return;
      }

      logger.explain(
        `[jump] ip := constants[${constIndex}] (${address}) [JumpIfFalse, ${machine.flags.boolean.get()}]`
      );

      machine.ip.set(address);
    },
  };
};
