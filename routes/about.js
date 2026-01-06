const express = require('express');
const router = express.Router();
const { contacts } = require('../data/storage');

const team = [
  {
    name: 'Dr. Sarah Williams',
    role: 'Lead Veterinarian',
    bio: '15 years of experience in pet care. Specializes in preventive medicine and at-home care.',
    image: '/images/team-1.jpg'
  },
  {
    name: 'Mike Thompson',
    role: 'Master Groomer',
    bio: 'Certified professional groomer with expertise in all breeds. Passionate about pet comfort.',
    image: '/images/team-2.jpg'
  },
  {
    name: 'Lisa Chen',
    role: 'Training Specialist',
    bio: 'Certified dog trainer with a gentle, positive reinforcement approach.',
    image: '/images/team-3.jpg'
  }
];

const serviceAreas = [
  'San Francisco', 'Oakland', 'Berkeley', 'San Jose', 'Palo Alto',
  'Mountain View', 'Sunnyvale', 'Fremont', 'Hayward', 'Redwood City'
];

router.get('/', (req, res) => {
  res.render('pages/about', {
    title: 'About Us - Stella Pet Services',
    description: 'Learn about Stella Pet Services, our mission, team, and commitment to premium pet care.',
    team: team,
    serviceAreas: serviceAreas,
    activeRoute: '/about',
    success: false
  });
});

router.post('/contact', (req, res) => {
  const contact = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message
  };

  contacts.push(contact);
  console.log('📧 New Contact:', JSON.stringify(contact, null, 2));

  res.render('pages/about', {
    title: 'About Us - Stella Pet Services',
    description: 'Learn about Stella Pet Services, our mission, team, and commitment to premium pet care.',
    team: team,
    serviceAreas: serviceAreas,
    activeRoute: '/about',
    success: true
  });
});

module.exports = router;

