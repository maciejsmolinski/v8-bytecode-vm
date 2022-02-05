module.exports = function debug(...args) {
  if (process.env.DEBUG) {
    console.log(...['[DEBUG]', ...args]);
  }
};
