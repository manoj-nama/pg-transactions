const asyncHooks = require('async_hooks');
const Namespace = require('./namespace');

const namespaces = {};

function createHooks(namespace) {
  function init(asyncId, type, executionTriggerId, resource) {
    if (namespace.context[executionTriggerId]) {
      const tid = namespace.context[executionTriggerId || asyncId].tid;
      if (tid) {
        namespace.context[tid].push(asyncId);
      }
      namespace.context[asyncId] = namespace.context[executionTriggerId];
    }
  }

  function destroy(asyncId) {
    delete namespace.context[asyncId];
  }

  const asyncHook = asyncHooks.createHook({ init, destroy });
  asyncHook.enable();
}

function getRequestContext(name) {
  if (namespaces[name]) {
    return namespaces[name];
  }

  const namespace = new Namespace();
  namespaces[name] = namespace;

  createHooks(namespace);

  return namespace;
}

function cleanUpContext(name) {
  const ns = namespaces[name];
  const tid = ns.get('tid');
  const pendingAsyncIds = ns.context[tid];
  if (pendingAsyncIds.length) {
    pendingAsyncIds.forEach(id => {
      delete ns.context[id];
    });
  }
  delete ns.context[tid];
  return null;
}

module.exports = {
  getRequestContext,
  cleanUpContext,
};
