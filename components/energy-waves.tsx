"use client"

import { useEffect, useRef } from "react"

interface EnergyWavesProps {
  className?: string
}

export default function EnergyWaves({ className = "" }: EnergyWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear ondas de energía
    const createWave = () => {
      const wave = document.createElement("div")
      wave.classList.add("energy-wave")

      // Posición aleatoria
      const left = Math.random() * 100
      const top = Math.random() * 100

      // Tamaño aleatorio
      const size = Math.random() * 100 + 50

      // Color aleatorio (naranja o azul con baja opacidad)
      const colors = ["rgba(247, 127, 0, 0.1)", "rgba(59, 130, 246, 0.1)"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      // Aplicar estilos
      wave.style.left = `${left}%`
      wave.style.top = `${top}%`
      wave.style.width = `${size}px`
      wave.style.height = `${size}px`
      wave.style.borderColor = color

      // Añadir al contenedor
      container.appendChild(wave)

      // Eliminar después de la animación
      setTimeout(() => {
        if (container.contains(wave)) {
          container.removeChild(wave)
        }
      }, 4000)
    }

    // Crear ondas periódicamente
    const interval = setInterval(createWave, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
