const { Mutex, MutexArray } = require("./mutex");
const Ingredients = require("./ingredients");
const { startAgent } = require("./agent");
const { startBridges } = require("./bridges");
const { startDumps } = require("./dumps");
const { startSmokers } = require("./smokers");

const agentMutex = new Mutex();
agentMutex.unlock();
const agentSab = agentMutex.sab;

const ingredientSabs = {
  [Ingredients.TOBACCO]: new Mutex().sab,
  [Ingredients.PAPER]: new Mutex().sab,
  [Ingredients.MATCHES]: new Mutex().sab,
};

const sumUint8Array = new Uint8Array(
  new SharedArrayBuffer(1 * Uint8Array.BYTES_PER_ELEMENT)
);

const mutexArraySub = new MutexArray(7).sab;

startSmokers({ agentSab, sumUint8Array, mutexArraySub });
startDumps({ mutexArraySub });
startBridges({ ingredientSabs, sumUint8Array, mutexArraySub });
startAgent({ agentSab, ingredientSabs });
