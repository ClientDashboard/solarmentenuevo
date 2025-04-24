"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export default function RotatingPanelAlt() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const animationRef = useRef<number | null>(null)
  const totalFrames = 36 // Dividimos 360 grados en 36 frames (cada 10 grados)

  // Mapeo de frames a imágenes
  // Tenemos 3 imágenes para cubrir 360 grados, así que cada imagen cubre 120 grados o 12 frames
  const getImageForFrame = (frame: number) => {
    if (frame < 12) {
      return "/images/panel-front.png"
    } else if (frame < 24) {
      return "/images/panel-angle.png"
    } else {
      return "/images/panel-back.png"
    }
  }

  // Función para animar la rotación
  const animate = () => {
    setCurrentFrame((prev) => (prev + 1) % totalFrames)
    animationRef.current = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate)
    }, 100) // Controlamos la velocidad de rotación
  }

  // Iniciar la animación
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  // Calcular el ángulo actual para la rotación visual
  const currentAngle = (currentFrame / totalFrames) * 360

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-full h-full"
        style={{
          transform: `rotateY(${currentAngle}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image
          src={getImageForFrame(currentFrame) || "/placeholder.svg"}
          alt="Panel Solar Vista 360"
          fill
          className="object-contain p-4"
          priority
        />
      </div>
    </div>
  )
}
