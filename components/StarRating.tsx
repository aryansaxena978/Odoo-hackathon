import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  className?: string
  showValue?: boolean
}

export function StarRating({ 
  rating, 
  maxStars = 5, 
  size = 16, 
  className = "",
  showValue = true 
}: StarRatingProps) {
  const stars = []
  
  for (let i = 1; i <= maxStars; i++) {
    const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1) * 100
    
    stars.push(
      <div key={i} className="relative inline-block">
        {/* Background star (empty) */}
        <Star 
          size={size} 
          className="text-gray-600 dark:text-gray-500" 
          fill="none"
        />
        
        {/* Filled star overlay */}
        {fillPercentage > 0 && (
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star 
              size={size} 
              className="text-[#FFD700] drop-shadow-sm" 
              fill="#FFD700"
            />
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm text-gray-400 ml-1">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  )
}