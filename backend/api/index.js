require('module-alias/register');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.DATABASE);
  isConnected = true;

  const modelsFiles = globSync('./src/models/**/*.js');
  for (const filePath of modelsFiles) {
    require(path.resolve(filePath));
  }
}

const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }
  return app(req, res);
};
