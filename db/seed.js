const mysql = require('mysql2/promise');
const config = require('../config/env');
const bcrypt = require('bcrypt');

async function seed() {
  let connection;
  
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📊 Database: ${config.db.database}@${config.db.host}:${config.db.port}\n`);
    
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password
    });

    // Seed admin user (idempotent: INSERT ... ON DUPLICATE KEY UPDATE)
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO admins (email, password_hash)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, ['admin@stellapetservices.com', adminPassword]);
    console.log('✅ Seeded admin user: admin@stellapetservices.com (password: admin123)');

    // Seed services (idempotent: check if exists, then insert or update)
    // Seed services (Virtual Assistant services)
const services = [
  {
    category: 'Admin & Operations',
    title: 'Administrative Support',
    description: 'Email handling, scheduling, data entry, document management, and day-to-day admin tasks.',
    duration_mins: 480,
    starting_price: 15.00,
    includes_json: JSON.stringify([
      'Email & calendar management',
      'Data entry',
      'Document preparation',
      'Meeting scheduling',
      'Task coordination'
    ]),
    is_active: 1,
    sort_order: 1
  },
  {
    category: 'Customer & Sales',
    title: 'Customer Support',
    description: 'Professional customer support via email, chat, and CRM tools.',
    duration_mins: 480,
    starting_price: 18.00,
    includes_json: JSON.stringify([
      'Live chat support',
      'Email support',
      'CRM handling',
      'Customer follow-ups',
      'Issue resolution'
    ]),
    is_active: 1,
    sort_order: 2
  },
  {
    category: 'Marketing & Growth',
    title: 'Digital Marketing',
    description: 'Marketing support to grow your brand and online presence.',
    duration_mins: 480,
    starting_price: 20.00,
    includes_json: JSON.stringify([
      'Social media posting',
      'Content scheduling',
      'Ad campaign support',
      'Analytics reporting',
      'Brand engagement'
    ]),
    is_active: 1,
    sort_order: 3
  },
  {
    category: 'Customer & Sales',
    title: 'Sales & Lead Generation',
    description: 'Support for lead generation, outreach, and sales pipeline management.',
    duration_mins: 480,
    starting_price: 22.00,
    includes_json: JSON.stringify([
      'Cold outreach',
      'Lead qualification',
      'CRM updates',
      'Pipeline tracking',
      'Sales reports'
    ]),
    is_active: 1,
    sort_order: 4
  },
  {
    category: 'Marketing & Growth',
    title: 'Research & Data Analysis',
    description: 'Market research, competitor analysis, and data reporting services.',
    duration_mins: 480,
    starting_price: 20.00,
    includes_json: JSON.stringify([
      'Market research',
      'Competitor analysis',
      'Data collection',
      'Excel/Sheets reports',
      'Insights & summaries'
    ]),
    is_active: 1,
    sort_order: 5
  },
  {
    category: 'Marketing & Growth',
    title: 'E-commerce Support',
    description: 'Operational support for online stores and marketplaces.',
    duration_mins: 480,
    starting_price: 18.00,
    includes_json: JSON.stringify([
      'Product uploads',
      'Order processing',
      'Inventory management',
      'Customer queries',
      'Platform support (Shopify, Amazon)'
    ]),
    is_active: 1,
    sort_order: 6
  },
  {
    category: 'Finance & HR',
    title: 'Bookkeeping & Accounting',
    description: 'Basic bookkeeping and financial record management.',
    duration_mins: 480,
    starting_price: 25.00,
    includes_json: JSON.stringify([
      'Invoice management',
      'Expense tracking',
      'Bank reconciliation',
      'QuickBooks/Xero support',
      'Monthly reports'
    ]),
    is_active: 1,
    sort_order: 7
  },
  {
    category: 'Finance & HR',
    title: 'HR & Recruitment Support',
    description: 'Hiring assistance and HR operational support.',
    duration_mins: 480,
    starting_price: 24.00,
    includes_json: JSON.stringify([
      'Resume screening',
      'Interview scheduling',
      'Candidate coordination',
      'HR documentation',
      'Onboarding support'
    ]),
    is_active: 1,
    sort_order: 8
  },
  {
    category: 'Tech & Automation',
    title: 'IT & Tech Support',
    description: 'Technical support for tools, systems, and basic troubleshooting.',
    duration_mins: 480,
    starting_price: 30.00,
    includes_json: JSON.stringify([
      'Tool setup',
      'Tech troubleshooting',
      'Website updates',
      'CMS support',
      'Basic automation'
    ]),
    is_active: 1,
    sort_order: 9
  }
];





    for (const service of services) {
      // Check if service exists (idempotent)
      const [existing] = await connection.query(
        'SELECT id FROM services WHERE title = ?',
        [service.title]
      );

      if (existing.length === 0) {
        await connection.query(`
          INSERT INTO services (category, title, description, duration_mins, starting_price, includes_json, is_active, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          service.category,
          service.title,
          service.description,
          service.duration_mins,
          service.starting_price,
          service.includes_json,
          service.is_active,
          service.sort_order
        ]);
        console.log(`✅ Seeded service: ${service.title}`);
      } else {
        // Update existing service
        await connection.query(`
          UPDATE services SET
            category = ?,
            description = ?,
            duration_mins = ?,
            starting_price = ?,
            includes_json = ?,
            is_active = ?,
            sort_order = ?
          WHERE title = ?
        `, [
          service.category,
          service.description,
          service.duration_mins,
          service.starting_price,
          service.includes_json,
          service.is_active,
          service.sort_order,
          service.title
        ]);
        console.log(`🔄 Updated service: ${service.title}`);
      }
    }

    // Seed pricing plans (idempotent: INSERT ... ON DUPLICATE KEY UPDATE based on name)
    const plans = [
      {
        name: 'Basic',
        price_monthly: 49.00,
        features_json: JSON.stringify([
          '2 grooming visits/month',
          '4 walk credits',
          'Email support',
          '5% delivery discount',
          'Basic health tips'
        ]),
        is_popular: 0,
        is_active: 1,
        sort_order: 1
      },
      {
        name: 'Standard',
        price_monthly: 89.00,
        features_json: JSON.stringify([
          '4 grooming visits/month',
          '8 walk credits',
          'Priority support',
          '10% delivery discount',
          'Vet hotline access',
          'Training session discount'
        ]),
        is_popular: 1,
        is_active: 1,
        sort_order: 2
      },
      {
        name: 'Premium',
        price_monthly: 149.00,
        features_json: JSON.stringify([
          'Unlimited grooming visits',
          'Unlimited walk credits',
          '24/7 priority support',
          '20% delivery discount',
          'Free vet consultations',
          'Free training sessions',
          'Boarding priority booking',
          'Monthly health reports'
        ]),
        is_popular: 0,
        is_active: 1,
        sort_order: 3
      },
      {
        name: 'Elite',
        price_monthly: 249.00,
        features_json: JSON.stringify([
          'Unlimited all services',
          'Dedicated pet care coordinator',
          '24/7 concierge support',
          '30% delivery discount',
          'Unlimited vet consultations',
          'Unlimited training sessions',
          'Priority boarding',
          'Monthly health reports',
          'Annual wellness package',
          'Emergency response service'
        ]),
        is_popular: 0,
        is_active: 1,
        sort_order: 4
      }
    ];

    for (const plan of plans) {
      await connection.query(`
        INSERT INTO pricing_plans (name, price_monthly, features_json, is_popular, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          price_monthly = VALUES(price_monthly),
          features_json = VALUES(features_json),
          is_popular = VALUES(is_popular),
          is_active = VALUES(is_active),
          sort_order = VALUES(sort_order)
      `, [
        plan.name,
        plan.price_monthly,
        plan.features_json,
        plan.is_popular,
        plan.is_active,
        plan.sort_order
      ]);
      console.log(`✅ Seeded pricing plan: ${plan.name}`);
    }

    // Seed 50 sample bookings (idempotent: check if exists by customer_name + preferred_date + preferred_time)
    // First, get service IDs for foreign keys
    const [serviceRows] = await connection.query('SELECT id, title FROM services ORDER BY id');
    const serviceIds = serviceRows.map(s => s.id);
    const serviceTitles = serviceRows.map(s => s.title);

    // Generate 50 diverse bookings
    const customerNames = [
      'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson',
      'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'James Brown', 'Maria Garcia',
      'William Jones', 'Patricia Williams', 'Richard Miller', 'Linda Moore', 'Joseph Thomas',
      'Barbara Jackson', 'Thomas White', 'Elizabeth Harris', 'Christopher Martin', 'Jessica Thompson',
      'Daniel Garcia', 'Susan Martinez', 'Matthew Robinson', 'Karen Clark', 'Anthony Rodriguez',
      'Nancy Lewis', 'Mark Lee', 'Betty Walker', 'Donald Hall', 'Helen Allen',
      'Steven Young', 'Sandra King', 'Paul Wright', 'Donna Lopez', 'Andrew Hill',
      'Carol Scott', 'Joshua Green', 'Michelle Adams', 'Kenneth Baker', 'Laura Nelson',
      'Kevin Carter', 'Amanda Mitchell', 'Brian Roberts', 'Melissa Turner', 'George Phillips',
      'Deborah Campbell', 'Edward Parker', 'Stephanie Evans', 'Ronald Edwards', 'Rebecca Collins'
    ];

    const petBreeds = [
      'Golden Retriever', 'French Bulldog', 'Labrador', 'German Shepherd', 'Poodle',
      'Beagle', 'Border Collie', 'Husky', 'Siamese', 'Persian',
      'Bulldog', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Siberian Husky',
      'Great Dane', 'Chihuahua', 'Boxer', 'Maine Coon', 'British Shorthair',
      'Australian Shepherd', 'Cocker Spaniel', 'Shih Tzu', 'Boston Terrier', 'Pomeranian'
    ];

    const petTypes = ['Dog', 'Cat', 'Dog', 'Dog', 'Cat', 'Dog', 'Dog', 'Dog', 'Cat', 'Dog'];
    const statuses = ['New', 'Confirmed', 'Completed', 'Cancelled'];
    const cities = ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Oakland', 'Sacramento', 'Fresno', 'Long Beach', 'Anaheim', 'Santa Ana'];
    const states = ['CA', 'CA', 'CA', 'CA', 'CA', 'CA', 'CA', 'CA', 'CA', 'CA'];
    const zipCodes = ['94102', '90001', '92101', '95110', '94601', '95814', '93701', '90802', '92801', '92701'];

    const bookings = [];
    
    // Generate bookings spread across the past 30 days and next 30 days
    const today = new Date();
    const bookingsData = [];
    
    for (let i = 0; i < 50; i++) {
      const customerIndex = i % customerNames.length;
      const serviceIndex = i % serviceIds.length;
      
      // Distribute dates: some in past, some in future
      const daysOffset = i < 25 
        ? -Math.floor(Math.random() * 30) - 1  // Past 30 days
        : Math.floor(Math.random() * 30) + 1;  // Next 30 days
      
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + daysOffset);
      
      // Distribute statuses: more recent = New/Confirmed, older = Completed/Cancelled
      let status;
      if (daysOffset < 0) {
        // Past bookings: mostly Completed, some Cancelled
        status = Math.random() > 0.1 ? 'Completed' : 'Cancelled';
      } else {
        // Future bookings: New or Confirmed
        status = Math.random() > 0.5 ? 'New' : 'Confirmed';
      }
      
      const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
      const time = times[Math.floor(Math.random() * times.length)];
      
      const cityIndex = Math.floor(Math.random() * cities.length);
      const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
      const petBreed = petBreeds[Math.floor(Math.random() * petBreeds.length)];
      const petAge = `${Math.floor(Math.random() * 10) + 1} ${Math.random() > 0.5 ? 'years' : 'months'}`;
      
      bookingsData.push({
        customer_name: customerNames[customerIndex],
        phone: `555-${String(1000 + i).padStart(4, '0')}`,
        email: `${customerNames[customerIndex].toLowerCase().replace(' ', '.')}@example.com`,
        address_line1: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple', 'Cedar', 'Birch', 'Spruce', 'Willow', 'Ash'][Math.floor(Math.random() * 10)]} ${['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Court', 'Way'][Math.floor(Math.random() * 7)]}`,
        address_line2: Math.random() > 0.7 ? `Apt ${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}` : null,
        city: cities[cityIndex],
        state: states[cityIndex],
        pincode: zipCodes[cityIndex],
        service_id: serviceIds[serviceIndex],
        service_title_snapshot: serviceTitles[serviceIndex],
        preferred_date: bookingDate.toISOString().split('T')[0],
        preferred_time: time,
        pet_type: petType,
        pet_breed: petBreed,
        pet_age: petAge,
        notes: Math.random() > 0.6 ? [
          'Please use hypoallergenic shampoo',
          'High energy dog, needs long walk',
          'First time service',
          'Pet is anxious, please be gentle',
          'Special dietary requirements',
          'Medication needs to be administered',
          'Pet has allergies',
          null
        ][Math.floor(Math.random() * 8)] : null,
        status: status
      });
    }

    let seededCount = 0;
    let updatedCount = 0;
    
    for (const booking of bookingsData) {
      // Check if booking already exists (idempotent)
      const [existing] = await connection.query(
        'SELECT id FROM bookings WHERE customer_name = ? AND preferred_date = ? AND preferred_time = ?',
        [booking.customer_name, booking.preferred_date, booking.preferred_time]
      );

      if (existing.length === 0) {
        await connection.query(`
          INSERT INTO bookings (
            customer_name, phone, email, address_line1, address_line2, city, state, pincode,
            service_id, service_title_snapshot, preferred_date, preferred_time,
            pet_type, pet_breed, pet_age, notes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          booking.customer_name,
          booking.phone,
          booking.email,
          booking.address_line1,
          booking.address_line2,
          booking.city,
          booking.state,
          booking.pincode,
          booking.service_id,
          booking.service_title_snapshot,
          booking.preferred_date,
          booking.preferred_time,
          booking.pet_type,
          booking.pet_breed,
          booking.pet_age,
          booking.notes,
          booking.status
        ]);
        seededCount++;
      } else {
        // Update existing booking status if needed
        await connection.query(
          'UPDATE bookings SET status = ? WHERE id = ?',
          [booking.status, existing[0].id]
        );
        updatedCount++;
      }
    }
    
    console.log(`✅ Seeded ${seededCount} new bookings`);
    if (updatedCount > 0) {
      console.log(`🔄 Updated ${updatedCount} existing bookings`);
    }

    await connection.end();
    console.log('\n✅ Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Admin users: 1`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Pricing plans: ${plans.length}`);
    console.log(`   - Bookings: ${seededCount} new, ${updatedCount} updated\n`);
    
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    console.error('Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seed;
