const { Worker } = require("worker_threads");
const { Mutex } = require("../mutex");
const { join } = require("path");
const Ingredients = require("../ingredients");
const IngredientWeights = require("../ingredientWeights");

function startBridges({ ingredientSabs, ...other }) {
  const path = join(__dirname, "bridge.js"),
    mutexMutex = new Mutex(),
    tobaccoBrigde = new Worker(path, {
      workerData: { ingredientWeight: IngredientWeights[Ingredients.TOBACCO] },
    }),
    paperBrigde = new Worker(path, {
      workerData: { ingredientWeight: IngredientWeights[Ingredients.PAPER] },
    }),
    matchesBrigde = new Worker(path, {
      workerData: { ingredientWeight: IngredientWeights[Ingredients.MATCHES] },
    });

  mutexMutex.unlock();
  const mutexSab = mutexMutex.sab;

  tobaccoBrigde.postMessage({
    ...other,
    mutexSab,
    ingredientSab: ingredientSabs[Ingredients.TOBACCO],
  });

  paperBrigde.postMessage({
    ...other,
    mutexSab,
    ingredientSab: ingredientSabs[Ingredients.PAPER],
  });

  matchesBrigde.postMessage({
    ...other,
    mutexSab,
    ingredientSab: ingredientSabs[Ingredients.MATCHES],
  });
}

module.exports = { startBridges };
