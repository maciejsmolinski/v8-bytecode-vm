module.exports = ({ machine, logger }) => {
  return {
    execute: function () {
      const ip = machine.stack.pop();
      const target = typeof ip !== 'undefined' ? ip + 1 : null;

      logger.explain('machine.return := registers.accumulator');
      machine.return.set(machine.registers.accumulator.get());

      logger.explain(`[jump] ip := stack.pop() (${target}) [Return]`);

      machine.ip.set(target);
    },
  };
};
