module.exports = function Stack() {
  let stack = [];

  return {
    push: (v) => stack.push(v),
    pop: () => stack.pop(),

    // For debugging purposes
    get: () => stack,
  };
};
