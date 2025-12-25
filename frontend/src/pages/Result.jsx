import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScoreReveal from '../components/ScoreReveal'
import useApi from '../hooks/useApi'

const Result = () => {
  const navigate = useNavigate()
  const { getResult } = useApi()

  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const sessionCode = sessionStorage.getItem('sessionCode')

  useEffect(() => {
    if (!sessionCode) {
      navigate('/')
      return
    }

    loadResult()
  }, [sessionCode])

  const loadResult = async () => {
    try {
      const resultData = await getResult(sessionCode)
      setResult(resultData)
    } catch (error) {
      console.error('Failed to load result:', error)
      setError('Failed to load result. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            💕
          </motion.div>
          <p className="text-gray-400">Loading your result...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">😢</span>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold glow-text mb-2">Your Result!</h1>
          <p className="text-gray-400">Computed on encrypted data using FHE</p>
        </motion.div>

        {/* Score Reveal Component */}
        {result && (
          <ScoreReveal
            score={result.score}
            message={result.message}
            personA={result.person_a_name}
            personB={result.person_b_name}
          />
        )}

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full">
            <span className="text-2xl">🔐</span>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Privacy Protected</p>
              <p className="text-xs text-gray-400">Individual answers were never revealed</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Result
