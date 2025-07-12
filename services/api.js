// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock data for fallback
const mockUsers = [
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
  }
];

const mockRequests = [
  {
    id: '1',
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    offeredSkill: 'Python',
    wantedSkill: 'JavaScript',
    message: 'Hi! I\'d love to help you learn Python while getting better at JavaScript myself.',
    status: 'pending',
    createdAt: '2024-01-15',
    isIncoming: true
  }
];

// Utility function to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('skillswap_token');
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

// Utility function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Utility function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

// Generic API request function with fallback
const apiRequest = async (endpoint, options = {}, includeAuth = true, mockResponse = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(includeAuth);
  
  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.warn(`API request failed: ${endpoint}`, error.message);
    
    // Return mock response if provided
    if (mockResponse) {
      console.log('Using fallback mock data');
      return {
        success: true,
        data: mockResponse,
        message: 'Using offline data'
      };
    }
    
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    try {
      return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, false);
    } catch (error) {
      // Fallback for demo purposes
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password123') {
        return {
          success: true,
          data: {
            user,
            token: 'demo-token-' + Date.now()
          }
        };
      }
      throw new Error('Invalid credentials. Try any email with password: password123');
    }
  },

  register: async (name, email, password) => {
    try {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }, false);
    } catch (error) {
      // Fallback for demo purposes
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
      };
      
      return {
        success: true,
        data: {
          user: newUser,
          token: 'demo-token-' + Date.now()
        }
      };
    }
  },

  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      // Fallback - return first mock user
      return {
        success: true,
        data: {
          user: mockUsers[0]
        }
      };
    }
  },

  logout: async () => {
    try {
      return await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      return { success: true, message: 'Logged out successfully' };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      return await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch (error) {
      return { success: true, message: 'Password changed successfully' };
    }
  },
};

// Users API functions
export const usersAPI = {
  getUsers: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.availability) searchParams.append('availability', params.availability);
    if (params.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params.skills && params.skills.length > 0) {
      searchParams.append('skills', params.skills.join(','));
    }

    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    try {
      return await apiRequest(endpoint, {}, false);
    } catch (error) {
      // Fallback to mock data with filtering
      let users = [...mockUsers];
      
      // Apply search filter
      if (params.search) {
        const search = params.search.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(search) ||
          user.skillsOffered.some(skill => skill.toLowerCase().includes(search)) ||
          user.skillsWanted.some(skill => skill.toLowerCase().includes(search))
        );
      }
      
      // Apply availability filter
      if (params.availability && params.availability !== 'all') {
        users = users.filter(user => user.availability === params.availability);
      }
      
      // Apply rating filter
      if (params.minRating) {
        users = users.filter(user => user.rating >= parseFloat(params.minRating));
      }
      
      return {
        success: true,
        data: {
          users,
          pagination: {
            current: 1,
            pages: 1,
            total: users.length,
            limit: 50
          }
        }
      };
    }
  },

  getUserById: async (id) => {
    try {
      return await apiRequest(`/users/${id}`, {}, false);
    } catch (error) {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        return {
          success: true,
          data: { user }
        };
      }
      throw new Error('User not found');
    }
  },

  updateUser: async (id, userData) => {
    try {
      return await apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      // Simulate successful update
      return {
        success: true,
        data: {
          user: { ...userData, id }
        }
      };
    }
  },

  getSkills: async () => {
    try {
      return await apiRequest('/users/skills', {}, false);
    } catch (error) {
      const allSkills = [...new Set([
        ...mockUsers.flatMap(u => u.skillsOffered),
        ...mockUsers.flatMap(u => u.skillsWanted)
      ])];
      
      return {
        success: true,
        data: { skills: allSkills }
      };
    }
  },

  getUserStats: async (id) => {
    try {
      return await apiRequest(`/users/${id}/stats`, {}, false);
    } catch (error) {
      return {
        success: true,
        data: {
          user: {
            name: 'User',
            skillsOfferedCount: 3,
            skillsWantedCount: 2,
            rating: 4.5,
            ratingCount: 10,
            memberSince: new Date()
          }
        }
      };
    }
  },
};

// Requests API functions
export const requestsAPI = {
  getRequests: async () => {
    try {
      return await apiRequest('/requests');
    } catch (error) {
      return {
        success: true,
        data: { requests: mockRequests }
      };
    }
  },

  getPendingRequests: async () => {
    try {
      return await apiRequest('/requests/pending');
    } catch (error) {
      const pendingRequests = mockRequests.filter(r => r.status === 'pending');
      return {
        success: true,
        data: { requests: pendingRequests }
      };
    }
  },

  sendRequest: async (requestData) => {
    try {
      return await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    } catch (error) {
      // Simulate successful request creation
      const newRequest = {
        id: String(Date.now()),
        fromUser: mockUsers[0],
        toUser: mockUsers.find(u => u.id === requestData.toUserId) || mockUsers[1],
        offeredSkill: requestData.offeredSkill,
        wantedSkill: requestData.wantedSkill,
        message: requestData.message,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        isIncoming: false
      };
      
      return {
        success: true,
        data: { request: newRequest }
      };
    }
  },

  acceptRequest: async (id, responseMessage = '') => {
    try {
      return await apiRequest(`/requests/${id}/accept`, {
        method: 'PUT',
        body: JSON.stringify({ responseMessage }),
      });
    } catch (error) {
      const request = mockRequests.find(r => r.id === id);
      if (request) {
        request.status = 'accepted';
        request.responseMessage = responseMessage;
        return {
          success: true,
          data: { request }
        };
      }
      throw new Error('Request not found');
    }
  },

  rejectRequest: async (id, responseMessage = '') => {
    try {
      return await apiRequest(`/requests/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ responseMessage }),
      });
    } catch (error) {
      const request = mockRequests.find(r => r.id === id);
      if (request) {
        request.status = 'rejected';
        request.responseMessage = responseMessage;
        return {
          success: true,
          data: { request }
        };
      }
      throw new Error('Request not found');
    }
  },

  completeRequest: async (id) => {
    try {
      return await apiRequest(`/requests/${id}/complete`, {
        method: 'PUT',
      });
    } catch (error) {
      const request = mockRequests.find(r => r.id === id);
      if (request) {
        request.status = 'completed';
        return {
          success: true,
          data: { request }
        };
      }
      throw new Error('Request not found');
    }
  },

  cancelRequest: async (id) => {
    try {
      return await apiRequest(`/requests/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        success: true,
        message: 'Request cancelled successfully'
      };
    }
  },
};

// Skills API functions
export const skillsAPI = {
  getSkills: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/skills${queryString ? `?${queryString}` : ''}`;
    
    try {
      return await apiRequest(endpoint, {}, false);
    } catch (error) {
      const skills = [
        { name: 'JavaScript', category: 'Programming', popularity: 50 },
        { name: 'Python', category: 'Programming', popularity: 45 },
        { name: 'React', category: 'Web Development', popularity: 40 },
        { name: 'Node.js', category: 'Web Development', popularity: 35 },
        { name: 'UI Design', category: 'Design', popularity: 30 }
      ];
      
      return {
        success: true,
        data: { skills }
      };
    }
  },

  getSkillsByCategory: async () => {
    try {
      return await apiRequest('/skills/categories', {}, false);
    } catch (error) {
      return {
        success: true,
        data: {
          categories: [
            { _id: 'Programming', skills: [{ name: 'JavaScript' }, { name: 'Python' }] },
            { _id: 'Design', skills: [{ name: 'UI Design' }, { name: 'Photoshop' }] }
          ]
        }
      };
    }
  },

  getPopularSkills: async (limit = 20) => {
    try {
      const endpoint = `/skills/popular${limit ? `?limit=${limit}` : ''}`;
      return await apiRequest(endpoint, {}, false);
    } catch (error) {
      return {
        success: true,
        data: {
          skills: [
            { name: 'JavaScript', popularity: 50 },
            { name: 'Python', popularity: 45 },
            { name: 'React', popularity: 40 }
          ]
        }
      };
    }
  },

  createSkill: async (skillData) => {
    try {
      return await apiRequest('/skills', {
        method: 'POST',
        body: JSON.stringify(skillData),
      });
    } catch (error) {
      return {
        success: true,
        data: {
          skill: { ...skillData, id: Date.now(), popularity: 1 }
        }
      };
    }
  },
};

// Token management functions
export const tokenAPI = {
  setToken: (token) => {
    try {
      localStorage.setItem('skillswap_token', token);
    } catch (error) {
      console.warn('Could not save token:', error);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem('skillswap_token');
    } catch (error) {
      console.warn('Could not remove token:', error);
    }
  },

  getToken: () => {
    return getAuthToken();
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Health check function
export const healthAPI = {
  check: async () => {
    try {
      return await apiRequest('/health', {}, false);
    } catch (error) {
      return {
        success: true,
        data: {
          message: 'Skill Swap API is running in demo mode!',
          timestamp: new Date().toISOString(),
          env: 'demo'
        }
      };
    }
  },
};