import React from 'react'
import { motion } from 'framer-motion'

const QuestionSlider = ({ question, value, onChange, questionNumber, totalQuestions = 5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Question Card */}
      <div className="glass rounded-3xl p-8 glow">
        {/* Question Number */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl">{question.emoji}</span>
        </div>

        {/* Question Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 glow-text">
          {question.question}
        </h2>

        {/* Slider Section */}
        <div className="space-y-6">
          {/* Labels */}
          <div className="flex justify-between text-sm text-gray-300">
            <span className="max-w-[120px] text-left">{question.min_label}</span>
            <span className="max-w-[120px] text-right">{question.max_label}</span>
          </div>

          {/* Slider */}
          <div className="relative py-4">
            <input
              type="range"
              min="1"
              max="5"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="slider-thumb w-full"
            />

            {/* Value Indicators */}
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <motion.button
                  key={num}
                  onClick={() => onChange(num)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    value === num
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected Value Display */}
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <span className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {value}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i + 1 === questionNumber
                ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                : i + 1 < questionNumber
                ? 'bg-pink-400'
                : 'bg-white/20'
            }`}
            animate={i + 1 === questionNumber ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default QuestionSlider
