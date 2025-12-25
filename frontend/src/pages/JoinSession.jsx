import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import HeartIcon from '../components/HeartIcon'
import PersonalityTags from '../components/PersonalityTags'
import useApi from '../hooks/useApi'

const CUTE_ICONS = ['💖', '🌸', '✨', '🦋', '🌈', '💫', '🍬', '🎀']

const JoinSession = () => {
  const navigate = useNavigate()
  const { code: urlCode } = useParams()
  const { joinSession } = useApi()

  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💖')
  const [selectedTags, setSelectedTags] = useState([])
  const [sessionCode, setSessionCode] = useState(urlCode || '')
  const [isJoining, setIsJoining] = useState(false)
  const [partnerName, setPartnerName] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (urlCode) {
      setSessionCode(urlCode)
    }
  }, [urlCode])

  const handleJoin = async () => {
    if (!name.trim() || !sessionCode.trim()) return

    setIsJoining(true)
    setError('')

    try {
      const data = await joinSession(sessionCode.trim().toUpperCase(), getDisplayName())

      // Store session info
      sessionStorage.setItem('sessionCode', data.session_code)
      sessionStorage.setItem('personId', data.person_id)
      sessionStorage.setItem('personName', getDisplayName())
      sessionStorage.setItem('isCreator', 'false')

      setPartnerName(data.partner_name)

      // Short delay then navigate to questions
      setTimeout(() => {
        navigate('/questions')
      }, 2000)
    } catch (error) {
      console.error('Failed to join session:', error)
      if (error.response?.status === 404) {
        setError('Session not found. Please check the code.')
      } else if (error.response?.status === 400) {
        setError('This session already has two participants.')
      } else {
        setError('Failed to join session. Please try again.')
      }
    } finally {
      setIsJoining(false)
    }
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
        {!partnerName ? (
          <>
            <div className="text-center mb-8">
              <HeartIcon size={80} />
              <h1 className="text-3xl font-bold mt-4 glow-text">Join Session</h1>
              <p className="text-gray-400 mt-2">Enter the code from your partner</p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXX"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 transition-all text-white placeholder-gray-500 text-center text-2xl tracking-widest font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pick your icon 🎨
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUTE_ICONS.map((icon) => (
                    <motion.button
                      key={icon}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-200 ${selectedIcon === icon ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name 💕
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">{selectedIcon}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 transition-all text-white placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                  />
                </div>
              </div>

              <PersonalityTags
                selectedTags={selectedTags}
                onTagToggle={setSelectedTags}
                maxTags={3}
              />

              {name.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                >
                  <p className="text-xs text-gray-400 mb-1">Your vibe:</p>
                  <p className="text-md font-medium text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    {getDisplayName()}
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoin}
                disabled={!name.trim() || !sessionCode.trim() || isJoining}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      💕
                    </motion.span>
                    Joining...
                  </span>
                ) : (
                  'Join Session 💝'
                )}
              </motion.button>
            </div>
          </>
        ) : (
          // Successfully joined
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-8xl">💕</span>
            </motion.div>

            <h1 className="text-3xl font-bold mt-6 glow-text">Connected!</h1>

            <p className="text-xl text-gray-300 mt-4">
              You're now connected with{' '}
              <span className="text-pink-400 font-bold">{partnerName}</span>
            </p>

            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400 mt-6"
            >
              Starting questions...
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default JoinSession
