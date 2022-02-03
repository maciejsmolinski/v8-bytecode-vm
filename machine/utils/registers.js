const range = require('./range');

exports.range = function (registerOrRegisters = '') {
  if (registerOrRegisters.indexOf('-') === -1) {
    return [registerOrRegisters];
  }

  const parts = registerOrRegisters.split('-');

  if (parts.length > 2) {
    throw new Error(
      `Incorrect registers range provided "${registerOrRegisters}"`
    );
  }

  const [start, end] = [Number(parts[0].slice(1)), Number(parts[1].slice(1))];

  return range(start, end).map((id) => `r${id}`);
};
