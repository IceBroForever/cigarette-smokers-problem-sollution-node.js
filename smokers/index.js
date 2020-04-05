const { Worker } = require("worker_threads");
const Ingredients = require("../ingredients");
const IngredientWeights = require("../ingredientWeights");
const { join } = require("path");

function startSmokers({ agentSab, sumUint8Array, mutexArraySub }) {
  const pathToSmokerFile = join(__dirname, "smoker.js");

  const smokerWithTobacco = new Worker(pathToSmokerFile, {
      workerData: {
        ingredient: Ingredients.TOBACCO,
        mutexIndex:
          IngredientWeights[Ingredients.PAPER] +
          IngredientWeights[Ingredients.MATCHES],
      },
    }),
    smokerWithPaper = new Worker(pathToSmokerFile, {
      workerData: {
        ingredient: Ingredients.PAPER,
        mutexIndex:
          IngredientWeights[Ingredients.TOBACCO] +
          IngredientWeights[Ingredients.MATCHES],
      },
    }),
    smokerWithMatches = new Worker(pathToSmokerFile, {
      workerData: {
        ingredient: Ingredients.MATCHES,
        mutexIndex:
          IngredientWeights[Ingredients.PAPER] +
          IngredientWeights[Ingredients.TOBACCO],
      },
    });

  smokerWithTobacco.postMessage({
    agentSab,
    sumUint8Array,
    mutexArraySub,
  });

  smokerWithPaper.postMessage({
    agentSab,
    sumUint8Array,
    mutexArraySub,
  });

  smokerWithMatches.postMessage({
    agentSab,
    sumUint8Array,
    mutexArraySub,
  });
}

module.exports = { startSmokers };
