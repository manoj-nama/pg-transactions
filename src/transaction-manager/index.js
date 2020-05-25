const uuid = require('uuid/v1');
const {
  getRequestContext,
  cleanUpContext
} = require('../request-context');
const {
  getManager: getTransactionManager,
  removeManager,
  createManager,
  init: initManager
} = require('./manager');

let log = require('../log');
let nsIdentifier = 'pg-db-transaction';

const getManager = (identifier) => {
  const context = getRequestContext(identifier);
  try {
    if (context) {
      const transactionId = context.get('id');
      return getTransactionManager(transactionId);
    }
  } catch (err) {
    log.error('Transaction not initialized for this Query');
  }
};

const wrapHandlerWithContext = handler => (req, res, next) => {
  const context = getRequestContext(nsIdentifier);
  const tid = uuid();
  createManager(tid);
  context.run(async () => {
    context.set('tid', tid);
    await handler(req, res, next);
    return next();
  });
};

const postHandler = async () => {
  const transaction = getManager(nsIdentifier);

  removeManager(tid);
  if (transaction.success) {
    await transaction.complete();
  } else {
    await transaction.abort();
  }

  cleanUpContext(nsIdentifier);
};

exports.init = ({ identifier, logger }) => {
  nsIdentifier = identifier;
  log = logger;
  initManager(logger);
};

exports.transactify = handler => {
  return [
    wrapHandlerWithContext(handler),
    postHandler,
  ];
};

exports.getManager = getManager;
