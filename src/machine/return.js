module.exports = function Return() {
  let value;

  return {
    get: () => value,
    set: (v) => (value = v),
  };
};
