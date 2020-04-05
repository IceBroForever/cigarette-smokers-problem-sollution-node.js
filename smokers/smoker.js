const {
  parentPort,
  workerData: { ingredient, mutexIndex },
} = require("worker_threads");
const { Mutex, MutexArray } = require("../mutex");

parentPort.once(
  "message",
  async ({ agentSab, sumUint8Array, mutexArraySub }) => {
    const agentMutex = new Mutex(agentSab),
      mutexArray = new MutexArray(mutexArraySub);

    while (true) {
      await mutexArray.lock(mutexIndex);

      Atomics.store(sumUint8Array, 0, 0);
      console.log(`[Smoker with ${ingredient}] Picked up other ingredients`);

      agentMutex.unlock();

      console.log(`[Smoker with ${ingredient}] Rolling the cigarette...`);
      await new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * 3000 + 2000))
      );
      console.log(`[Smoker with ${ingredient}] Rolled the cigarette`);

      console.log(`[Smoker with ${ingredient}] Smoking the cigarette...`);
      await new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * 50000 + 5000))
      );
      console.log(`[Smoker with ${ingredient}] Smoked the cigarette`);
    }
  }
);
