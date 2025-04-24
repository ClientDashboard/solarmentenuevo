"use client"

import React, { useEffect, useRef } from "react"

interface TypingAnimationProps {
  children: React.ReactNode
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lines = container.querySelectorAll(".line")
    let delay = 0.1

    lines.forEach((line, index) => {
      ;(line as HTMLElement).style.animationDelay = `${delay}s`
      delay += 0.4
    })
  }, [children])

  return (
    <div className="typing-container" ref={containerRef}>
      {React.Children.map(children, (child, index) => (
        <div className="line" key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}

export default TypingAnimation
