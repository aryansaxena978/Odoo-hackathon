// Simple localStorage persistence
export const storage = {
  saveUsers: (users) => {
    try {
      localStorage.setItem('skillswap_users', JSON.stringify(users))
    } catch (error) {
      console.warn('Could not save users to localStorage:', error)
    }
  },
  
  loadUsers: () => {
    try {
      const stored = localStorage.getItem('skillswap_users')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Could not load users from localStorage:', error)
      return []
    }
  },
  
  saveRequests: (requests) => {
    try {
      localStorage.setItem('skillswap_requests', JSON.stringify(requests))
    } catch (error) {
      console.warn('Could not save requests to localStorage:', error)
    }
  },
  
  loadRequests: () => {
    try {
      const stored = localStorage.getItem('skillswap_requests')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Could not load requests from localStorage:', error)
      return []
    }
  },
  
  saveCurrentUser: (user) => {
    try {
      localStorage.setItem('skillswap_current_user', JSON.stringify(user))
    } catch (error) {
      console.warn('Could not save current user to localStorage:', error)
    }
  },
  
  loadCurrentUser: () => {
    try {
      const stored = localStorage.getItem('skillswap_current_user')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Could not load current user from localStorage:', error)
      return null
    }
  },
  
  clearAll: () => {
    try {
      localStorage.removeItem('skillswap_users')
      localStorage.removeItem('skillswap_requests')
      localStorage.removeItem('skillswap_current_user')
    } catch (error) {
      console.warn('Could not clear localStorage:', error)
    }
  }
}