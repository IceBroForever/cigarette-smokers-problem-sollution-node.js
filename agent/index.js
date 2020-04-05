const { Worker } = require("worker_threads");
const Ingredients = require("../ingredients");
const { join } = require("path");

function startAgent({ agentSab, ingredientSabs }) {
  const pathToProviderFile = join(__dirname, "provider.js");

  const providerOfPaperAndMatches = new Worker(pathToProviderFile),
    providerOfTobaccoAndMatches = new Worker(pathToProviderFile),
    providerOfTobaccoAndPaper = new Worker(pathToProviderFile);

  providerOfPaperAndMatches.postMessage({
    agentSab,
    ingredientSabs: {
      [Ingredients.PAPER]: ingredientSabs[Ingredients.PAPER],
      [Ingredients.MATCHES]: ingredientSabs[Ingredients.MATCHES],
    },
  });

  providerOfTobaccoAndMatches.postMessage({
    agentSab,
    ingredientSabs: {
      [Ingredients.TOBACCO]: ingredientSabs[Ingredients.TOBACCO],
      [Ingredients.MATCHES]: ingredientSabs[Ingredients.MATCHES],
    },
  });

  providerOfTobaccoAndPaper.postMessage({
    agentSab,
    ingredientSabs: {
      [Ingredients.TOBACCO]: ingredientSabs[Ingredients.TOBACCO],
      [Ingredients.PAPER]: ingredientSabs[Ingredients.PAPER],
    },
  });
}

module.exports = { startAgent };
