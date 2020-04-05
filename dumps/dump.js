const {
  parentPort,
  workerData: { ingredient },
} = require("worker_threads");
const { MutexArray } = require("../mutex");
const IngredientWeights = require("../ingredientWeights");

parentPort.once("message", async ({ mutexArraySub }) => {
  const mutexArray = new MutexArray(mutexArraySub);

  while (true) await mutexArray.lock(IngredientWeights[ingredient]);
});
