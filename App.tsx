import { useState, useEffect } from 'react'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { Dashboard } from './components/Dashboard/Dashboard'
import { UserProfile } from './components/Profile/UserProfile'
import { SendRequestModal } from './components/Modals/SendRequestModal'
import { RequestsPage } from './components/Requests/RequestsPage'
import { SuccessNotification } from './components/SuccessNotification'
import backgroundImage from 'figma:asset/43bd4d12b969ee3a3866dcafa00963c3fd2ec459.png'

// Enhanced mock users with more realistic data
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
  },
  {
    id: '6',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Strategy'],
    skillsWanted: ['Photography', 'Video Editing'],
    rating: 4.6,
    bio: 'Marketing specialist with expertise in digital growth strategies.',
    location: 'Los Angeles, CA',
    availability: 'flexible',
    profileVisibility: 'public'
  }
]

// Mock requests for demonstration with unique IDs
const mockRequests = [
  {
    id: 'req_1_initial',
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    offeredSkill: 'Python',
    wantedSkill: 'JavaScript',
    message: 'Hi! I\'d love to help you learn Python while getting better at JavaScript myself.',
    status: 'pending',
    createdAt: '2024-01-15',
    isIncoming: true
  },
  {
    id: 'req_2_initial',
    fromUser: mockUsers[0],
    toUser: mockUsers[2],
    offeredSkill: 'React',
    wantedSkill: 'UI Design',
    message: 'Would love to exchange React knowledge for UI design skills!',
    status: 'accepted',
    createdAt: '2024-01-12',
    isIncoming: false
  }
]

// Counter for generating unique IDs
let requestIdCounter = 1000

// Function to generate unique request IDs
const generateUniqueRequestId = () => {
  requestIdCounter += 1
  return `req_${Date.now()}_${requestIdCounter}_${Math.random().toString(36).substr(2, 9)}`
}

// Robust API services implementation
const createAPIServices = () => ({
  authAPI: {
    login: async (email, password) => {
      console.log('🔄 Using Skill Swap Demo API')
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (password === 'password123') {
        const user = mockUsers.find(u => u.email === email) || mockUsers[0]
        return {
          success: true,
          data: {
            user,
            token: 'demo-token-' + Date.now()
          }
        }
      }
      throw new Error('Invalid credentials. Try any email with password: password123')
    },
    
    register: async (name, email, password) => {
      console.log('🔄 Creating new user account')
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
          token: 'demo-token-' + Date.now()
        }
      }
    },
    
    getCurrentUser: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return {
        success: true,
        data: { user: mockUsers[0] }
      }
    },
    
    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, message: 'Logged out successfully' }
    }
  },

  usersAPI: {
    getUsers: async (params = {}) => {
      console.log('🔄 Loading users from demo database')
      await new Promise(resolve => setTimeout(resolve, 400))
      
      let users = [...mockUsers]
      
      // Apply filters if provided
      if (params.search) {
        const search = params.search.toLowerCase()
        users = users.filter(user => 
          user.name.toLowerCase().includes(search) ||
          user.skillsOffered.some(skill => skill.toLowerCase().includes(search)) ||
          user.skillsWanted.some(skill => skill.toLowerCase().includes(search))
        )
      }
      
      if (params.availability && params.availability !== 'all') {
        users = users.filter(user => user.availability === params.availability)
      }
      
      return {
        success: true,
        data: {
          users,
          pagination: { current: 1, pages: 1, total: users.length, limit: 50 }
        }
      }
    },
    
    getUserById: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      const user = mockUsers.find(u => u.id === id)
      return user ? { success: true, data: { user } } : { success: false, message: 'User not found' }
    },
    
    updateUser: async (id, userData) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        success: true,
        data: { user: { ...userData, id } },
        message: 'Profile updated successfully'
      }
    }
  },

  requestsAPI: {
    getRequests: async () => {
      console.log('🔄 Loading skill swap requests')
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        success: true,
        data: { requests: mockRequests }
      }
    },
    
    sendRequest: async (requestData) => {
      await new Promise(resolve => setTimeout(resolve, 600))
      const newRequest = {
        id: generateUniqueRequestId(),
        fromUser: mockUsers[0],
        toUser: mockUsers.find(u => u.id === requestData.toUserId) || mockUsers[1],
        offeredSkill: requestData.offeredSkill,
        wantedSkill: requestData.wantedSkill,
        message: requestData.message,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        isIncoming: false
      }
      
      // Add to mock requests
      mockRequests.unshift(newRequest)
      
      return {
        success: true,
        data: { request: newRequest },
        message: 'Request sent successfully'
      }
    },
    
    acceptRequest: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 400))
      const request = mockRequests.find(r => r.id === id)
      if (request) {
        request.status = 'accepted'
        return {
          success: true,
          data: { request },
          message: 'Request accepted'
        }
      }
      throw new Error('Request not found')
    },
    
    rejectRequest: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 400))
      const request = mockRequests.find(r => r.id === id)
      if (request) {
        request.status = 'rejected'
        return {
          success: true,
          data: { request },
          message: 'Request rejected'
        }
      }
      throw new Error('Request not found')
    }
  },

  tokenAPI: {
    setToken: (token) => {
      try {
        localStorage.setItem('skillswap_token', token)
        console.log('🔐 Token saved successfully')
      } catch (e) {
        console.warn('Could not save token:', e)
      }
    },
    
    removeToken: () => {
      try {
        localStorage.removeItem('skillswap_token')
        console.log('🔐 Token removed successfully')
      } catch (e) {
        console.warn('Could not remove token:', e)
      }
    },
    
    getToken: () => {
      try {
        return localStorage.getItem('skillswap_token')
      } catch (e) {
        return null
      }
    },
    
    isAuthenticated: () => {
      try {
        return !!localStorage.getItem('skillswap_token')
      } catch (e) {
        return false
      }
    }
  }
})

export default function App() {
  const [appState, setAppState] = useState({
    currentView: 'login',
    currentUser: null,
    isAuthenticated: false,
    profileUserId: undefined,
    showSendRequestModal: false,
    sendRequestTargetUser: undefined,
    users: [],
    requests: [],
    loading: false,
    error: null,
    apiLoaded: false,
    // Success notification state
    showSuccessNotification: false,
    successNotification: {
      title: '',
      message: '',
      recipientName: ''
    }
  })

  // API services - using demo implementation
  const [apiServices] = useState(() => createAPIServices())

  // Initialize API services
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing Skill Swap Platform...')
      console.log('✅ Demo API services loaded successfully!')
      
      // Simulate initialization time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAppState(prev => ({ ...prev, apiLoaded: true }))
    }

    initializeApp()
  }, [])

  // Check for existing authentication after API is loaded
  useEffect(() => {
    if (!appState.apiLoaded) return

    const checkAuth = async () => {
      if (apiServices.tokenAPI.isAuthenticated()) {
        try {
          setAppState(prev => ({ ...prev, loading: true }))
          const response = await apiServices.authAPI.getCurrentUser()
          
          if (response.success && response.data?.user) {
            setAppState(prev => ({
              ...prev,
              currentUser: response.data.user,
              isAuthenticated: true,
              currentView: 'dashboard',
              loading: false
            }))
            
            // Load initial data
            await loadDashboardData(response.data.user.id)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          apiServices.tokenAPI.removeToken()
          setAppState(prev => ({ ...prev, loading: false }))
        }
      } else {
        setAppState(prev => ({ ...prev, loading: false }))
      }
    }

    checkAuth()
  }, [appState.apiLoaded, apiServices])

  // Load dashboard data (users and requests)
  const loadDashboardData = async (currentUserId) => {
    try {
      // Load users (excluding current user)
      const usersResponse = await apiServices.usersAPI.getUsers({ limit: 50 })
      if (usersResponse.success && usersResponse.data?.users) {
        const filteredUsers = usersResponse.data.users.filter(u => u.id !== currentUserId)
        setAppState(prev => ({ ...prev, users: filteredUsers }))
      }

      // Load requests
      const requestsResponse = await apiServices.requestsAPI.getRequests()
      if (requestsResponse.success && requestsResponse.data?.requests) {
        setAppState(prev => ({ ...prev, requests: requestsResponse.data.requests }))
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setAppState(prev => ({ 
        ...prev, 
        error: 'Failed to load data. Please try again.' 
      }))
    }
  }

  // Authentication functions
  const handleLogin = async (email, password) => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await apiServices.authAPI.login(email, password)
      
      if (response.success && response.data?.user && response.data?.token) {
        apiServices.tokenAPI.setToken(response.data.token)
        
        setAppState(prev => ({
          ...prev,
          currentView: 'dashboard',
          currentUser: response.data.user,
          isAuthenticated: true,
          loading: false
        }))

        // Load dashboard data
        await loadDashboardData(response.data.user.id)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setAppState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Login failed. Please check your credentials.'
      }))
      alert(error.message || 'Login failed. Please check your credentials.')
    }
  }

  const handleRegister = async (name, email, password) => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await apiServices.authAPI.register(name, email, password)
      
      if (response.success && response.data?.user && response.data?.token) {
        apiServices.tokenAPI.setToken(response.data.token)
        
        setAppState(prev => ({
          ...prev,
          currentView: 'dashboard',
          currentUser: response.data.user,
          isAuthenticated: true,
          loading: false,
          users: mockUsers.filter(u => u.id !== response.data.user.id), // Load other users
          requests: []
        }))

        // Load dashboard data
        await loadDashboardData(response.data.user.id)
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setAppState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Registration failed. Please try again.'
      }))
      alert(error.message || 'Registration failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true }))
      await apiServices.authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiServices.tokenAPI.removeToken()
      setAppState({
        currentView: 'login',
        currentUser: null,
        isAuthenticated: false,
        profileUserId: undefined,
        showSendRequestModal: false,
        sendRequestTargetUser: undefined,
        users: [],
        requests: [],
        loading: false,
        error: null,
        apiLoaded: true, // Keep API loaded
        showSuccessNotification: false,
        successNotification: {
          title: '',
          message: '',
          recipientName: ''
        }
      })
    }
  }

  // Navigation functions
  const navigateToProfile = async (userId) => {
    if (userId && userId !== appState.currentUser?.id) {
      // Load external user profile
      try {
        const response = await apiServices.usersAPI.getUserById(userId)
        if (response.success && response.data?.user) {
          setAppState(prev => ({
            ...prev,
            currentView: 'profile',
            profileUserId: userId
          }))
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
        alert('Failed to load user profile. Please try again.')
      }
    } else {
      // Navigate to own profile
      setAppState(prev => ({
        ...prev,
        currentView: 'profile',
        profileUserId: undefined
      }))
    }
  }

  const navigateToDashboard = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'dashboard',
      profileUserId: undefined
    }))
  }

  const navigateToRequests = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'requests'
    }))
  }

  // Profile management
  const handleProfileSave = async (updatedUser) => {
    if (!appState.currentUser || updatedUser.id !== appState.currentUser.id) return

    try {
      setAppState(prev => ({ ...prev, loading: true }))
      
      const response = await apiServices.usersAPI.updateUser(updatedUser.id, updatedUser)
      
      if (response.success && response.data?.user) {
        setAppState(prev => ({
          ...prev,
          currentUser: response.data.user,
          loading: false
        }))
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      setAppState(prev => ({ ...prev, loading: false }))
      alert(error.message || 'Failed to update profile. Please try again.')
    }
  }

  // Request management
  const handleSendRequest = (userId) => {
    const targetUser = appState.users.find(u => u.id === userId)
    if (targetUser && appState.currentUser) {
      setAppState(prev => ({
        ...prev,
        showSendRequestModal: true,
        sendRequestTargetUser: targetUser
      }))
    }
  }

  const handleSubmitRequest = async (requestData) => {
    if (!appState.sendRequestTargetUser || !appState.currentUser) return

    try {
      setAppState(prev => ({ ...prev, loading: true }))
      
      const response = await apiServices.requestsAPI.sendRequest({
        toUserId: appState.sendRequestTargetUser.id,
        offeredSkill: requestData.offeredSkill,
        wantedSkill: requestData.wantedSkill,
        message: requestData.message
      })

      if (response.success && response.data?.request) {
        // Add new request to state
        setAppState(prev => ({
          ...prev,
          requests: [response.data.request, ...prev.requests],
          showSendRequestModal: false,
          sendRequestTargetUser: undefined,
          loading: false,
          // Show success notification instead of alert
          showSuccessNotification: true,
          successNotification: {
            title: 'Skill Swap Request Sent!',
            message: 'Your request has been submitted and they will receive a notification.',
            recipientName: appState.sendRequestTargetUser.name
          }
        }))
      }
    } catch (error) {
      console.error('Send request failed:', error)
      setAppState(prev => ({ ...prev, loading: false }))
      alert(error.message || 'Failed to send request. Please try again.')
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await apiServices.requestsAPI.acceptRequest(requestId)
      
      if (response.success && response.data?.request) {
        // Update request in state
        setAppState(prev => ({
          ...prev,
          requests: prev.requests.map(r => 
            r.id === requestId ? response.data.request : r
          )
        }))
        alert('Request accepted! You can now start your skill swap session.')
      }
    } catch (error) {
      console.error('Accept request failed:', error)
      alert(error.message || 'Failed to accept request. Please try again.')
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await apiServices.requestsAPI.rejectRequest(requestId)
      
      if (response.success && response.data?.request) {
        // Update request in state
        setAppState(prev => ({
          ...prev,
          requests: prev.requests.map(r => 
            r.id === requestId ? response.data.request : r
          )
        }))
        alert('Request rejected.')
      }
    } catch (error) {
      console.error('Reject request failed:', error)
      alert(error.message || 'Failed to reject request. Please try again.')
    }
  }

  const closeSendRequestModal = () => {
    setAppState(prev => ({
      ...prev,
      showSendRequestModal: false,
      sendRequestTargetUser: undefined
    }))
  }

  const closeSuccessNotification = () => {
    setAppState(prev => ({
      ...prev,
      showSuccessNotification: false
    }))
  }

  // Loading state for initial app load
  if (!appState.apiLoaded || (appState.loading && !appState.currentUser)) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F111A]/90 via-[#1a1d29]/85 to-[#0F111A]/90 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-white text-xl font-semibold">
            {!appState.apiLoaded ? 'Loading Skill Swap Platform...' : 'Loading Dashboard...'}
          </h2>
          <p className="text-gray-400 mt-2">
            {!appState.apiLoaded ? 'Initializing demo environment...' : 'Setting up your workspace...'}
          </p>
        </div>
      </div>
    )
  }

  // Render based on current view
  const renderContent = () => {
    switch (appState.currentView) {
      case 'login':
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setAppState(prev => ({ ...prev, currentView: 'register' }))}
          />
        )

      case 'register':
        return (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAppState(prev => ({ ...prev, currentView: 'login' }))}
          />
        )

      case 'dashboard':
        return (
          <>
            <Dashboard
              users={appState.users}
              currentUser={appState.currentUser}
              onViewProfile={navigateToProfile}
              onSendRequest={handleSendRequest}
              onNavigateRequests={navigateToRequests}
              onLogout={handleLogout}
            />
            {appState.showSendRequestModal && appState.sendRequestTargetUser && appState.currentUser && (
              <SendRequestModal
                isOpen={appState.showSendRequestModal}
                onClose={closeSendRequestModal}
                fromUser={appState.currentUser}
                toUser={appState.sendRequestTargetUser}
                onSubmit={handleSubmitRequest}
              />
            )}
          </>
        )

      case 'profile':
        const profileUser = appState.profileUserId 
          ? appState.users.find(u => u.id === appState.profileUserId) || appState.currentUser
          : appState.currentUser
        
        return (
          <>
            <UserProfile
              user={profileUser || appState.currentUser}
              isOwnProfile={!appState.profileUserId || appState.profileUserId === appState.currentUser?.id}
              onSave={handleProfileSave}
              onBack={navigateToDashboard}
              onSendRequest={handleSendRequest}
              onViewRequests={navigateToRequests}
              currentUser={appState.currentUser}
              onLogout={handleLogout}
            />
            {appState.showSendRequestModal && appState.sendRequestTargetUser && appState.currentUser && (
              <SendRequestModal
                isOpen={appState.showSendRequestModal}
                onClose={closeSendRequestModal}
                fromUser={appState.currentUser}
                toUser={appState.sendRequestTargetUser}
                onSubmit={handleSubmitRequest}
              />
            )}
          </>
        )

      case 'requests':
        return (
          <RequestsPage
            currentUser={appState.currentUser}
            requests={appState.requests}
            onBack={navigateToDashboard}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onViewProfile={() => navigateToProfile()}
            onLogout={handleLogout}
          />
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F111A]/90 via-[#1a1d29]/85 to-[#0F111A]/90 backdrop-blur-sm"></div>
      
      {/* Additional animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00C6FF]/5 to-[#0072FF]/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#00FFD1]/5 to-[#00FFB2]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#FF69B4]/3 to-[#FFD700]/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {renderContent()}
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isVisible={appState.showSuccessNotification}
        onClose={closeSuccessNotification}
        title={appState.successNotification.title}
        message={appState.successNotification.message}
        recipientName={appState.successNotification.recipientName}
        autoCloseDelay={5000}
      />

      {/* Global error display */}
      {appState.error && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
          <button 
            onClick={() => setAppState(prev => ({ ...prev, error: null }))}
            className="float-right ml-2 text-lg font-bold cursor-pointer hover:text-gray-200"
          >
            ×
          </button>
          <p className="text-sm">{appState.error}</p>
        </div>
      )}

      {/* Demo mode indicator - now shows success */}
      <div className="fixed bottom-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg z-50">
        ✅ Demo Mode Active - Use any email with password: password123
      </div>
    </div>
  )
}