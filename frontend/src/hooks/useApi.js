import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const useApi = () => {
  const getQuestions = async () => {
    const response = await api.get('/questions')
    return response.data.questions
  }

  const createSession = async (name) => {
    const response = await api.post('/session/create', { name })
    return response.data
  }

  const joinSession = async (sessionCode, name) => {
    const response = await api.post('/session/join', {
      session_code: sessionCode,
      name
    })
    return response.data
  }

  const submitAnswers = async (sessionCode, personId, answers) => {
    const response = await api.post('/answers/submit', {
      session_code: sessionCode,
      person_id: personId,
      answers
    })
    return response.data
  }

  const getSessionStatus = async (sessionCode) => {
    const response = await api.get(`/session/${sessionCode}/status`)
    return response.data
  }

  const getResult = async (sessionCode) => {
    const response = await api.get(`/session/${sessionCode}/result`)
    return response.data
  }

  return {
    getQuestions,
    createSession,
    joinSession,
    submitAnswers,
    getSessionStatus,
    getResult
  }
}

export default useApi
