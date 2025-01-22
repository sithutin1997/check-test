const cron = require('node-cron');
const { fetchGitHubStatus } = require('../service/fetchGithubStatus');

function startCron() {
  fetchGitHubStatus();
  cron.schedule('0 * * * * * ', () => {
    fetchGitHubStatus();
  });
}

module.exports = { startCron };
