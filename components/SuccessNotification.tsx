import { useEffect } from 'react'
import { CheckCircle, X, User, ArrowRight } from 'lucide-react'

interface SuccessNotificationProps {
  isVisible: boolean
  onClose: () => void
  title: string
  message: string
  recipientName?: string
  autoCloseDelay?: number
}

export function SuccessNotification({ 
  isVisible, 
  onClose, 
  title, 
  message, 
  recipientName,
  autoCloseDelay = 5000 
}: SuccessNotificationProps) {
  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, autoCloseDelay])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Notification Container */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <div 
          className={`
            bg-gradient-to-br from-[#0F111A]/95 to-[#1a1d29]/95 
            backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 max-w-sm
            shadow-2xl shadow-green-500/10
            transform transition-all duration-500 ease-out
            ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
            hover:scale-105 hover:shadow-green-500/20
            glass-card relative overflow-hidden
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 17, 26, 0.95) 0%, rgba(26, 29, 41, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 8px 16px rgba(34, 197, 94, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
          >
            <X size={16} />
          </button>

          {/* Success Icon and Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg mb-1">
                {title}
              </h3>
              
              {recipientName && (
                <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                  <User size={14} />
                  <span>Sent to {recipientName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="text-gray-300 text-sm leading-relaxed mb-4">
            {message}
          </div>

          {/* Action Hint */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
            <ArrowRight size={12} />
            <span>Track status in your requests page</span>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-2xl overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-b-2xl"
              style={{
                animation: `progressShrink ${autoCloseDelay}ms linear forwards`,
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Add keyframes animation using a style element */}
      <style>
        {`
          @keyframes progressShrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  )
}