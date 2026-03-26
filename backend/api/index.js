// Register @/ path alias BEFORE any other requires
const path = require('path');
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@', path.join(__dirname, '..', 'src'));

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

// Hardcoded production values — no env vars needed on Vercel dashboard
process.env.DATABASE = process.env.DATABASE || 'mongodb+srv://Test:Test%40123@cluster0.afty55b.mongodb.net/nexacrm?appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'nexacrm_super_secret_key_2024';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PUBLIC_SERVER_FILE = process.env.PUBLIC_SERVER_FILE || 'https://mean-project-laav.vercel.app/';
process.env.RESEND_API = process.env.RESEND_API || 're_NMbLtdFe_56Un3PKZ7pQeAAzHwCqe41xd';

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
  // Set CORS headers FIRST — before anything that can fail
  const origin = req.headers.origin || 'https://mean-project-pi.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  // Answer OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return res.status(500).json({ success: false, message: 'DB error: ' + err.message });
  }

  return app(req, res);
};
