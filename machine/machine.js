module.exports = function Machine(accumulators, registers) {
  const state = {
    accumulators,
    registers,
  };

  return {
    ...state,
    inspect: () => inspect(state),
  };
};

function snapshot(object) {
  return Object.entries(object).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: val.get(),
    };
  }, {});
}

function inspect(state) {
  return {
    accumulators: snapshot(state.accumulators),
    registers: snapshot(state.registers),
  };
}
