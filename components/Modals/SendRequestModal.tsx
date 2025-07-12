import { useState } from 'react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { Send, X, Sparkles } from 'lucide-react'

interface SendRequestModalProps {
  isOpen: boolean
  onClose: () => void
  fromUser: any
  toUser: any
  onSubmit: (data: {
    offeredSkill: string
    wantedSkill: string
    message: string
  }) => void
}

export function SendRequestModal({ isOpen, onClose, fromUser, toUser, onSubmit }: SendRequestModalProps) {
  const [offeredSkill, setOfferedSkill] = useState('')
  const [wantedSkill, setWantedSkill] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!offeredSkill || !wantedSkill) {
      alert('Please select both skills')
      return
    }
    onSubmit({ offeredSkill, wantedSkill, message })
    onClose()
    // Reset form
    setOfferedSkill('')
    setWantedSkill('')
    setMessage('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-2 border-gray-700/50 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00FFD1]" />
              Send Skill Swap Request
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            Create a skill swap proposal with {toUser.name}. Select skills to exchange and add a personal message.
          </DialogDescription>
        </DialogHeader>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <Avatar className="w-12 h-12 border-2 border-[#00C6FF]/30">
            {toUser.avatar ? (
              <ImageWithFallback src={toUser.avatar} alt={toUser.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white">
                {toUser.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-white font-medium">{toUser.name}</p>
            <p className="text-gray-400 text-sm">Rating: {toUser.rating}/5</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offered Skill */}
          <div className="space-y-2">
            <Label className="text-[#00FFB2] font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00FFB2] rounded-full"></span>
              Choose one of your offered skills
            </Label>
            <Select value={offeredSkill} onValueChange={setOfferedSkill}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white hover:border-[#00FFB2]/50 focus:border-[#00FFB2] transition-colors h-12">
                <SelectValue placeholder="Select a skill you can teach..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {fromUser.skillsOffered.map((skill: string) => (
                  <SelectItem key={skill} value={skill} className="text-white hover:bg-gray-700">
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wanted Skill */}
          <div className="space-y-2">
            <Label className="text-[#6EC1E4] font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-[#6EC1E4] rounded-full"></span>
              Choose one of their wanted skills
            </Label>
            <Select value={wantedSkill} onValueChange={setWantedSkill}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white hover:border-[#6EC1E4]/50 focus:border-[#6EC1E4] transition-colors h-12">
                <SelectValue placeholder="Select a skill they want to learn..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {toUser.skillsWanted.map((skill: string) => (
                  <SelectItem key={skill} value={skill} className="text-white hover:bg-gray-700">
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Message (Optional)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00C6FF] min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-gray-400 text-sm text-right">{message.length}/500</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00C6FF] via-[#00FFD1] to-[#0072FF] hover:from-[#00B8E6] hover:via-[#00E6BC] hover:to-[#0066E6] text-gray-900 font-semibold h-12 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00C6FF]/25 transform"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}