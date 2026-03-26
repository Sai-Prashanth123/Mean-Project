// Vercel serverless entry point — must be at backend root
const path = require('path');

// Set up @/ alias BEFORE any other requires
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@', path.join(__dirname, 'src'));

// Fix DNS for MongoDB Atlas SRV
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

// Hardcoded production config — works even without Vercel env var dashboard setup
process.env.DATABASE =
  process.env.DATABASE ||
  'mongodb+srv://Test:Test%40123@cluster0.afty55b.mongodb.net/nexacrm?appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'nexacrm_super_secret_key_2024';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PUBLIC_SERVER_FILE =
  process.env.PUBLIC_SERVER_FILE || 'https://mean-project-laav.vercel.app/';
process.env.RESEND_API =
  process.env.RESEND_API || 're_NMbLtdFe_56Un3PKZ7pQeAAzHwCqe41xd';

const mongoose = require('mongoose');
const { globSync } = require('glob');

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.DATABASE);
  isConnected = true;

  // Load all Mongoose models
  const pattern = path.join(__dirname, 'src', 'models', '**', '*.js').replace(/\\/g, '/');
  for (const file of globSync(pattern)) {
    require(file);
  }
}

const app = require('./src/app');

module.exports = async (req, res) => {
  // Always set CORS first — before any async work that could fail
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB error:', err.message);
    return res.status(500).json({ success: false, message: 'DB error: ' + err.message });
  }

  return app(req, res);
};
