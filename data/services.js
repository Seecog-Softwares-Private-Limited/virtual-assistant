const services = [
  {
    id: 'grooming',
    category: 'Grooming',
    title: 'Professional Grooming',
    description: 'Full-service grooming at your home. Includes bath, brush, nail trim, ear cleaning, and styling.',
    duration: '2-3 hours',
    price: 75,
    included: ['Bath & dry', 'Haircut & styling', 'Nail trimming', 'Ear cleaning', 'Sanitary trim'],
    icon: 'scissors'
  },
  {
    id: 'walking',
    category: 'Walking',
    title: 'Dog Walking',
    description: 'Regular walks to keep your pet healthy and happy. Flexible scheduling for your busy lifestyle.',
    duration: '30-60 min',
    price: 25,
    included: ['GPS tracking', 'Photo updates', 'Water provided', 'Exercise report'],
    icon: 'dog'
  },
  {
    id: 'vaccination',
    category: 'Vet/Vaccination',
    title: 'At-Home Vaccination',
    description: 'Licensed veterinarians come to your home for vaccinations and health checkups.',
    duration: '30-45 min',
    price: 120,
    included: ['Vaccination', 'Health checkup', 'Certificate', 'Follow-up care'],
    icon: 'syringe'
  },
  {
    id: 'food-delivery',
    category: 'Food Delivery',
    title: 'Premium Food Delivery',
    description: 'Fresh, premium pet food delivered to your door. Customized meal plans available.',
    duration: 'Same day',
    price: 45,
    included: ['Free delivery', 'Meal planning', 'Nutritional guidance', 'Auto-refill option'],
    icon: 'package'
  },
  {
    id: 'boarding',
    category: 'Shelter/Boarding',
    title: 'Home Boarding',
    description: 'Safe, comfortable boarding in a home environment. Your pet stays with trusted caregivers.',
    duration: 'Per night',
    price: 65,
    included: ['24/7 supervision', 'Daily walks', 'Photo updates', 'Medication administration'],
    icon: 'home'
  },
  {
    id: 'training',
    category: 'Training',
    title: 'Professional Training',
    description: 'Expert trainers work with your pet at home. Basic obedience to advanced commands.',
    duration: '1 hour',
    price: 90,
    included: ['Personalized plan', 'Progress reports', 'Owner training', 'Follow-up sessions'],
    icon: 'graduation-cap'
  }
];

const categories = ['All', 'Grooming', 'Walking', 'Vet/Vaccination', 'Food Delivery', 'Shelter/Boarding', 'Training'];

module.exports = { services, categories };

