const debug = require('./debug');

module.exports = {
  op: (...args) => debug('OP', ...args),
  explain: (...args) => process.env.EXPLAIN && debug('EX', ...args),
  state: (...args) => debug('ST', ...args),
};
