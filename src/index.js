const {
  init,
  getManager,
  transactify,
} = require('./transaction-manager');
const { markTransactionFailed } = require('./transaction-manager/error-interceptor');

exports.init = (options) => {
  init(options);
};
exports.getManager = getManager;
exports.transactify = transactify;
exports.markTransactionFailed = markTransactionFailed;
