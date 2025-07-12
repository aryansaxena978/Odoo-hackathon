const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Skill = require('../models/Skill');
const Request = require('../models/Request');

// Sample users data
const usersData = [
  {
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    password: 'password123',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning'],
    rating: 4.8,
    ratingCount: 25,
    bio: 'Full-stack developer with 5 years experience. Love teaching web development!',
    location: 'San Francisco, CA',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123',
    skillsOffered: ['Python', 'Data Science', 'TensorFlow'],
    skillsWanted: ['JavaScript', 'Web Development'],
    rating: 4.9,
    ratingCount: 32,
    bio: 'Data scientist passionate about AI and helping others learn data analysis.',
    location: 'Seattle, WA',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    password: 'password123',
    skillsOffered: ['Photoshop', 'Illustrator', 'UI Design'],
    skillsWanted: ['Figma', 'UX Research'],
    rating: 4.7,
    ratingCount: 18,
    bio: 'Creative designer with 8 years in the industry. Always eager to learn new tools!',
    location: 'Austin, TX',
    availability: 'weekdays',
    profileVisibility: 'public'
  },
  {
    name: 'Elena Vasquez',
    email: 'elena@example.com',
    password: 'password123',
    skillsOffered: ['Java', 'Spring Boot', 'Microservices'],
    skillsWanted: ['Kubernetes', 'DevOps'],
    rating: 4.6,
    ratingCount: 22,
    bio: 'Backend developer specializing in enterprise applications.',
    location: 'Miami, FL',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    password: 'password123',
    skillsOffered: ['Angular', 'TypeScript', 'RxJS'],
    skillsWanted: ['React', 'GraphQL'],
    rating: 4.5,
    ratingCount: 15,
    bio: 'Frontend engineer passionate about modern web frameworks.',
    location: 'Portland, OR',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    name: 'Maya Patel',
    email: 'maya@example.com',
    password: 'password123',
    skillsOffered: ['Product Management', 'Agile', 'Scrum'],
    skillsWanted: ['Data Analysis', 'SQL'],
    rating: 4.8,
    ratingCount: 28,
    bio: 'Product manager with a focus on user-centered design and agile methodologies.',
    location: 'Boston, MA',
    availability: 'weekdays',
    profileVisibility: 'public'
  },
  {
    name: 'Chris Thompson',
    email: 'chris@example.com',
    password: 'password123',
    skillsOffered: ['AWS', 'Docker', 'CI/CD'],
    skillsWanted: ['Terraform', 'Ansible'],
    rating: 4.7,
    ratingCount: 20,
    bio: 'DevOps engineer helping teams scale their infrastructure.',
    location: 'Denver, CO',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    password: 'password123',
    skillsOffered: ['Vue.js', 'Nuxt.js', 'CSS'],
    skillsWanted: ['React Native', 'Mobile Development'],
    rating: 4.6,
    ratingCount: 16,
    bio: 'Frontend developer with expertise in Vue ecosystem.',
    location: 'Los Angeles, CA',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    password: 'password123',
    skillsOffered: ['C#', '.NET', 'Azure'],
    skillsWanted: ['Python', 'Django'],
    rating: 4.9,
    ratingCount: 35,
    bio: 'Microsoft stack developer looking to expand into Python.',
    location: 'Chicago, IL',
    availability: 'weekdays',
    profileVisibility: 'public'
  }
];

// Sample skills data
const skillsData = [
  { name: 'JavaScript', category: 'Programming', description: 'Popular programming language for web development', popularity: 50 },
  { name: 'Python', category: 'Programming', description: 'Versatile programming language for data science and web development', popularity: 45 },
  { name: 'React', category: 'Web Development', description: 'Popular JavaScript library for building user interfaces', popularity: 40 },
  { name: 'Node.js', category: 'Web Development', description: 'JavaScript runtime for server-side development', popularity: 35 },
  { name: 'HTML', category: 'Web Development', description: 'Markup language for creating web pages', popularity: 30 },
  { name: 'CSS', category: 'Web Development', description: 'Styling language for web pages', popularity: 30 },
  { name: 'Machine Learning', category: 'Data Science', description: 'AI technique for pattern recognition and prediction', popularity: 25 },
  { name: 'Data Science', category: 'Data Science', description: 'Field focused on extracting insights from data', popularity: 22 },
  { name: 'UI Design', category: 'Design', description: 'Creating user interfaces for digital products', popularity: 20 },
  { name: 'UX Research', category: 'Design', description: 'Researching user behavior and needs', popularity: 18 },
  { name: 'Photoshop', category: 'Design', description: 'Image editing and graphic design software', popularity: 25 },
  { name: 'Figma', category: 'Design', description: 'Collaborative design tool for UI/UX design', popularity: 15 },
  { name: 'Docker', category: 'DevOps', description: 'Containerization platform for applications', popularity: 20 },
  { name: 'AWS', category: 'DevOps', description: 'Amazon Web Services cloud platform', popularity: 30 },
  { name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration platform', popularity: 15 }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Request.deleteMany({});
    console.log('Cleared existing data');

    // Create skills first
    const skills = await Skill.insertMany(skillsData);
    console.log(`Created ${skills.length} skills`);

    // Hash passwords and create users
    const hashedUsersData = await Promise.all(
      usersData.map(async (userData) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    const users = await User.insertMany(hashedUsersData);
    console.log(`Created ${users.length} users`);

    // Create some sample requests
    const sampleRequests = [
      {
        fromUser: users[1]._id, // Sarah
        toUser: users[0]._id,   // Alex
        offeredSkill: 'Python',
        wantedSkill: 'JavaScript',
        message: 'Hi! I\'d love to help you learn Python while getting better at JavaScript myself. I have 3 years of experience with data science.',
        status: 'pending'
      },
      {
        fromUser: users[0]._id, // Alex
        toUser: users[2]._id,   // Marcus
        offeredSkill: 'React',
        wantedSkill: 'UI Design',
        message: 'I\'m really interested in improving my design skills. Would love to trade React knowledge for some UI design mentorship!',
        status: 'accepted',
        responseMessage: 'Great! I\'d love to learn React. Let\'s schedule a session.',
        respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        fromUser: users[6]._id, // Chris
        toUser: users[0]._id,   // Alex
        offeredSkill: 'Docker',
        wantedSkill: 'Node.js',
        message: 'Hey! I can help you with containerization and Docker best practices. Looking to strengthen my Node.js backend skills.',
        status: 'rejected',
        responseMessage: 'Thanks for the offer, but I\'m focusing on frontend skills right now.',
        respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ];

    const requests = await Request.insertMany(sampleRequests);
    console.log(`Created ${requests.length} sample requests`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Sample login credentials:');
    console.log('Email: alex@example.com');
    console.log('Password: password123');
    console.log('\n🌐 You can login with any of the seeded user emails using "password123"');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;