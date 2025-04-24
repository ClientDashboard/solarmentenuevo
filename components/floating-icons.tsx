"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Sun, Zap, BarChart3, DollarSign } from "lucide-react"

interface FloatingIconsProps {
  className?: string
}

export default function FloatingIcons({ className = "" }: FloatingIconsProps) {
  const [icons, setIcons] = useState<React.ReactNode[]>([])

  useEffect(() => {
    // Iconos disponibles
    const iconComponents = [
      <Sun key="sun" className="text-orange-500/20" />,
      <Zap key="zap" className="text-yellow-500/20" />,
      <BarChart3 key="chart" className="text-blue-500/20" />,
      <DollarSign key="dollar" className="text-green-500/20" />,
    ]

    // Crear iconos flotantes
    const floatingIcons = []
    const numberOfIcons = 8

    for (let i = 0; i < numberOfIcons; i++) {
      const icon = iconComponents[i % iconComponents.length]
      const size = Math.random() * 30 + 20
      const left = Math.random() * 100
      const top = Math.random() * 100
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5

      floatingIcons.push(
        <div
          key={i}
          className="absolute floating-icon"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            style: { width: "100%", height: "100%" },
          })}
        </div>,
      )
    }

    setIcons(floatingIcons)
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ pointerEvents: "none" }}>
      {icons}
    </div>
  )
}
