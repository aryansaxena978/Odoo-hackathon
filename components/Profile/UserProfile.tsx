import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { StarRating } from '../StarRating'
import { Edit2, Plus, X, ArrowLeft, Send, Save, RotateCcw, MessageSquare, Home, Camera, MapPin, Clock, Eye, EyeOff } from 'lucide-react'
import { Header } from '../Header'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    skillsOffered: string[]
    skillsWanted: string[]
    rating: number
    bio?: string
    location?: string
    availability?: string
    profileVisibility?: string
  }
  isOwnProfile: boolean
  onSave?: (updatedUser: any) => void
  onBack?: () => void
  onSendRequest?: (userId: string) => void
  onViewRequests?: () => void
  currentUser?: any
  onLogout?: () => void
}

export function UserProfile({ user, isOwnProfile, onSave, onBack, onSendRequest, onViewRequests, currentUser, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    ...user,
    availability: user.availability || 'weekends',
    profileVisibility: user.profileVisibility || 'public'
  })
  const [newSkillOffered, setNewSkillOffered] = useState('')
  const [newSkillWanted, setNewSkillWanted] = useState('')

  const handleSave = () => {
    if (onSave) {
      onSave(editedUser)
    }
    setIsEditing(false)
  }

  const handleDiscard = () => {
    setEditedUser({
      ...user,
      availability: user.availability || 'weekends',
      profileVisibility: user.profileVisibility || 'public'
    })
    setIsEditing(false)
  }

  const handleSendRequest = () => {
    if (onSendRequest) {
      onSendRequest(user.id)
    }
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, newSkillOffered.trim()]
      })
      setNewSkillOffered('')
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, newSkillWanted.trim()]
      })
      setNewSkillWanted('')
    }
  }

  const removeSkillOffered = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsOffered: editedUser.skillsOffered.filter((_, i) => i !== index)
    })
  }

  const removeSkillWanted = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsWanted: editedUser.skillsWanted.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen dark">
      <Header
        currentUser={currentUser || user}
        onViewProfile={() => {}} // Already on profile
        onNavigateHome={onBack}
        onNavigateRequests={onViewRequests}
        onLogout={onLogout}
        currentView="profile"
      />
      
      {/* Edit Actions Bar */}
      {isOwnProfile && isEditing && (
        <div className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/30">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-medium">Editing Profile</h2>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#00FFB2] to-[#00E6A3] hover:from-[#00E6A3] hover:to-[#00D194] text-gray-900 font-medium px-4"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleDiscard}
                  variant="outline"
                  className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Discard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/60 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-gray-600/50 shadow-2xl">
                      {user.avatar ? (
                        <ImageWithFallback src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white text-4xl font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isOwnProfile && isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="absolute top-2 right-2 text-xs bg-gray-900/80 text-white px-2 py-1 rounded">
                      {isEditing ? 'Add/Edit/Remove' : 'Profile Photo'}
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="flex-1 space-y-4">
                    {/* Name */}
                    <div>
                      <Label className="text-white font-medium">Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="mt-1 bg-gray-800/60 border-gray-600 text-white h-10"
                        />
                      ) : (
                        <div className="mt-1 text-white text-xl font-semibold">{user.name}</div>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <Label className="text-white font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.location || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                          placeholder="Your location..."
                          className="mt-1 bg-gray-800/60 border-gray-600 text-white h-10"
                        />
                      ) : (
                        <div className="mt-1 text-gray-300">{user.location || 'Location not specified'}</div>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <Label className="text-white font-medium">Rating</Label>
                      <div className="mt-1">
                        <StarRating rating={user.rating} size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <Label className="text-white font-medium">About</Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.bio || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="mt-1 bg-gray-800/60 border-gray-600 text-white h-10"
                    />
                  ) : (
                    <p className="mt-1 text-gray-300">{user.bio || 'No bio available'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Offered */}
              <Card className="bg-gradient-to-br from-[#00FFB2]/15 to-[#00E6A3]/8 backdrop-blur-xl border border-[#00FFB2]/30 hover:border-[#00FFB2]/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-[#00FFB2] flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00FFB2] rounded-full"></div>
                    Skills Offered
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editedUser.skillsOffered : user.skillsOffered).map((skill, index) => (
                      <Badge 
                        key={index}
                        className="bg-[#00FFB2]/30 text-[#00FFB2] border border-[#00FFB2]/40 hover:bg-[#00FFB2]/40 transition-colors"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkillOffered(index)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        placeholder="Add skill..."
                        className="bg-gray-800/60 border-gray-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      />
                      <Button onClick={addSkillOffered} size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Wanted */}
              <Card className="bg-gradient-to-br from-[#FF69B4]/15 to-[#FF1493]/8 backdrop-blur-xl border border-[#FF69B4]/30 hover:border-[#FF69B4]/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-[#FF69B4] flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF69B4] rounded-full"></div>
                    Skills Wanted
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editedUser.skillsWanted : user.skillsWanted).map((skill, index) => (
                      <Badge 
                        key={index}
                        className="bg-[#FF69B4]/30 text-[#FF69B4] border border-[#FF69B4]/40 hover:bg-[#FF69B4]/40 transition-colors"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkillWanted(index)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        placeholder="Add skill..."
                        className="bg-gray-800/60 border-gray-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      />
                      <Button onClick={addSkillWanted} size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Settings Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {isOwnProfile ? (
                    <Edit2 className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  {isOwnProfile ? 'Profile Settings' : 'Profile Info'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Availability */}
                <div>
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Availability
                  </Label>
                  {isEditing ? (
                    <Select value={editedUser.availability} onValueChange={(value) => setEditedUser({ ...editedUser, availability: value })}>
                      <SelectTrigger className="mt-1 bg-gray-800/60 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="busy">Currently Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 text-gray-300 capitalize">{user.availability || 'weekends'}</div>
                  )}
                </div>

                {/* Profile Visibility */}
                {isOwnProfile && (
                  <div>
                    <Label className="text-white font-medium flex items-center gap-2">
                      {editedUser.profileVisibility === 'public' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Profile Visibility
                    </Label>
                    {isEditing ? (
                      <Select value={editedUser.profileVisibility} onValueChange={(value) => setEditedUser({ ...editedUser, profileVisibility: value })}>
                        <SelectTrigger className="mt-1 bg-gray-800/60 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1 text-gray-300 capitalize">{user.profileVisibility || 'public'}</div>
                    )}
                  </div>
                )}

                {/* Edit Button */}
                {isOwnProfile && !isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00B8E6] hover:to-[#0066E6] text-white font-medium"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Send Request Card */}
            {!isOwnProfile && (
              <Card className="bg-gradient-to-br from-[#00C6FF]/15 to-[#0072FF]/8 backdrop-blur-xl border border-[#00C6FF]/30">
                <CardContent className="p-6">
                  <Button 
                    onClick={handleSendRequest}
                    className="w-full bg-gradient-to-r from-[#00C6FF] via-[#00FFD1] to-[#0072FF] hover:from-[#00B8E6] hover:via-[#00E6BC] hover:to-[#0066E6] text-gray-900 font-semibold h-12 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00C6FF]/25"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Skill Swap Request
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}