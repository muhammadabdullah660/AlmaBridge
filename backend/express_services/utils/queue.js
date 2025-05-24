const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Queue = require("bull");
const processEmail = require('./extendedEmailJobHandler');

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
};

const emailQueue = new Queue("emailQueue", {
    redis: redisConfig,
    settings: {
      stalledInterval: 60000, // How often check for stalled jobs (use 0 for never checking)
      maxStalledCount: 1, // Max number of times a job can be recovered from stalled state
    },
});

emailQueue.process(processEmail);

module.exports = emailQueue;