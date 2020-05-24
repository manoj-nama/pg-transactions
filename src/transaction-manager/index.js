const uuid = require('uuid/v1');
const {
  getRequestContext,
  cleanUpContext
} = require('../request-context');
const {
  getManager,
  removeManager,
  createManager,
  init: initManager
} = require('./context-manager');
const ErrorInterceptor = require('./error-interceptor');
let log = require('../log');
let nsIdentifier = 'pg-db-transaction';


const fetchTransaction = () => {
  const context = getRequestContext(nsIdentifier);
  try {
    const transactionId = context.get('tid');
    return getManager(transactionId);
  } catch (err) {
    console.log(err);
    log.error('Transaction not initialized for this Query');
  }
};

const wrapHandlerWithContext = handler => (req, res, next) => {
  ErrorInterceptor.enable(onErrorInit);

  const context = getRequestContext(nsIdentifier);
  const tid = uuid();
  createManager(tid);
  context.run(async () => {
    context.set('tid', tid);
    await handler(req, res, next);
    return next();
  });
};

const onErrorInit = () => {
  const transaction = fetchTransaction();
  if (transaction) {
    transaction.markFailed();
  }
};

const postHandler = async () => {
  const transaction = fetchTransaction();

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
