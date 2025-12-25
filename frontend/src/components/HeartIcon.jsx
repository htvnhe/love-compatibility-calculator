import React from 'react'
import { motion } from 'framer-motion'

const HeartIcon = ({ size = 100, animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animate ? {
        scale: [1, 1.1, 1],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="50%" stopColor="#C44DFF" />
          <stop offset="100%" stopColor="#4D79FF" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50 88C50 88 10 60 10 35C10 20 22 10 35 10C42 10 48 14 50 20C52 14 58 10 65 10C78 10 90 20 90 35C90 60 50 88 50 88Z"
        fill="url(#heartGradient)"
        filter="url(#glow)"
      />
    </motion.svg>
  )
}

export default HeartIcon
