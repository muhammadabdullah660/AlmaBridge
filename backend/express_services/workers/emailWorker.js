const emailQueue = require("../utils/queue");
const processEmail = require('../utils/extendedEmailJobHandler');

emailQueue.process(async (job) => {
  try {
    console.log("A JOB COMES AND WAITING IN QUEUE TO PROCESS");
    await processEmail(job);
  } catch (error) {
    console.error("Error processing email job:", error);
  }
});

console.log("Email worker is running...");