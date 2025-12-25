import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const ScoreReveal = ({ score, message, personA, personB, onComplete }) => {
  const [phase, setPhase] = useState(0) // 0: counting, 1: reveal, 2: message
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    // Phase 0: Count up animation
    const duration = 2000
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
        setPhase(1)

        // Trigger confetti for high scores
        if (score >= 70) {
          triggerConfetti()
        }

        setTimeout(() => setPhase(2), 500)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const triggerConfetti = () => {
    const colors = ['#FF6B9D', '#C44DFF', '#4D79FF', '#FFD700']

    // Multiple bursts
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors
    }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        particleCount: Math.floor(count * particleRatio),
        ...opts
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    // Hearts confetti
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        shapes: ['circle'],
        colors: ['#FF6B9D', '#FF1493', '#FF69B4']
      })
    }, 500)
  }

  const getScoreColor = () => {
    if (score >= 80) return 'from-green-400 to-emerald-500'
    if (score >= 60) return 'from-pink-400 to-purple-500'
    if (score >= 40) return 'from-yellow-400 to-orange-500'
    return 'from-orange-400 to-red-500'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Names */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-2xl font-bold text-pink-400">{personA}</span>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl"
        >
          💕
        </motion.span>
        <span className="text-2xl font-bold text-purple-400">{personB}</span>
      </motion.div>

      {/* Score Circle */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        className="relative"
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, #FF6B9D, #C44DFF, #4D79FF, #FF6B9D)`,
            filter: 'blur(20px)',
            opacity: 0.5
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Score circle */}
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center border-4 border-white/20">
          {/* Progress ring */}
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 754' }}
              animate={{ strokeDasharray: `${(displayScore / 100) * 754} 754` }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B9D" />
                <stop offset="50%" stopColor="#C44DFF" />
                <stop offset="100%" stopColor="#4D79FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score number */}
          <div className="text-center">
            <motion.span
              className={`text-7xl font-black bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}
              animate={phase >= 1 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {displayScore}
            </motion.span>
            <span className="text-3xl text-white/60">%</span>
            <p className="text-sm text-gray-400 mt-2">Compatibility</p>
          </div>
        </div>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center max-w-md"
          >
            <motion.p
              className="text-2xl font-semibold glow-text"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {message}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share button placeholder */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 btn-primary flex items-center gap-2"
            onClick={() => window.location.href = '/'}
          >
            <span>Try Again</span>
            <span>💕</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ScoreReveal
