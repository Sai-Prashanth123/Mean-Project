require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);

const Admin = require('../models/coreModels/Admin');
const Client = require('../models/appModels/Client');
const Invoice = require('../models/appModels/Invoice');
const Payment = require('../models/appModels/Payment');
const Quote = require('../models/appModels/Quote');
const ActivityLog = require('../models/appModels/ActivityLog');
const Deal = require('../models/appModels/Deal');
const Lead = require('../models/appModels/Lead');
const Task = require('../models/appModels/Task');
const Note = require('../models/appModels/Note');

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');

    // Get admin user
    const admin = await Admin.findOne({ email: 'admin@admin.com' });
    if (!admin) {
      console.log('❌ Admin not found. Run npm run setup first.');
      process.exit();
    }

    // Clear existing demo data
    await Client.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});
    await Quote.deleteMany({});
    await ActivityLog.deleteMany({});
    await Deal.deleteMany({});
    await Lead.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── CLIENTS ────────────────────────────────────────────────────
    const clients = await Client.insertMany([
      {
        name: 'Arjun Sharma',
        email: 'arjun.sharma@techsolutions.in',
        phone: '+91 98765 43210',
        country: 'India',
        address: '42, MG Road, Bangalore, Karnataka 560001',
        createdBy: admin._id,
        enabled: true,
      },
      {
        name: 'Priya Patel',
        email: 'priya@innovatedesigns.com',
        phone: '+91 87654 32109',
        country: 'India',
        address: '15, Linking Road, Mumbai, Maharashtra 400050',
        createdBy: admin._id,
        enabled: true,
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@growthmart.com',
        phone: '+91 76543 21098',
        country: 'India',
        address: '7, Connaught Place, New Delhi 110001',
        createdBy: admin._id,
        enabled: true,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@digitalhub.io',
        phone: '+91 65432 10987',
        country: 'India',
        address: '22, Banjara Hills, Hyderabad, Telangana 500034',
        createdBy: admin._id,
        enabled: true,
      },
      {
        name: 'Kiran Mehta',
        email: 'kiran.mehta@cloudventures.co',
        phone: '+91 54321 09876',
        country: 'India',
        address: '8, Navrangpura, Ahmedabad, Gujarat 380009',
        createdBy: admin._id,
        enabled: true,
      },
      {
        name: 'Amit Singh',
        email: 'amit@startupzone.in',
        phone: '+91 94567 89012',
        country: 'India',
        address: '33, Park Street, Kolkata, West Bengal 700016',
        createdBy: admin._id,
        enabled: true,
      },
    ]);
    console.log(`✅ ${clients.length} Clients created`);

    const [arjun, priya, rahul, sneha, kiran, amit] = clients;

    // ─── INVOICES ───────────────────────────────────────────────────
    const invoices = await Invoice.insertMany([
      {
        createdBy: admin._id,
        number: 1001,
        year: 2026,
        client: arjun._id,
        date: new Date('2026-01-10'),
        expiredDate: new Date('2026-02-10'),
        status: 'sent',
        paymentStatus: 'paid',
        currency: 'USD',
        items: [
          { itemName: 'Website Development', description: 'Full stack website', quantity: 1, price: 3000, total: 3000 },
          { itemName: 'SEO Setup', description: 'On-page SEO optimization', quantity: 1, price: 500, total: 500 },
        ],
        subTotal: 3500,
        taxRate: 18,
        taxTotal: 630,
        total: 4130,
        credit: 4130,
        notes: 'Thank you for your business!',
      },
      {
        createdBy: admin._id,
        number: 1002,
        year: 2026,
        client: priya._id,
        date: new Date('2026-01-20'),
        expiredDate: new Date('2026-02-20'),
        status: 'sent',
        paymentStatus: 'partially',
        currency: 'USD',
        items: [
          { itemName: 'UI/UX Design', description: 'Mobile app design - 10 screens', quantity: 10, price: 150, total: 1500 },
          { itemName: 'Logo Design', description: 'Brand logo with 3 revisions', quantity: 1, price: 300, total: 300 },
          { itemName: 'Brand Guidelines', description: 'Full brand style guide', quantity: 1, price: 200, total: 200 },
        ],
        subTotal: 2000,
        taxRate: 18,
        taxTotal: 360,
        total: 2360,
        credit: 1000,
        notes: 'Payment due within 30 days.',
      },
      {
        createdBy: admin._id,
        number: 1003,
        year: 2026,
        client: rahul._id,
        date: new Date('2026-02-05'),
        expiredDate: new Date('2026-03-05'),
        status: 'sent',
        paymentStatus: 'unpaid',
        currency: 'USD',
        items: [
          { itemName: 'Digital Marketing', description: 'Social media management - 3 months', quantity: 3, price: 800, total: 2400 },
          { itemName: 'Google Ads Campaign', description: 'Setup & management', quantity: 1, price: 600, total: 600 },
        ],
        subTotal: 3000,
        taxRate: 18,
        taxTotal: 540,
        total: 3540,
        credit: 0,
        notes: 'Please process payment at the earliest.',
      },
      {
        createdBy: admin._id,
        number: 1004,
        year: 2026,
        client: sneha._id,
        date: new Date('2026-02-15'),
        expiredDate: new Date('2026-03-15'),
        status: 'sent',
        paymentStatus: 'paid',
        currency: 'USD',
        items: [
          { itemName: 'Mobile App Development', description: 'React Native app - Android & iOS', quantity: 1, price: 5000, total: 5000 },
          { itemName: 'Backend API', description: 'Node.js REST API', quantity: 1, price: 2000, total: 2000 },
          { itemName: 'App Store Submission', description: 'Both Play Store & App Store', quantity: 1, price: 300, total: 300 },
        ],
        subTotal: 7300,
        taxRate: 18,
        taxTotal: 1314,
        total: 8614,
        credit: 8614,
        notes: 'Delivered on time. Thank you!',
      },
      {
        createdBy: admin._id,
        number: 1005,
        year: 2026,
        client: kiran._id,
        date: new Date('2026-03-01'),
        expiredDate: new Date('2026-04-01'),
        status: 'draft',
        paymentStatus: 'unpaid',
        currency: 'USD',
        items: [
          { itemName: 'Cloud Infrastructure Setup', description: 'AWS setup with auto-scaling', quantity: 1, price: 1500, total: 1500 },
          { itemName: 'DevOps Services', description: 'CI/CD pipeline configuration', quantity: 1, price: 1200, total: 1200 },
        ],
        subTotal: 2700,
        taxRate: 18,
        taxTotal: 486,
        total: 3186,
        credit: 0,
        notes: 'Draft - pending client review.',
      },
      {
        createdBy: admin._id,
        number: 1006,
        year: 2026,
        client: amit._id,
        date: new Date('2026-03-10'),
        expiredDate: new Date('2026-04-10'),
        status: 'sent',
        paymentStatus: 'unpaid',
        currency: 'USD',
        items: [
          { itemName: 'Business Consulting', description: 'Startup strategy session - 5 hours', quantity: 5, price: 200, total: 1000 },
          { itemName: 'Market Research Report', description: 'Competitor & market analysis', quantity: 1, price: 500, total: 500 },
        ],
        subTotal: 1500,
        taxRate: 18,
        taxTotal: 270,
        total: 1770,
        credit: 0,
        notes: 'Payment expected within 15 days.',
      },
    ]);
    console.log(`✅ ${invoices.length} Invoices created`);

    // ─── PAYMENTS ───────────────────────────────────────────────────
    const payments = await Payment.insertMany([
      {
        createdBy: admin._id,
        number: 2001,
        client: arjun._id,
        invoice: invoices[0]._id,
        date: new Date('2026-01-25'),
        amount: 4130,
        currency: 'USD',
        ref: 'TXN-ARJ-001',
        description: 'Full payment for website development',
      },
      {
        createdBy: admin._id,
        number: 2002,
        client: priya._id,
        invoice: invoices[1]._id,
        date: new Date('2026-02-01'),
        amount: 1000,
        currency: 'USD',
        ref: 'TXN-PRI-001',
        description: 'Advance payment - 50%',
      },
      {
        createdBy: admin._id,
        number: 2003,
        client: sneha._id,
        invoice: invoices[3]._id,
        date: new Date('2026-03-05'),
        amount: 8614,
        currency: 'USD',
        ref: 'TXN-SNE-001',
        description: 'Full payment for mobile app project',
      },
    ]);
    console.log(`✅ ${payments.length} Payments created`);

    // ─── QUOTES ─────────────────────────────────────────────────────
    await Quote.insertMany([
      {
        createdBy: admin._id,
        number: 3001,
        year: 2026,
        client: rahul._id,
        date: new Date('2026-01-15'),
        expiredDate: new Date('2026-02-15'),
        status: 'accepted',
        currency: 'USD',
        items: [
          { itemName: 'E-commerce Website', description: 'Full online store with payment gateway', quantity: 1, price: 4000, total: 4000 },
          { itemName: 'Product Photography', description: '50 product photos', quantity: 50, price: 10, total: 500 },
        ],
        subTotal: 4500,
        taxRate: 18,
        taxTotal: 810,
        total: 5310,
        converted: true,
        notes: 'Quote accepted. Project starts Feb 1.',
      },
      {
        createdBy: admin._id,
        number: 3002,
        year: 2026,
        client: kiran._id,
        date: new Date('2026-02-10'),
        expiredDate: new Date('2026-03-10'),
        status: 'pending',
        currency: 'USD',
        items: [
          { itemName: 'SaaS Platform Development', description: 'Multi-tenant SaaS application', quantity: 1, price: 12000, total: 12000 },
          { itemName: 'Admin Dashboard', description: 'Analytics & reporting panel', quantity: 1, price: 3000, total: 3000 },
        ],
        subTotal: 15000,
        taxRate: 18,
        taxTotal: 2700,
        total: 17700,
        converted: false,
        notes: 'Awaiting client approval.',
      },
      {
        createdBy: admin._id,
        number: 3003,
        year: 2026,
        client: amit._id,
        date: new Date('2026-03-01'),
        expiredDate: new Date('2026-03-31'),
        status: 'draft',
        currency: 'USD',
        items: [
          { itemName: 'CRM Implementation', description: 'Custom CRM for sales team', quantity: 1, price: 6000, total: 6000 },
          { itemName: 'Staff Training', description: '2-day training sessions', quantity: 2, price: 500, total: 1000 },
          { itemName: 'Support Contract', description: '6 months post-launch support', quantity: 6, price: 300, total: 1800 },
        ],
        subTotal: 8800,
        taxRate: 18,
        taxTotal: 1584,
        total: 10384,
        converted: false,
        notes: 'Draft quote - needs review before sending.',
      },
    ]);
    console.log(`✅ 3 Quotes created`);

    // ─── ACTIVITY LOGS ──────────────────────────────────────────────
    await ActivityLog.insertMany([
      { createdBy: admin._id, type: 'client_added', entity: 'client', description: 'New client Arjun Sharma added', clientName: 'Arjun Sharma', created: new Date('2026-01-09') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1001 created for $4,130', amount: 4130, currency: 'USD', number: 1001, created: new Date('2026-01-10') },
      { createdBy: admin._id, type: 'client_added', entity: 'client', description: 'New client Priya Patel added', clientName: 'Priya Patel', created: new Date('2026-01-19') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1002 created for $2,360', amount: 2360, currency: 'USD', number: 1002, created: new Date('2026-01-20') },
      { createdBy: admin._id, type: 'payment_received', entity: 'payment', description: 'Payment of $4,130 received from Arjun Sharma', amount: 4130, currency: 'USD', number: 2001, created: new Date('2026-01-25') },
      { createdBy: admin._id, type: 'payment_received', entity: 'payment', description: 'Advance payment of $1,000 received from Priya Patel', amount: 1000, currency: 'USD', number: 2002, created: new Date('2026-02-01') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1003 created for $3,540', amount: 3540, currency: 'USD', number: 1003, created: new Date('2026-02-05') },
      { createdBy: admin._id, type: 'quote_created', entity: 'quote', description: 'Quote #3002 sent to Kiran Mehta for $17,700', amount: 17700, currency: 'USD', number: 3002, created: new Date('2026-02-10') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1004 created for $8,614', amount: 8614, currency: 'USD', number: 1004, created: new Date('2026-02-15') },
      { createdBy: admin._id, type: 'payment_received', entity: 'payment', description: 'Full payment of $8,614 received from Sneha Reddy', amount: 8614, currency: 'USD', number: 2003, created: new Date('2026-03-05') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1005 created for $3,186', amount: 3186, currency: 'USD', number: 1005, created: new Date('2026-03-01') },
      { createdBy: admin._id, type: 'invoice_created', entity: 'invoice', description: 'Invoice #1006 created for $1,770', amount: 1770, currency: 'USD', number: 1006, created: new Date('2026-03-10') },
      { createdBy: admin._id, type: 'quote_accepted', entity: 'quote', description: 'Quote #3001 accepted by Rahul Verma', amount: 5310, currency: 'USD', number: 3001, created: new Date('2026-03-12') },
    ]);
    console.log(`✅ 13 Activity logs created`);

    // ─── DEALS ──────────────────────────────────────────────────────
    const deals = await Deal.insertMany([
      { title: 'Website Redesign Project', client: arjun._id, value: 250000, stage: 'won', probability: 100, expectedCloseDate: new Date('2026-02-28'), notes: 'Signed contract, project in progress', createdBy: admin._id },
      { title: 'Mobile App Development', client: priya._id, value: 450000, stage: 'negotiation', probability: 75, expectedCloseDate: new Date('2026-04-30'), notes: 'Finalizing scope and pricing', createdBy: admin._id },
      { title: 'Cloud Migration Services', client: kiran._id, value: 180000, stage: 'proposal', probability: 50, expectedCloseDate: new Date('2026-05-15'), notes: 'Proposal sent, awaiting feedback', createdBy: admin._id },
      { title: 'Digital Marketing Retainer', client: rahul._id, value: 96000, stage: 'contacted', probability: 30, expectedCloseDate: new Date('2026-04-01'), notes: 'Had initial call, scheduling demo', createdBy: admin._id },
      { title: 'CRM Implementation', client: amit._id, value: 320000, stage: 'lead', probability: 10, expectedCloseDate: new Date('2026-06-30'), notes: 'Inbound inquiry from website', createdBy: admin._id },
      { title: 'E-commerce Platform', client: sneha._id, value: 175000, stage: 'lost', probability: 0, expectedCloseDate: new Date('2026-03-01'), notes: 'Lost to competitor on pricing', createdBy: admin._id },
      { title: 'SEO & Content Strategy', client: rahul._id, value: 60000, stage: 'proposal', probability: 60, expectedCloseDate: new Date('2026-04-20'), createdBy: admin._id },
    ]);
    console.log(`✅ ${deals.length} Deals created`);

    // ─── LEADS ──────────────────────────────────────────────────────
    const leads = await Lead.insertMany([
      { name: 'Vikram Nair', email: 'vikram@fintech.io', phone: '+91 99001 23456', company: 'FinTech Solutions', source: 'website', status: 'qualified', score: 82, notes: 'Interested in full-stack development', createdBy: admin._id },
      { name: 'Deepa Krishnan', email: 'deepa@edutech.in', phone: '+91 88990 12345', company: 'EduTech India', source: 'referral', status: 'contacted', score: 65, notes: 'Referred by Arjun Sharma', createdBy: admin._id },
      { name: 'Manish Joshi', email: 'manish.joshi@retail.com', phone: '+91 77889 01234', company: 'RetailMax', source: 'cold_call', status: 'new', score: 25, notes: 'Cold outreach - showed mild interest', createdBy: admin._id },
      { name: 'Ananya Bose', email: 'ananya@healthplus.in', phone: '+91 66778 90123', company: 'HealthPlus', source: 'social', status: 'qualified', score: 78, notes: 'Found us on LinkedIn, very interested', createdBy: admin._id },
      { name: 'Sanjay Rao', email: 'sanjay@logistics.co', phone: '+91 55667 89012', company: 'Swift Logistics', source: 'email', status: 'converted', score: 91, notes: 'Converted to client - excellent fit', createdBy: admin._id },
      { name: 'Kavita Gupta', email: 'kavita@fashionhub.com', phone: '+91 44556 78901', company: 'FashionHub', source: 'website', status: 'lost', score: 20, notes: 'Budget constraint - went with competitor', createdBy: admin._id },
      { name: 'Rohit Malhotra', email: 'rohit@realestate.in', phone: '+91 33445 67890', company: 'PropVista Realty', source: 'referral', status: 'new', score: 45, notes: 'New inquiry, needs follow-up', createdBy: admin._id },
    ]);
    console.log(`✅ ${leads.length} Leads created`);

    // ─── TASKS ──────────────────────────────────────────────────────
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);

    await Task.insertMany([
      { title: 'Follow up with Priya on mobile app proposal', type: 'follow_up', priority: 'high', status: 'overdue', dueDate: twoDaysAgo, description: 'Discuss revised scope and timeline', linkedEntity: 'client', linkedId: priya._id, createdBy: admin._id },
      { title: 'Send revised quote to Kiran', type: 'email', priority: 'urgent', status: 'overdue', dueDate: yesterday, description: 'Include cloud migration breakdown', linkedEntity: 'client', linkedId: kiran._id, createdBy: admin._id },
      { title: 'Schedule product demo for Vikram', type: 'meeting', priority: 'high', status: 'pending', dueDate: tomorrow, description: 'Demo of CRM dashboard features', linkedEntity: 'lead', linkedId: leads[0]._id, createdBy: admin._id },
      { title: 'Call Rahul about digital marketing campaign', type: 'call', priority: 'medium', status: 'pending', dueDate: tomorrow, linkedEntity: 'client', linkedId: rahul._id, createdBy: admin._id },
      { title: 'Prepare onboarding plan for Arjun', type: 'other', priority: 'low', status: 'pending', dueDate: nextWeek, description: 'Draft 30-60-90 day plan', linkedEntity: 'client', linkedId: arjun._id, createdBy: admin._id },
      { title: 'Send welcome email to Sanjay Rao (new client)', type: 'email', priority: 'medium', status: 'completed', dueDate: twoDaysAgo, description: 'Onboarding email with portal access', createdBy: admin._id },
    ]);
    console.log(`✅ 6 Tasks created`);

    // ─── NOTES ──────────────────────────────────────────────────────
    await Note.insertMany([
      { content: 'Arjun prefers communication via WhatsApp. Very responsive during business hours.', linkedEntity: 'client', linkedId: arjun._id, createdBy: admin._id },
      { content: 'Discussed adding a blog module to the website. Potential upsell of ₹25,000.', linkedEntity: 'client', linkedId: arjun._id, createdBy: admin._id },
      { content: 'Priya needs the app to support Hindi and Tamil languages. Note for dev team.', linkedEntity: 'client', linkedId: priya._id, createdBy: admin._id },
      { content: 'Rahul is expanding to 3 new cities. Could be a bigger contract in Q3.', linkedEntity: 'client', linkedId: rahul._id, createdBy: admin._id },
      { content: 'Sneha introduced us to her CFO. They may need accounting module integration.', linkedEntity: 'client', linkedId: sneha._id, createdBy: admin._id },
    ]);
    console.log(`✅ 5 Notes created`);

    console.log('\n🎉 Demo data seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - 6 Customers');
    console.log('   - 6 Invoices (2 paid, 1 partial, 3 unpaid)');
    console.log('   - 3 Payments');
    console.log('   - 3 Quotes');
    console.log('   - 7 Deals across all pipeline stages');
    console.log('   - 7 Leads with varied sources and scores');
    console.log('   - 6 Tasks (2 overdue, 3 pending, 1 completed)');
    console.log('   - 5 Client notes');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error seeding demo data:');
    console.log(e.message);
    process.exit();
  }
}

seedDemoData();
