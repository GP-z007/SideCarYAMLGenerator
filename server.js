const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deploymentRoutes = require('./routes/deploymentRoutes');

const app = express();

// CORS for React dev server on port 3000
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON body parsing
app.use(bodyParser.json());

// Routes
app.use('/api/deploy', deploymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
