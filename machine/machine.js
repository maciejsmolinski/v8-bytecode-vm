module.exports = function Machine(accumulators, registers) {
  const state = {
    accumulators,
    registers,
  };

  return state;
};
