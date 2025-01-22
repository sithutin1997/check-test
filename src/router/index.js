const { Router } = require("express");
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { parse } = require('json2csv');
const router = Router();


router.get("/status", async (req, res) => {
  try {
    const { start, end, limit, page } = req.query;

    // Prepare filtering logic
    const where = {};
    if (start && end) {
      where.timestamp = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    }

    // Prepare pagination
    const limitNum = parseInt(limit) || 50; // default 50
    const pageNum = parseInt(page) || 1; // default 1
    const offset = (pageNum - 1) * limitNum;

    // Fetch data & total count
    // findAndCountAll helps get `rows` plus the total `count` for pagination
    const { rows, count } = await GitHubStatusRecord.findAndCountAll({
      where,
      order: [["timestamp", "DESC"]],
      limit: limitNum,
      offset,
    });

    // Return JSON with chunked results
    return res.json({
      results: rows,
      totalCount: count,
      page: pageNum,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});