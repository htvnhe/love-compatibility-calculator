import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react'
import HeartIcon from '../components/HeartIcon'
import useApi from '../hooks/useApi'

const CreateSession = () => {
  const navigate = useNavigate()
  const { createSession } = useApi()

  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return

    setIsCreating(true)
    try {
      const data = await createSession(name.trim())
      setSessionData(data)
      // Store session info
      sessionStorage.setItem('sessionCode', data.session_code)
      sessionStorage.setItem('personId', data.person_id)
      sessionStorage.setItem('personName', name.trim())
      sessionStorage.setItem('isCreator', 'true')
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Failed to create session. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(sessionData.session_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = () => {
    const url = `${window.location.origin}/join/${sessionData.session_code}`
    if (navigator.share) {
      navigator.share({
        title: 'Love Compatibility Calculator',
        text: `Join my love compatibility session! Code: ${sessionData.session_code}`,
        url
      })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const proceedToQuestions = () => {
    navigate('/questions')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {!sessionData ? (
          // Name Input Step
          <>
            <div className="text-center mb-8">
              <HeartIcon size={80} />
              <h1 className="text-3xl font-bold mt-4 glow-text">Create Session</h1>
              <p className="text-gray-400 mt-2">Enter your name to get started</p>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 transition-all text-white placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={!name.trim() || isCreating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      💕
                    </motion.span>
                    Creating...
                  </span>
                ) : (
                  'Create Session 💕'
                )}
              </motion.button>
            </div>
          </>
        ) : (
          // Session Created - Share Code
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-6xl">🎉</span>
              </motion.div>
              <h1 className="text-3xl font-bold mt-4 glow-text">Session Created!</h1>
              <p className="text-gray-400 mt-2">Share this code with your partner</p>
            </motion.div>

            <div className="glass rounded-2xl p-8">
              {/* Session Code Display */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-2">Session Code</p>
                <motion.div
                  className="text-5xl font-black tracking-widest bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {sessionData.session_code}
                </motion.div>
              </div>

              {/* Copy & Share Buttons */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyCode}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareLink}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Link</span>
                </motion.button>
              </div>

              {/* Proceed Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={proceedToQuestions}
                className="w-full btn-primary"
              >
                Start Answering Questions 💕
              </motion.button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Your partner can join later with this code
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default CreateSession
