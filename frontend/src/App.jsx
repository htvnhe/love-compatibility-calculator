import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateSession from './pages/CreateSession'
import JoinSession from './pages/JoinSession'
import Questions from './pages/Questions'
import Waiting from './pages/Waiting'
import Result from './pages/Result'
import FloatingHearts from './components/FloatingHearts'

function App() {
  return (
    <div className="min-h-screen relative">
      <FloatingHearts />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/join" element={<JoinSession />} />
          <Route path="/join/:code" element={<JoinSession />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
