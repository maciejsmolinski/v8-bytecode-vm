module.exports = function Machine(
  accumulators = {},
  registers = {},
  flags = {}
) {
  const state = {
    accumulators,
    registers,
    flags,
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
  return Object.entries(state).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: snapshot(val),
    };
  }, {});
}
