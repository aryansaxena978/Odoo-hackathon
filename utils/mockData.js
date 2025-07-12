// Mock data for fallback when backend is not available
export const mockUsers = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning'],
    rating: 4.8,
    bio: 'Full-stack developer with 5 years experience. Love teaching web development!',
    location: 'San Francisco, CA',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    skillsOffered: ['Python', 'Data Science', 'TensorFlow'],
    skillsWanted: ['JavaScript', 'Web Development'],
    rating: 4.9,
    bio: 'Data scientist passionate about AI and helping others learn data analysis.',
    location: 'Seattle, WA',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    skillsOffered: ['Photoshop', 'Illustrator', 'UI Design'],
    skillsWanted: ['Figma', 'UX Research'],
    rating: 4.7,
    bio: 'Creative designer with 8 years in the industry. Always eager to learn new tools!',
    location: 'Austin, TX',
    availability: 'weekdays',
    profileVisibility: 'public'
  },
  {
    id: '4',
    name: 'Elena Vasquez',
    email: 'elena@example.com',
    skillsOffered: ['Java', 'Spring Boot', 'Microservices'],
    skillsWanted: ['Kubernetes', 'DevOps'],
    rating: 4.6,
    bio: 'Backend developer specializing in enterprise applications.',
    location: 'Miami, FL',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    skillsOffered: ['Angular', 'TypeScript', 'RxJS'],
    skillsWanted: ['React', 'GraphQL'],
    rating: 4.5,
    bio: 'Frontend engineer passionate about modern web frameworks.',
    location: 'Portland, OR',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    id: '6',
    name: 'Maya Patel',
    email: 'maya@example.com',
    skillsOffered: ['Product Management', 'Agile', 'Scrum'],
    skillsWanted: ['Data Analysis', 'SQL'],
    rating: 4.8,
    bio: 'Product manager with a focus on user-centered design and agile methodologies.',
    location: 'Boston, MA',
    availability: 'weekdays',
    profileVisibility: 'public'
  },
  {
    id: '7',
    name: 'Chris Thompson',
    email: 'chris@example.com',
    skillsOffered: ['AWS', 'Docker', 'CI/CD'],
    skillsWanted: ['Terraform', 'Ansible'],
    rating: 4.7,
    bio: 'DevOps engineer helping teams scale their infrastructure.',
    location: 'Denver, CO',
    availability: 'weekends',
    profileVisibility: 'public'
  },
  {
    id: '8',
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    skillsOffered: ['Vue.js', 'Nuxt.js', 'CSS'],
    skillsWanted: ['React Native', 'Mobile Development'],
    rating: 4.6,
    bio: 'Frontend developer with expertise in Vue ecosystem.',
    location: 'Los Angeles, CA',
    availability: 'flexible',
    profileVisibility: 'public'
  },
  {
    id: '9',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    skillsOffered: ['C#', '.NET', 'Azure'],
    skillsWanted: ['Python', 'Django'],
    rating: 4.9,
    bio: 'Microsoft stack developer looking to expand into Python.',
    location: 'Chicago, IL',
    availability: 'weekdays',
    profileVisibility: 'public'
  }
]

// Generate mock requests
export const generateMockRequests = (currentUserId) => [
  {
    id: '1',
    fromUser: mockUsers.find(u => u.id === '2'),
    toUser: mockUsers.find(u => u.id === currentUserId),
    offeredSkill: 'Python',
    wantedSkill: 'JavaScript',
    message: 'Hi! I\'d love to help you learn Python while getting better at JavaScript myself. I have 3 years of experience with data science.',
    status: 'pending',
    createdAt: '2024-01-15',
    isIncoming: true
  },
  {
    id: '2',
    fromUser: mockUsers.find(u => u.id === currentUserId),
    toUser: mockUsers.find(u => u.id === '3'),
    offeredSkill: 'React',
    wantedSkill: 'UI Design',
    message: 'I\'m really interested in improving my design skills. Would love to trade React knowledge for some UI design mentorship!',
    status: 'accepted',
    createdAt: '2024-01-10',
    isIncoming: false
  },
  {
    id: '3',
    fromUser: mockUsers.find(u => u.id === '7'),
    toUser: mockUsers.find(u => u.id === currentUserId),
    offeredSkill: 'Docker',
    wantedSkill: 'Node.js',
    message: 'Hey! I can help you with containerization and Docker best practices. Looking to strengthen my Node.js backend skills.',
    status: 'rejected',
    createdAt: '2024-01-08',
    isIncoming: true
  },
  {
    id: '4',
    fromUser: mockUsers.find(u => u.id === currentUserId),
    toUser: mockUsers.find(u => u.id === '6'),
    offeredSkill: 'JavaScript',
    wantedSkill: 'Product Management',
    message: 'I\'d love to learn more about product management methodology and best practices.',
    status: 'pending',
    createdAt: '2024-01-12',
    isIncoming: false
  }
]

// Mock authentication function
export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const user = mockUsers.find(u => u.email === email)
  if (user && password === 'password123') {
    return {
      success: true,
      data: {
        user,
        token: 'mock_jwt_token_' + Date.now()
      }
    }
  }
  
  throw new Error('Invalid credentials')
}

// Mock registration function
export const mockRegister = async (name, email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newUser = {
    id: String(Date.now()),
    name,
    email,
    skillsOffered: [],
    skillsWanted: [],
    rating: 0,
    bio: '',
    location: '',
    availability: 'weekends',
    profileVisibility: 'public'
  }
  
  return {
    success: true,
    data: {
      user: newUser,
      token: 'mock_jwt_token_' + Date.now()
    }
  }
}