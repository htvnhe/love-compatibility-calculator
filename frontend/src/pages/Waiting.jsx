import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Clock, Lock, Loader2 } from 'lucide-react'
import useApi from '../hooks/useApi'

const Waiting = () => {
  const navigate = useNavigate()
  const { getSessionStatus } = useApi()

  const [status, setStatus] = useState(null)
  const [isPolling, setIsPolling] = useState(true)

  const sessionCode = sessionStorage.getItem('sessionCode')
  const isCreator = sessionStorage.getItem('isCreator') === 'true'

  useEffect(() => {
    if (!sessionCode) {
      navigate('/')
      return
    }

    // Poll for status updates
    const pollStatus = async () => {
      try {
        const statusData = await getSessionStatus(sessionCode)
        setStatus(statusData)

        if (statusData.status === 'completed') {
          setIsPolling(false)
          // Short delay then navigate to result
          setTimeout(() => {
            navigate('/result')
          }, 1500)
        }
      } catch (error) {
        console.error('Failed to get status:', error)
      }
    }

    pollStatus()
    const interval = setInterval(pollStatus, 2000)

    return () => clearInterval(interval)
  }, [sessionCode])

  const getStatusIcon = (completed) => {
    return completed ? (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
      >
        <Check className="w-5 h-5 text-white" />
      </motion.div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Animated Lock */}
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="inline-block mb-8"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center glow">
            <Lock className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold mb-2 glow-text">
          {status?.status === 'completed' ? 'Computing Result...' : 'Waiting for Partner'}
        </h1>

        <p className="text-gray-400 mb-8">
          {status?.status === 'completed'
            ? 'The encrypted computation is in progress!'
            : 'Your encrypted answers are safe and waiting'}
        </p>

        {/* Status Card */}
        <div className="glass rounded-2xl p-6 mb-8">
          {/* Session Code */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400">Session Code</p>
            <p className="text-2xl font-bold tracking-widest text-pink-400">
              {sessionCode}
            </p>
          </div>

          {/* Status List */}
          <div className="space-y-4">
            {/* Person A Status */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              {getStatusIcon(status?.person_a_submitted)}
              <div className="flex-1 text-left">
                <p className="font-medium">{status?.person_a_name || 'Person A'}</p>
                <p className="text-sm text-gray-400">
                  {status?.person_a_submitted ? 'Submitted answers' : 'Waiting...'}
                </p>
              </div>
              {status?.person_a_submitted && (
                <Lock className="w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Person B Status */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              {getStatusIcon(status?.person_b_submitted)}
              <div className="flex-1 text-left">
                <p className="font-medium">{status?.person_b_name || 'Waiting for partner...'}</p>
                <p className="text-sm text-gray-400">
                  {status?.person_b_submitted
                    ? 'Submitted answers'
                    : status?.person_b_name
                    ? 'Answering questions...'
                    : 'Not joined yet'}
                </p>
              </div>
              {status?.person_b_submitted && (
                <Lock className="w-5 h-5 text-green-400" />
              )}
            </div>
          </div>
        </div>

        {/* Computing Animation */}
        {status?.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-pink-400" />
            </motion.div>
            <p className="mt-4 text-gray-400">Decrypting your result...</p>
          </motion.div>
        )}

        {/* Waiting Animation */}
        {status?.status !== 'completed' && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-pink-400"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 glass px-4 py-2 rounded-full">
            <Lock className="w-4 h-4" />
            <span>FHE: Computing on encrypted data</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Waiting
