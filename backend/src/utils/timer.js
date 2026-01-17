// backend/src/utils/timer.js

function startTimer() {
  return process.hrtime.bigint();
}

function endTimerMs(start) {
  const end = process.hrtime.bigint();
  return Number(end - start) / 1e6; // milliseconds
}

module.exports = {
  startTimer,
  endTimerMs,
};
