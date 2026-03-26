require('module-alias/register');

// Force Google DNS + IPv4 first to fix SRV lookup issues on Node.js v22+
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// Hardcoded config
process.env.DATABASE = 'mongodb+srv://Test:Test%40123@cluster0.afty55b.mongodb.net/nexacrm?appName=Cluster0';
process.env.JWT_SECRET = 'nexacrm_super_secret_key_2024';
process.env.NODE_ENV = 'development';
process.env.PUBLIC_SERVER_FILE = 'http://localhost:8888/';
process.env.RESEND_API = 're_NMbLtdFe_56Un3PKZ7pQeAAzHwCqe41xd';

mongoose.connect(process.env.DATABASE);

const OPENAI_API_KEY = null;

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
