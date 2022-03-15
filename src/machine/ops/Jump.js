module.exports = ({ machine, logger }) => {
  return {
    execute: function (...args) {
      const constIndex = args[0][0];
      const address = machine.constants[constIndex];

      logger.explain(
        `[jump] ip := constants[${constIndex}] (${address}) [Jump]`
      );

      machine.ip.set(address);
    },
  };
};
