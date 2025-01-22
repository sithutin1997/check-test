// tests/app.test.js
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../src/app'); // import your Express app

describe('Integration Tests for Express routes', () => {
  beforeAll(async () => {
    // Optionally clear existing data or create some test rows
    await prisma.gitHubStatus.deleteMany({});

    // Create a few test records
    await prisma.gitHubStatus.createMany({
      data: [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          description: 'All Systems Operational',
          indicator: 'none',
          componentName: 'API',
          componentStatus: 'operational'
        },
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          description: 'Partial Outage',
          indicator: 'major',
          componentName: 'Webhooks',
          componentStatus: 'degraded_performance'
        }
      ]
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /results => Should return records for the default last 5 hours', async () => {
    // One record is 2h old, the other 6h old. By default 5 hours => only the 2h record is included
    const res = await request(app).get('/results');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBe(1); 
    expect(res.body.data[0].componentName).toBe('API');
  });

  it('GET /download-csv => Should return CSV data with the default last 5 hours', async () => {
    const res = await request(app).get('/download-csv');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    // CSV content should have at least the record from 2 hours ago
    expect(res.text).toContain('API');
    // The 6-hour-old record won't appear
    expect(res.text).not.toContain('Webhooks');
  });
});