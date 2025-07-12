import { useState } from 'react'
import { Header } from '../Header'
import { UserCard } from '../UserCard'
import { Pagination } from '../Pagination'
import { StatsCard } from '../StatsCard'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Search, Filter, X, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'

interface DashboardProps {
  users: any[]
  currentUser?: any
  onViewProfile?: (userId?: string) => void
  onSendRequest?: (userId: string) => void
  onNavigateRequests?: () => void
  onLogout?: () => void
}

export function Dashboard({ users, currentUser, onViewProfile, onSendRequest, onNavigateRequests, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const usersPerPage = 9
  const totalPages = Math.ceil(users.length / usersPerPage)

  // Get all unique skills for filter options
  const allSkills = Array.from(new Set(
    users.flatMap(user => [...user.skillsOffered, ...user.skillsWanted])
  ))

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => 
        user.skillsOffered.includes(skill) || user.skillsWanted.includes(skill)
      )

    const matchesAvailability = availabilityFilter === 'all' || user.availability === availabilityFilter

    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4+' && user.rating >= 4) ||
      (ratingFilter === '4.5+' && user.rating >= 4.5)

    return matchesSearch && matchesSkills && matchesAvailability && matchesRating
  })

  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const addSkillFilter = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkillFilter = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill))
  }

  const handleSendRequest = (userId: string) => {
    if (onSendRequest) {
      onSendRequest(userId)
    }
  }

  const handleViewMyProfile = () => {
    if (onViewProfile) {
      onViewProfile()
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedSkills([])
    setAvailabilityFilter('all')
    setRatingFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="dark min-h-screen">
      <div className="min-h-screen relative">
        <Header 
          currentUser={currentUser}
          onViewProfile={handleViewMyProfile}
          onNavigateHome={() => {}} // Already on dashboard
          onNavigateRequests={onNavigateRequests}
          onLogout={onLogout}
          currentView="dashboard"
        />
        
        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-[#00C6FF]/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-[#00C6FF] via-[#00FFD1] to-[#00FFB2] bg-clip-text text-transparent">
                Welcome back, {currentUser?.name}!
              </h1>
            </div>
            <p className="text-gray-300 text-lg backdrop-blur-sm bg-black/20 rounded-lg px-4 py-2 inline-block">
              Discover talented people, swap skills, and grow together
            </p>
          </div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center">
            {/* Green Card - Active Users */}
            <StatsCard
              title="Active Users"
              value={users.length}
              icon={Users}
              color="text-[#00FFB2]"
              gradient="bg-gradient-to-br from-[#00FFB2]/15 to-[#00E6A3]/8 border border-[#00FFB2]/30"
              delay={0}
            />
            {/* Pink Card - Skills Available */}
            <StatsCard
              title="Skills Available"
              value={allSkills.length}
              icon={TrendingUp}
              color="text-[#FF69B4]"
              gradient="bg-gradient-to-br from-[#FF69B4]/15 to-[#FF1493]/8 border border-[#FF69B4]/30"
              delay={200}
            />
            {/* Yellow Card - Matches Found */}
            <StatsCard
              title="Matches Found"
              value={filteredUsers.length}
              icon={Zap}
              color="text-[#FFD700]"
              gradient="bg-gradient-to-br from-[#FFD700]/15 to-[#FFA500]/8 border border-[#FFD700]/30"
              delay={400}
            />
          </div>

          {/* Enhanced Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or skills... ✨"
                className="pl-12 h-14 bg-gray-800/60 backdrop-blur-sm border-gray-700/50 text-white placeholder-gray-400 focus:border-[#00C6FF] focus:ring-[#00C6FF] text-lg rounded-2xl shadow-lg"
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600/80 hover:border-[#00C6FF]/50 transition-all duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedSkills.length > 0 || availabilityFilter !== 'all' || ratingFilter !== 'all') && (
                  <span className="ml-2 w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse"></span>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/60 rounded-2xl p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Availability Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00FFB2] rounded-full"></div>
                      Availability
                    </label>
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white hover:border-[#00FFB2]/50 focus:border-[#00FFB2] transition-colors h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="busy">Currently Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF69B4] rounded-full"></div>
                      Minimum Rating
                    </label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white hover:border-[#FF69B4]/50 focus:border-[#FF69B4] transition-colors h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4+">4.0+ Stars</SelectItem>
                        <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skill Search */}
                  <div>
                    <label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                      Skills
                    </label>
                    <Select onValueChange={addSkillFilter}>
                      <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white hover:border-[#FFD700]/50 focus:border-[#FFD700] transition-colors h-12">
                        <SelectValue placeholder="Select skills..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allSkills.map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div>
                    <label className="text-white font-medium mb-3 block">Selected Skills:</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <Badge
                          key={skill}
                          className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/30 transition-colors px-3 py-1 animate-in slide-in-from-left-1 duration-200"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkillFilter(skill)}
                            className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters Button */}
                {(selectedSkills.length > 0 || availabilityFilter !== 'all' || ratingFilter !== 'all' || searchTerm) && (
                  <div className="flex justify-center">
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-300 flex items-center gap-2 backdrop-blur-sm bg-black/20 rounded-lg px-3 py-2">
                <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse"></span>
                Showing {currentUsers.length} of {filteredUsers.length} users
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              {currentUser && (
                <Button
                  onClick={handleViewMyProfile}
                  variant="outline"
                  className="bg-gray-800/60 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700/60 hover:border-[#00C6FF]/50 transition-all duration-200"
                >
                  View My Profile
                </Button>
              )}
            </div>
          </div>

          {/* User Cards Grid */}
          {currentUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <UserCard 
                    user={user}
                    onSendRequest={handleSendRequest}
                    onViewProfile={onViewProfile}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse backdrop-blur-sm">
                <Search className="w-16 h-16 text-[#00C6FF]/60" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">No users found</h3>
              <p className="text-gray-300 text-lg mb-6">Try adjusting your search criteria or filters</p>
              <Button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00B8E6] hover:to-[#0066E6] text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00C6FF]/25"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="animate-in slide-in-from-bottom-2 duration-500">
              <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}