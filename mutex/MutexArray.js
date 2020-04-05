const MutexStatuses = require("./MutexStatuses");

module.exports = class MutexArray {
  constructor(v) {
    if (typeof v === "number")
      this._sab = new SharedArrayBuffer(v * Int32Array.BYTES_PER_ELEMENT);
    else if (v instanceof SharedArrayBuffer) this._sab = v;
    else throw new TypeError("Value should be number or SharedArrayBuffer");
    this._mu = new Int32Array(this._sab);
  }

  get sab() {
    return this._sab;
  }

  lock(i) {
    return new Promise((resolve) => {
      const _lock = () => {
        if (
          Atomics.compareExchange(
            this._mu,
            i,
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

  unlock(i) {
    if (
      Atomics.compareExchange(
        this._mu,
        i,
        MutexStatuses.LOCKED,
        MutexStatuses.UNLOCKED
      ) !== MutexStatuses.LOCKED
    ) {
      throw new Error(
        "Mutex is in inconsistent state: unlock on unlocked Mutex."
      );
    }
    Atomics.notify(this._mu, i, Infinity);
  }
};
