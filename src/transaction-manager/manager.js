let log = {};
const managers = {};

class ContextManager {
  success = true;
  constructor(id) {
    this.id = id;
  }

  markFailed() {
    this.success = false;
  }

  async setClient(client) {
    this.client = client;
    await this.begin();
  }

  getClient() {
    return this.client;
  }

  async release() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  async begin() {
    if (this.client) {
      log.info(`Starting transaction`, this.id);
      await this.client.query('BEGIN');
    }
  }

  async abort() {
    if (this.client) {
      log.info(`Rollback`, this.id);
      await this.client.query('ROLLBACK');
      await this.release();
    }
  }

  async complete() {
    if (this.client) {
      log.info(`Commiting transaction`, this.id);
      await this.client.query('COMMIT');
      await this.release();
    }
  }
}

exports.init = logger => {
  log = logger;
};
exports.createManager = tid => {
  const manager = new ContextManager(tid);
  managers[tid] = manager;
  return manager;
};

exports.getManager = tid => managers[tid];
exports.removeManager = tid => {
  delete managers[tid];
};
