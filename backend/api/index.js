// Must be first — sets up @/ path alias from package.json _moduleAliases
require('module-alias/register');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

// Hardcoded production values (fallback if env vars not set in Vercel dashboard)
process.env.DATABASE = process.env.DATABASE || 'mongodb+srv://Test:Test%40123@cluster0.afty55b.mongodb.net/nexacrm?appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'nexacrm_super_secret_key_2024';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PUBLIC_SERVER_FILE = process.env.PUBLIC_SERVER_FILE || 'https://mean-project-laav.vercel.app/';
process.env.RESEND_API = process.env.RESEND_API || 're_NMbLtdFe_56Un3PKZ7pQeAAzHwCqe41xd';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const mongoose = require('mongoose');
const { globSync } = require('glob');

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.DATABASE);
  isConnected = true;

  const modelsPattern = path.join(__dirname, '..', 'src', 'models', '**', '*.js').replace(/\\/g, '/');
  const modelsFiles = globSync(modelsPattern);
  for (const filePath of modelsFiles) {
    require(filePath);
  }
}

const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed: ' + err.message });
  }
  return app(req, res);
};
