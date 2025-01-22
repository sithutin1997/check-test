// cron.js
const cron = require('node-cron');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { STATUS_URL, COMPONENTS_URL, INCIDENTS_URL, MAINT_URL } = require('../constants');

// Helper function to fetch data from the 4 endpoints
async function fetchGitHubStatus() {
  try {
    // 1) Fetch overall status
    const statusResp = await axios.get(STATUS_URL);
    const statusData = statusResp.data;
    const overallDescription = statusData?.status?.description || '';
    const overallIndicator = statusData?.status?.indicator || '';

    // 2) Fetch components
    const componentsResp = await axios.get(COMPONENTS_URL);
    const components = componentsResp.data?.components || [];

    // 3) Fetch incidents
    const incidentsResp = await axios.get(INCIDENTS_URL);
    // limit to 10 incidents for storing
    const incidents = incidentsResp.data?.incidents?.slice(0, 10) || [];

    // 4) Fetch scheduled maintenances
    const maintResp = await axios.get(MAINT_URL);
    // limit to 10
    const maintenances = maintResp.data?.scheduled_maintenances?.slice(0, 10) || [];

    // Current timestamp
    const now = new Date();

    // Store each component
    for (const comp of components) {
      await prisma.gitHubStatus.create({
        data: {
          timestamp: now,
          description: overallDescription,
          indicator: overallIndicator,
          componentName: comp.name,
          componentStatus: comp.status
        }
      });
    }

    // Store each incident
    for (const inc of incidents) {
      await prisma.gitHubStatus.create({
        data: {
          timestamp: now,
          description: overallDescription,
          indicator: overallIndicator,
          incidentImpact: inc.impact,
          incidentName: inc.name,
          incidentStatus: inc.status
        }
      });
    }

    // Store each maintenance
    for (const m of maintenances) {
      await prisma.gitHubStatus.create({
        data: {
          timestamp: now,
          description: overallDescription,
          indicator: overallIndicator,
          maintenanceImpact: m.impact,
          maintenanceName: m.name,
          maintenanceStatus: m.status
        }
      });
    }

    console.log('GitHub Status fetch: success');
  } catch (err) {
    console.error('Error fetching GitHub status: Network error');
  }
}

module.exports = { fetchGitHubStatus };