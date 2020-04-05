const { parentPort } = require("worker_threads");
const { Mutex } = require("../mutex");

parentPort.once("message", async ({ agentSab, ingredientSabs }) => {
  const agentMutex = new Mutex(agentSab),
    ingredientMutexes = Object.entries(ingredientSabs).reduce(
      (o, [ingredient, sab]) =>
        Object.assign(o, { [ingredient]: new Mutex(sab, ingredient) }),
      {}
    );
  while (true) {
    await agentMutex.lock();
    Object.entries(ingredientMutexes).forEach(([ingredient, mutex]) => {
      mutex.unlock();
      console.log(`[Agent] Put ${ingredient} on table`);
    });
  }
});
