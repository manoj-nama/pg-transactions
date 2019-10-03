const ErrorCtor = global.Error;
let onInitialize = () => { };
let isEnabled = false;

class MyCustomError extends Error {
  constructor(msg) {
    super(msg);
    onInitialize(msg);
  }
}

const enable = function (onInitializeCB) {
  if (isEnabled) {
    return;
  }
  isEnabled = true;
  global.Error = MyCustomError;
  onInitialize = onInitializeCB || onInitialize;
};

const disable = function () {
  global.Error = ErrorCtor;
  isEnabled = false;
};

module.exports = {
  enable,
  disable
};
