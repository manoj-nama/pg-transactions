const {
  getRequestContext,
} = require('../request-context');
const {
  getManager,
} = require('./manager');
const nsIdentifier = 'service-risk-register-db-transaction';


const fetchTransaction = () => {
  const context = getRequestContext(nsIdentifier);
  try {
    const transactionId = context.get('tid');
    return getManager(transactionId);
  } catch (err) {
    log.debug('Transaction not initialized for this Query');
  }
};

const markTransactionFailed = () => {
  const transaction = fetchTransaction();
  if (transaction) {
    transaction.markFailed();
  }
};

module.exports = {
  markTransactionFailed
};