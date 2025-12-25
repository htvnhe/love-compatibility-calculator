import React, { useEffect, useState } from 'react'

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '🩵']
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: Math.random() * 100,
      animationDelay: Math.random() * 15,
      animationDuration: 15 + Math.random() * 10,
      size: 16 + Math.random() * 20
    }))
    setHearts(newHearts)
  }, [])

  return (
    <div className="hearts-bg">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart-particle"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.animationDelay}s`,
            animationDuration: `${heart.animationDuration}s`
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  )
}

export default FloatingHearts
