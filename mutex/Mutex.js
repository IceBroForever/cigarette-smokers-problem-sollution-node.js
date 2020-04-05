const MutexStatuses = require("./MutexStatuses");

module.exports = class Mutex {
  constructor(sab = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT)) {
    if (!(sab instanceof SharedArrayBuffer))
      throw new TypeError("Sab should be SharedArrayBuffer");
    this._sab = sab;
    this._mu = new Int32Array(this._sab);
  }

  get sab() {
    return this._sab;
  }

  lock() {
    return new Promise((resolve) => {
      const _lock = () => {
        if (
          Atomics.compareExchange(
            this._mu,
            0,
            MutexStatuses.UNLOCKED,
            MutexStatuses.LOCKED
          ) === MutexStatuses.UNLOCKED
        ) {
          return resolve();
        }
        setTimeout(_lock);
      };
      _lock();
    });
  }

  unlock() {
    if (
      Atomics.compareExchange(
        this._mu,
        0,
        MutexStatuses.LOCKED,
        MutexStatuses.UNLOCKED
      ) !== MutexStatuses.LOCKED
    ) {
      throw new Error(
        "Mutex is in inconsistent state: unlock on unlocked Mutex."
      );
    }
  }
};
