import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { Pagination } from '../Pagination'
import { ArrowLeft, Search, Filter, MessageSquare, CheckCircle, XCircle, Clock, Users, Sparkles } from 'lucide-react'
import { Header } from '../Header'

interface Request {
  id: string
  fromUser: any
  toUser: any
  offeredSkill: string
  wantedSkill: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  isIncoming: boolean
}

interface RequestsPageProps {
  currentUser: any
  requests: Request[]
  onBack: () => void
  onAcceptRequest: (requestId: string) => void
  onRejectRequest: (requestId: string) => void
  onViewProfile?: () => void
  onLogout?: () => void
}

export function RequestsPage({ currentUser, requests, onBack, onAcceptRequest, onRejectRequest, onViewProfile, onLogout }: RequestsPageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const requestsPerPage = 5

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const otherUser = request.isIncoming ? request.fromUser : request.toUser
    const matchesSearch = otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.offeredSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.wantedSkill.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const startIndex = (currentPage - 1) * requestsPerPage
  const currentRequests = filteredRequests.slice(startIndex, startIndex + requestsPerPage)
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'accepted': return 'text-[#00FFB2]'
      case 'rejected': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen dark">
      <Header
        currentUser={currentUser}
        onViewProfile={onViewProfile}
        onNavigateHome={onBack}
        onNavigateRequests={() => {}} // Already on requests
        onLogout={onLogout}
        currentView="requests"
      />

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFD700]/25">
            <MessageSquare className="w-8 h-8 text-gray-900" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">Skill Swap Requests</h1>
            <p className="text-gray-400 text-lg">Manage your incoming and outgoing requests</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests by name or skills..."
                className="pl-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C6FF]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Showing {currentRequests.length} of {filteredRequests.length} requests
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                {requests.filter(r => r.status === 'pending').length} Pending
              </Badge>
              <Badge variant="outline" className="bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/20">
                {requests.filter(r => r.status === 'accepted').length} Accepted
              </Badge>
              <Badge variant="outline" className="bg-red-400/10 text-red-400 border-red-400/20">
                {requests.filter(r => r.status === 'rejected').length} Rejected
              </Badge>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {currentRequests.length > 0 ? (
            currentRequests.map((request) => {
              const otherUser = request.isIncoming ? request.fromUser : request.toUser
              return (
                <div
                  key={request.id}
                  className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00C6FF]/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* User Avatar */}
                      <Avatar className="w-16 h-16 border-2 border-gray-700 shadow-lg">
                        {otherUser.avatar ? (
                          <ImageWithFallback src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white">
                            {otherUser.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold text-lg">{otherUser.name}</h3>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">Rating: {otherUser.rating}/5</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00FFB2] text-sm">Skills Offered:</span>
                            <Badge className="bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20">
                              {request.offeredSkill}
                            </Badge>
                          </div>
                          <span className="text-gray-500">↔</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[#6EC1E4] text-sm">Skills Wanted:</span>
                            <Badge className="bg-[#6EC1E4]/10 text-[#6EC1E4] border border-[#6EC1E4]/20">
                              {request.wantedSkill}
                            </Badge>
                          </div>
                        </div>

                        {request.message && (
                          <div className="flex items-start gap-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm bg-gray-800/30 p-3 rounded-lg">
                              "{request.message}"
                            </p>
                          </div>
                        )}

                        <p className="text-gray-400 text-sm">
                          {request.isIncoming ? 'Received' : 'Sent'} on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="font-medium capitalize">{request.status}</span>
                      </div>

                      {request.isIncoming && request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onAcceptRequest(request.id)}
                            size="sm"
                            className="bg-gradient-to-r from-[#00FFB2] to-[#00E6A3] hover:from-[#00E6A3] hover:to-[#00D194] text-gray-900 font-medium px-4"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => onRejectRequest(request.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/50 px-4"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-12 h-12 text-[#00C6FF]" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No requests found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}