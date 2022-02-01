const Return = require('./return');

module.exports = function Machine(
  registers = {},
  flags = {},
  ip,
  constants = []
) {
  const state = {
    registers,
    flags,
    constants,
    ip,
    return: Return(),
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
  const isWrapped = (key) => !['constants'].includes(key);
  const unwrap = (val) =>
    typeof val?.get === 'function' ? val.get() : snapshot(val);

  return Object.entries(state).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: isWrapped(key) ? unwrap(val) : val,
    };
  }, {});
}
