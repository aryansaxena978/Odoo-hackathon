import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Users, Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00C6FF]/25 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl bg-gradient-to-r from-[#00C6FF] via-[#00FFD1] to-[#00FFB2] bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your Skill Swap account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-[#00C6FF] focus:ring-[#00C6FF] backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-[#00C6FF] focus:ring-[#00C6FF] backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00B8E6] hover:to-[#0066E6] text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#00C6FF]/25 hover:scale-105"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-[#00C6FF] hover:text-[#00B8E6] transition-colors font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}