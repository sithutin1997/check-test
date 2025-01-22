const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { parse } = require('json2csv');
const prisma = new PrismaClient();

// GET /download-csv
router.get('/', async (req, res) => {
  try {
    let {
      start,
      end,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let startTime = start ? new Date(start) : null;
    let endTime = end ? new Date(end) : null;

    if (!startTime && !endTime) {
      const hr = 5;
      endTime = new Date();
      startTime = new Date(Date.now() - hr * 60 * 60 * 1000);
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause = {
      timestamp: {
        gte: startTime,
        lte: endTime
      }
    };

    const results = await prisma.gitHubStatus.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });

    const csv = parse(results);
    res.setHeader('Content-Disposition', 'attachment; filename=github_report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating CSV');
  }
});

module.exports = router;