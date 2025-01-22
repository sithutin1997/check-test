const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /results
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

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    console.log("this is end", end)
    let startTime = start ? new Date(start) : null;
    let endTime = end ? new Date() : null;

    if (!startTime && !endTime) {
      const hr = 5;
      endTime = new Date(Date.now() + (1 * 60 * 1000));
      // endTime.setMinutes(endTime.getMinutes() - 1); 
      startTime = new Date(Date.now() - hr * 60 * 60 * 1000);
    }

    const whereClause = {
      timestamp: {
        gte: startTime,
        lte: endTime
      }
    };

    // Count total
    const totalCount = await prisma.gitHubStatus.count({ where: whereClause });

    // Calculate skip
    const skip = (page - 1) * limit;

    // Query
    const data = await prisma.gitHubStatus.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });

    res.json({
      meta: {
        page,
        limit,
        totalCount
      },
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;