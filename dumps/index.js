const { Worker } = require("worker_threads");
const Ingredients = require("../ingredients");
const { join } = require("path");

function startDumps({ mutexArraySub }) {
  const pathToDumpFile = join(__dirname, "dump.js");

  const dumps = [
    new Worker(pathToDumpFile, {
      workerData: {
        ingredient: Ingredients.TOBACCO,
      },
    }),
    new Worker(pathToDumpFile, {
      workerData: {
        ingredient: Ingredients.PAPER,
      },
    }),
    new Worker(pathToDumpFile, {
      workerData: {
        ingredient: Ingredients.MATCHES,
      },
    }),
  ];

  dumps.forEach((dump) => dump.postMessage({ mutexArraySub }));
}

module.exports = { startDumps };
