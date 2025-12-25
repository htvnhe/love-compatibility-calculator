import React from 'react'
import { motion } from 'framer-motion'

const PERSONALITY_TAGS = [
  { id: 1, label: 'Sweetie', emoji: '🍬', color: 'from-pink-400 to-rose-400' },
  { id: 2, label: 'Shining Star', emoji: '✨', color: 'from-yellow-400 to-amber-400' },
  { id: 3, label: 'Dreamer', emoji: '🌙', color: 'from-purple-400 to-indigo-400' },
  { id: 4, label: 'Sunshine', emoji: '☀️', color: 'from-orange-400 to-yellow-400' },
  { id: 5, label: 'Angel', emoji: '👼', color: 'from-sky-400 to-blue-400' },
  { id: 6, label: 'Cutie Pie', emoji: '🥧', color: 'from-amber-400 to-orange-400' },
  { id: 7, label: 'Lovely', emoji: '💕', color: 'from-pink-400 to-red-400' },
  { id: 8, label: 'Charming', emoji: '🦋', color: 'from-teal-400 to-cyan-400' },
  { id: 9, label: 'Precious', emoji: '💎', color: 'from-blue-400 to-purple-400' },
  { id: 10, label: 'Honey', emoji: '🍯', color: 'from-yellow-400 to-orange-400' },
  { id: 11, label: 'Sparkle', emoji: '💫', color: 'from-violet-400 to-purple-400' },
  { id: 12, label: 'Cuddle Bug', emoji: '🐛', color: 'from-green-400 to-emerald-400' },
]

const PersonalityTags = ({ selectedTags, onTagToggle, maxTags = 3 }) => {
  const handleTagClick = (tag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      onTagToggle(selectedTags.filter(t => t.id !== tag.id))
    } else if (selectedTags.length < maxTags) {
      onTagToggle([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Choose your vibe ✨
        </label>
        <span className="text-xs text-gray-500">
          {selectedTags.length}/{maxTags} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERSONALITY_TAGS.map((tag, index) => {
          const isSelected = selectedTags.find(t => t.id === tag.id)

          return (
            <motion.button
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagClick(tag)}
              disabled={!isSelected && selectedTags.length >= maxTags}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 flex items-center gap-1.5
                ${isSelected
                  ? `bg-gradient-to-r ${tag.color} text-white shadow-lg shadow-pink-500/25`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }
                ${!isSelected && selectedTags.length >= maxTags ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </motion.button>
          )
        })}
      </div>

      {selectedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20"
        >
          <p className="text-sm text-gray-300">
            <span className="text-pink-400">Your vibe:</span>{' '}
            {selectedTags.map((tag, i) => (
              <span key={tag.id}>
                {tag.emoji} {tag.label}
                {i < selectedTags.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default PersonalityTags
