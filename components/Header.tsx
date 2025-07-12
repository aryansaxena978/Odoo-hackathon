import { Home, User, MessageSquare, LogOut, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface HeaderProps {
  currentUser?: {
    id: string
    name: string
    avatar?: string
  } | null
  onViewProfile?: () => void
  onNavigateHome?: () => void
  onNavigateRequests?: () => void
  onLogout?: () => void
  currentView?: string
}

export function Header({ 
  currentUser, 
  onViewProfile, 
  onNavigateHome, 
  onNavigateRequests, 
  onLogout,
  currentView = 'dashboard'
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const isActive = (view: string) => currentView === view

  return (
    <header className="w-full p-6 border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#00C6FF]/25">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Skill Swap</h1>
            <p className="text-gray-400 text-xs">Exchange & Grow</p>
          </div>
        </div>

        {/* Navigation Menu */}
        {currentUser && (
          <nav className="flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
            {/* Home */}
            <Button
              onClick={onNavigateHome}
              variant="ghost"
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive('dashboard') 
                  ? 'bg-gradient-to-r from-[#00C6FF]/20 to-[#0072FF]/10 text-[#00C6FF] border border-[#00C6FF]/30 shadow-lg shadow-[#00C6FF]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:block font-medium">Home</span>
              {isActive('dashboard') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5 rounded-xl animate-pulse"></div>
              )}
            </Button>

            {/* Profile */}
            <Button
              onClick={onViewProfile}
              variant="ghost"
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive('profile') 
                  ? 'bg-gradient-to-r from-[#FF69B4]/20 to-[#FF1493]/10 text-[#FF69B4] border border-[#FF69B4]/30 shadow-lg shadow-[#FF69B4]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:block font-medium">Profile</span>
              {isActive('profile') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF69B4]/5 to-[#FF1493]/5 rounded-xl animate-pulse"></div>
              )}
            </Button>

            {/* Swap Requests */}
            <Button
              onClick={onNavigateRequests}
              variant="ghost"
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive('requests') 
                  ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/10 text-[#FFD700] border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:block font-medium">Requests</span>
              {isActive('requests') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-[#FFA500]/5 rounded-xl animate-pulse"></div>
              )}
            </Button>
          </nav>
        )}

        {/* User Menu or Login Button */}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-gray-600/50"
              >
                <Avatar className="w-10 h-10 ring-2 ring-[#00C6FF]/30 ring-offset-2 ring-offset-gray-900">
                  {currentUser.avatar ? (
                    <ImageWithFallback 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white font-semibold">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-white font-medium">{currentUser.name}</p>
                  <p className="text-gray-400 text-xs">Click for menu</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl"
            >
              <div className="p-3 border-b border-gray-700/50">
                <p className="text-white font-medium">{currentUser.name}</p>
                <p className="text-gray-400 text-sm">Skill Swap Member</p>
              </div>
              
              <DropdownMenuItem 
                onClick={onViewProfile}
                className="text-white hover:bg-gray-700/50 cursor-pointer rounded-lg mx-2 my-1 transition-colors"
              >
                <User className="w-4 h-4 mr-3 text-[#FF69B4]" />
                View Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={onNavigateHome}
                className="text-white hover:bg-gray-700/50 cursor-pointer rounded-lg mx-2 my-1 transition-colors"
              >
                <Home className="w-4 h-4 mr-3 text-[#00C6FF]" />
                Dashboard
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={onNavigateRequests}
                className="text-white hover:bg-gray-700/50 cursor-pointer rounded-lg mx-2 my-1 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-3 text-[#FFD700]" />
                Swap Requests
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-700/50 mx-2" />
              
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer rounded-lg mx-2 my-1 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00B8E6] hover:to-[#0066E6] text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Login
          </Button>
        )}
      </div>
    </header>
  )
}