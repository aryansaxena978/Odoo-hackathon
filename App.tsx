import { useState, useEffect } from 'react'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { Dashboard } from './components/Dashboard/Dashboard'
import { UserProfile } from './components/Profile/UserProfile'
import { SendRequestModal } from './components/Modals/SendRequestModal'
import { RequestsPage } from './components/Requests/RequestsPage'
import backgroundImage from 'figma:asset/43bd4d12b969ee3a3866dcafa00963c3fd2ec459.png'

// Fallback API implementation
const mockUsers = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning'],
    rating: 4.8,
    bio: 'Full-stack developer with 5 years experience.',
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
    bio: 'Data scientist passionate about AI.',
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
    bio: 'Creative designer with 8 years in the industry.',
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
]

const createAPIServices = () => ({
  authAPI: {
    login: async (email, password) => {
      console.log('🔄 Using demo login API')
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
      console.log('🔄 Using demo register API')
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
          token: 'demo-token-' + Date.now()
        }
      }
    },
    getCurrentUser: async () => ({
      success: true,
      data: { user: mockUsers[0] }
    }),
    logout: async () => ({ success: true })
  },

  usersAPI: {
    getUsers: async (params = {}) => {
      console.log('🔄 Using demo getUsers API')
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
      
      return {
        success: true,
        data: {
          users,
          pagination: { current: 1, pages: 1, total: users.length, limit: 50 }
        }
      }
    },
    getUserById: async (id) => {
      const user = mockUsers.find(u => u.id === id)
      return user ? { success: true, data: { user } } : { success: false }
    },
    updateUser: async (id, userData) => ({
      success: true,
      data: { user: { ...userData, id } }
    })
  },

  requestsAPI: {
    getRequests: async () => ({
      success: true,
      data: { requests: [] }
    }),
    sendRequest: async (requestData) => ({
      success: true,
      data: {
        request: {
          id: String(Date.now()),
          fromUser: mockUsers[0],
          toUser: mockUsers.find(u => u.id === requestData.toUserId) || mockUsers[1],
          offeredSkill: requestData.offeredSkill,
          wantedSkill: requestData.wantedSkill,
          message: requestData.message,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          isIncoming: false
        }
      }
    }),
    acceptRequest: async (id) => ({
      success: true,
      data: { request: { id, status: 'accepted' } }
    }),
    rejectRequest: async (id) => ({
      success: true,
      data: { request: { id, status: 'rejected' } }
    })
  },

  tokenAPI: {
    setToken: (token) => {
      try {
        localStorage.setItem('skillswap_token', token)
      } catch (e) {
        console.warn('Could not save token')
      }
    },
    removeToken: () => {
      try {
        localStorage.removeItem('skillswap_token')
      } catch (e) {
        console.warn('Could not remove token')
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
    apiLoaded: false
  })

  // API services - start with demo API
  const [apiServices, setApiServices] = useState(() => createAPIServices())

  // Load API services with robust error handling
  useEffect(() => {
    const loadApiServices = async () => {
      try {
        console.log('🔄 Attempting to load enhanced API services...')
        
        // Try to dynamically import the external API
        const apiModule = await import('./services/api.js')
        
        // Validate the imported module structure
        if (
          apiModule?.authAPI?.login && 
          typeof apiModule.authAPI.login === 'function' &&
          apiModule?.usersAPI?.getUsers &&
          typeof apiModule.usersAPI.getUsers === 'function' &&
          apiModule?.requestsAPI?.sendRequest &&
          typeof apiModule.requestsAPI.sendRequest === 'function' &&
          apiModule?.tokenAPI?.setToken &&
          typeof apiModule.tokenAPI.setToken === 'function'
        ) {
          console.log('✅ Enhanced API services loaded successfully!')
          setApiServices({
            authAPI: apiModule.authAPI,
            usersAPI: apiModule.usersAPI,
            requestsAPI: apiModule.requestsAPI,
            tokenAPI: apiModule.tokenAPI
          })
        } else {
          console.warn('⚠️ External API module structure is incomplete, using demo API')
        }
      } catch (error) {
        console.warn('❌ Failed to load external API services:', error.message)
        console.log('📱 Using built-in demo API implementation')
        // Keep using the demo API services
      }
      
      setAppState(prev => ({ ...prev, apiLoaded: true }))
    }

    // Add a small delay to show loading state
    const timer = setTimeout(loadApiServices, 100)
    return () => clearTimeout(timer)
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
        error: 'Failed to load data. Using offline mode.' 
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
          users: [], // New user won't have other users initially
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
      await apiServices.authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiServices.tokenAPI.removeToken()
      setAppState({
        ...appState,
        currentView: 'login',
        currentUser: null,
        isAuthenticated: false,
        profileUserId: undefined,
        showSendRequestModal: false,
        sendRequestTargetUser: undefined,
        users: [],
        requests: [],
        loading: false,
        error: null
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
          loading: false
        }))

        alert(`✅ Skill swap request sent to ${appState.sendRequestTargetUser.name}!\n\nYour request has been submitted and they will receive a notification. You can track the status in your requests page.`)
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

  // Loading state for API and initial auth
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
            {!appState.apiLoaded ? 'Loading Skill Swap API...' : 'Loading Skill Swap...'}
          </h2>
          <p className="text-gray-400 mt-2">
            {!appState.apiLoaded ? 'Setting up demo mode...' : 'Checking authentication...'}
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

      {/* Demo mode indicator */}
      <div className="fixed bottom-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg z-50">
        🎯 Demo Mode - Use any email with password: password123
      </div>
    </div>
  )
}