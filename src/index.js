const Manager = require('./manager');
exports.TransactionManager = require('./manager/context-manager');

exports.init = (options) => {
  Manager.init(options);
};
