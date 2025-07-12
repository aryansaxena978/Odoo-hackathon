import { useState, useEffect, useRef } from 'react'

export function StatsCard({ title, value, icon: Icon, color, gradient, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    // Trigger animation after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsAnimating(true)
      
      // Enhanced count up animation with easing
      let current = 0
      const duration = 2000 // 2 seconds for smooth animation
      const startTime = Date.now()
      
      const animateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        
        current = value * easedProgress
        setDisplayValue(Math.floor(current))
        
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        } else {
          setDisplayValue(value)
          setIsAnimating(false)
        }
      }
      
      requestAnimationFrame(animateCount)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  // Enhanced mouse move handler for 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / centerY * -15
    const rotateY = (x - centerX) / centerX * 15
    
    card.style.transform = `
      perspective(1200px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(30px)
      scale(1.05)
    `
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    
    cardRef.current.style.transform = `
      perspective(1200px) 
      rotateX(0deg) 
      rotateY(0deg) 
      translateZ(0px)
      scale(1)
    `
  }

  return (
    <div 
      ref={cardRef}
      className={`${gradient} backdrop-blur-xl rounded-3xl p-8 transform transition-all duration-700 hover-tilt card-hover-glow relative overflow-hidden aspect-square flex flex-col items-center justify-center text-center ${
        isVisible ? 'translate-y-0 opacity-100 stats-card-bounce' : 'translate-y-8 opacity-0'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, opacity 0.7s ease-out, translate 0.7s ease-out',
        minHeight: '200px',
        minWidth: '200px'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform rotate-45 scale-150"></div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 hover:border-white/30 transition-colors duration-300"></div>
      
      {/* Icon at the top */}
      <div 
        className={`w-16 h-16 ${color.replace('text-', 'bg-')}/20 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg mb-6 icon-float`}
        style={{
          transform: 'translateZ(30px)',
          backdropFilter: 'blur(15px)',
          border: `2px solid ${color.replace('text-', '')}30`,
          boxShadow: `0 8px 25px ${color.replace('text-', '')}20`
        }}
      >
        {Icon && (
          <Icon 
            className={`w-8 h-8 ${color} transition-all duration-300 hover:scale-110`}
            style={{
              filter: `drop-shadow(0 0 15px ${color.replace('text-', '')}50)`,
              transform: 'translateZ(10px)'
            }}
          />
        )}
      </div>

      {/* Title in the middle */}
      <div className="space-y-4 relative z-10 flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-300 font-medium opacity-90 hover:opacity-100 transition-opacity duration-300 tracking-wide">
          {title}
        </p>
        
        {/* Large number display */}
        <div 
          className={`text-4xl font-bold ${color} transition-all duration-300 ${
            isAnimating ? 'animate-pulse number-glow' : ''
          }`}
          style={{
            textShadow: `0 0 25px ${color.replace('text-', '')}40`,
            transform: 'translateZ(20px)'
          }}
        >
          {displayValue.toLocaleString()}
        </div>
        
        {/* Progress indicator during animation */}
        {isAnimating && (
          <div className="w-20 h-1 bg-gray-700/30 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full bg-gradient-to-r ${color.replace('text-', 'from-')} ${color.replace('text-', 'to-')}/80 rounded-full transition-all duration-2000 ease-out progress-animate`}
              style={{
                width: `${(displayValue / value) * 100}%`
              }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Floating particles effect positioned around the card */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 ${color.replace('text-', 'bg-')}/40 rounded-full floating-particle`}
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + (i % 2) * 70}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Enhanced hover shadow with color matching */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 25px 50px -12px ${color.replace('text-', '')}25, 0 0 40px ${color.replace('text-', '')}15`,
          filter: 'blur(20px)',
          transform: 'translateZ(-15px)'
        }}
      ></div>
      
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color.replace('text-', '')}20 0%, transparent 70%)`
        }}
      ></div>
    </div>
  )
}