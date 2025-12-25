import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import QuestionSlider from '../components/QuestionSlider'
import useApi from '../hooks/useApi'

const Questions = () => {
  const navigate = useNavigate()
  const { getQuestions, submitAnswers } = useApi()

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sessionCode = sessionStorage.getItem('sessionCode')
  const personId = sessionStorage.getItem('personId')
  const personName = sessionStorage.getItem('personName')

  useEffect(() => {
    if (!sessionCode || !personId) {
      navigate('/')
      return
    }

    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const questionsData = await getQuestions()
      setQuestions(questionsData)
      // Initialize answers with default value of 3
      const initialAnswers = {}
      questionsData.forEach((q, i) => {
        initialAnswers[i] = 3
      })
      setAnswers(initialAnswers)
    } catch (error) {
      console.error('Failed to load questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Convert answers object to array
      const answersArray = questions.map((_, i) => answers[i])

      await submitAnswers(sessionCode, personId, answersArray)

      // Navigate to waiting room
      navigate('/waiting')
    } catch (error) {
      console.error('Failed to submit answers:', error)
      alert('Failed to submit answers. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          💕
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-gray-400 mb-2">
          Answering as <span className="text-pink-400 font-bold">{personName}</span>
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <QuestionSlider
            key={currentQuestion}
            question={question}
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </motion.button>

        {isLastQuestion ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  🔒
                </motion.span>
                Encrypting...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Submit Encrypted Answers
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Your answers are encrypted and never revealed</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Questions
