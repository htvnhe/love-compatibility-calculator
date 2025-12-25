import React from 'react'
import { motion } from 'framer-motion'

const LockIcon = ({ size = 60 }) => {
  return (
    <motion.div
      className="relative"
      animate={{
        rotateY: [0, 360],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          fill="url(#lockGradient)"
        />
        <path
          d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
          stroke="url(#lockGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1.5" fill="#1a1a2e" />
      </svg>
    </motion.div>
  )
}

export default LockIcon
