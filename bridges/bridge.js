const {
  parentPort,
  workerData: { ingredientWeight },
} = require("worker_threads");
const { Mutex, MutexArray } = require("../mutex");

parentPort.once(
  "message",
  async ({ sumUint8Array, ingredientSab, mutexSab, mutexArraySub }) => {
    const ingredientMutex = new Mutex(ingredientSab),
      mutex = new Mutex(mutexSab),
      mutexArray = new MutexArray(mutexArraySub);

    while (true) {
      await ingredientMutex.lock();
      await mutex.lock();

      Atomics.add(sumUint8Array, 0, ingredientWeight);

      mutexArray.unlock(Atomics.load(sumUint8Array, 0));

      mutex.unlock();
    }
  }
);
