const asyncHooks = require('async_hooks');

class Namespace {
  constructor() {
    this.context = {};
  }

  run(fn, tid) {
    const eid = asyncHooks.executionAsyncId();
    this.context[eid] = {};
    this.context[tid] = [];
    fn();
  }

  set(key, val) {
    const eid = asyncHooks.executionAsyncId();
    this.context[val] = this.context[val] || [];
    this.context[val].push(eid);
    this.context[eid][key] = val;
  }

  get(key) {
    const eid = asyncHooks.executionAsyncId();
    return this.context[eid] && this.context[eid][key];
  }
}

module.exports = Namespace;