import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeartIcon from '../components/HeartIcon'
import LockIcon from '../components/LockIcon'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Fully Encrypted',
      description: 'Your answers are encrypted on your device and never revealed'
    },
    {
      icon: <EyeOff className="w-8 h-8" />,
      title: 'Private Forever',
      description: 'Not even the server can see your individual answers'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'FHE Technology',
      description: 'Powered by Zama\'s Fully Homomorphic Encryption'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HeartIcon size={120} />
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-4">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Love Compatibility
          </span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white/80 mb-6">
          Calculator
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Discover your compatibility score with your partner -
          <span className="text-pink-400 font-semibold"> without revealing your private answers!</span>
        </motion.p>

        {/* FHE Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-10"
        >
          <LockIcon size={30} />
          <span className="text-sm font-medium text-gray-300">
            Powered by <span className="text-yellow-400 font-bold">Zama FHE</span> - Fully Homomorphic Encryption
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="btn-primary text-xl px-10 py-5"
          >
            Start New Session 💕
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/join')}
            className="px-10 py-5 rounded-full font-semibold text-xl border-2 border-white/30 hover:border-pink-400 hover:bg-white/5 transition-all"
          >
            Join Partner 💝
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-pink-400">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center max-w-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 glow-text">How It Works</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center text-pink-400 font-bold">1</span>
            <span>Create session</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold">2</span>
            <span>Share code</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold">3</span>
            <span>Both answer</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 font-bold">4</span>
            <span>See result!</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage
