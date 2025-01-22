// fetchGitHubStatus.integration.test.js
const axios = require('axios');

// Real GitHub Status API endpoints
const STATUS_URL = 'https://www.githubstatus.com/api/v2/status.json';
const COMPONENTS_URL = 'https://www.githubstatus.com/api/v2/components.json';
const INCIDENTS_URL = 'https://www.githubstatus.com/api/v2/incidents.json';
const MAINT_URL = 'https://www.githubstatus.com/api/v2/scheduled-maintenances.json';

// Similar to your cron.js function but no DB logic
async function realFetchGitHubStatus() {
  const statusResp = await axios.get(STATUS_URL);
  const componentsResp = await axios.get(COMPONENTS_URL);
  const incidentsResp = await axios.get(INCIDENTS_URL);
  const maintResp = await axios.get(MAINT_URL);

  const overallStatus = statusResp.data?.status || {};
  const components = componentsResp.data?.components || [];
  const incidents = incidentsResp.data?.incidents || [];
  const maints = maintResp.data?.scheduled_maintenances || [];

  // Just logging to confirm real data
  console.log('Overall Status:', overallStatus);
  console.log('Components Count:', components.length);
  console.log('Incidents Count:', incidents.length);
  console.log('Scheduled Maintenances Count:', maints.length);

  return {
    overallStatus,
    components,
    incidents,
    maints,
  };
}

describe('Integration test with real GitHub Status API', () => {
  // (1) Test: Fetch status with no error
  test('fetches overall status without throwing', async () => {
    await expect(realFetchGitHubStatus()).resolves.not.toThrow();
  });

  // (2) Test: Check if we get a non-empty status object
  test('returns a status object containing description', async () => {
    const { overallStatus } = await realFetchGitHubStatus();
    expect(overallStatus).toHaveProperty('description');
  });

  // (3) Test: Fetch components and check length is defined
  test('fetches components successfully', async () => {
    const { components } = await realFetchGitHubStatus();
    // Usually at least 1 component
    expect(Array.isArray(components)).toBe(true);
  });

  // (4) Test: Fetch incidents and ensure the array is defined
  test('fetches incidents array successfully', async () => {
    const { incidents } = await realFetchGitHubStatus();
    expect(Array.isArray(incidents)).toBe(true);
  });
});