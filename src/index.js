const Manager = require('./transaction-manager');
const { getManager: getTransactionManager } = require('./transaction-manager/manager')
const { getRequestContext } = require('./request-context');

exports.TransactionManager = require('./transaction-manager/manager');
exports.init = (options) => {
  Manager.init(options);
};
exports.getManager = (identifier) => {
  const context = getRequestContext(identifier);
  if (context) {
    const transactionId = context.get('id');
    return getTransactionManager(transactionId);
  }
};
