const { reportQueue } = require('../queues/report.queue');

const addReportJob = async (jobData) => {
  const job = await reportQueue.add('generate-report', jobData);
  return job;
};

module.exports = {
  addReportJob,
};
