const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const {fetchGitHubStatus} = require('./scheduler/cron');
const { startCron } = require('./scheduler/cron');
// Routes
const resultsRoutes = require('./routes/result');
const downloadCsvRoutes = require('./routes/downloadCsv');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Use the routes
app.use('/results', resultsRoutes);
app.use('/download-csv', downloadCsvRoutes);
app.listen(PORT, () => {
  startCron();
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { app };