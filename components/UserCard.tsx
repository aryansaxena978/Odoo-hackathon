import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { StarRating } from './StarRating'

interface UserCardProps {
  user: {
    id: string
    name: string
    avatar?: string
    skillsOffered: string[]
    skillsWanted: string[]
    rating: number
  }
  onSendRequest?: (userId: string) => void
  onViewProfile?: (userId: string) => void
}

export function UserCard({ user, onSendRequest, onViewProfile }: UserCardProps) {
  const handleSendRequest = () => {
    if (onSendRequest) {
      onSendRequest(user.id)
    }
  }

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user.id)
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/70 transition-all duration-300 hover:shadow-xl hover:shadow-[#00C6FF]/10 hover-tilt card-hover-glow cursor-pointer group relative">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="cursor-pointer"
          onClick={handleViewProfile}
        >
          <Avatar className="w-16 h-16 border-2 border-gray-700 shadow-lg group-hover:border-[#00C6FF] transition-colors group-hover:shadow-[#00C6FF]/20">
            {user.avatar ? (
              <ImageWithFallback src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white text-lg font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div>
          <h3 
            className="text-white text-lg font-semibold cursor-pointer group-hover:text-[#00C6FF] transition-colors"
            onClick={handleViewProfile}
          >
            {user.name}
          </h3>
          <div className="mt-1">
            <StarRating rating={user.rating} size={14} />
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#00FFB2] text-sm font-medium">Skills Offered</span>
          <span className="text-[#00FFB2]">=&gt;</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered.map((skill, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/20 hover:bg-[#00FFB2]/20 transition-colors group-hover:bg-[#00FFB2]/20 group-hover:border-[#00FFB2]/30"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#6EC1E4] text-sm font-medium">Skills Wanted</span>
          <span className="text-[#6EC1E4]">=&gt;</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.skillsWanted.map((skill, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="bg-[#6EC1E4]/10 text-[#6EC1E4] border border-[#6EC1E4]/20 hover:bg-[#6EC1E4]/20 transition-colors group-hover:bg-[#6EC1E4]/20 group-hover:border-[#6EC1E4]/30"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Request Button */}
      <Button 
        onClick={handleSendRequest}
        className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00B8E6] hover:to-[#0066E6] text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#00C6FF]/25 group-hover:shadow-[#00C6FF]/30 group-hover:from-[#00B8E6] group-hover:to-[#0066E6] relative z-10"
      >
        Send Request
      </Button>
    </div>
  )
}