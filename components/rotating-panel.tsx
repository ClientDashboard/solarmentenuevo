"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export default function RotatingPanel() {
  const [currentAngle, setCurrentAngle] = useState(0)
  const animationRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Imágenes del panel solar
  const panels = ["/images/panel-front.png", "/images/panel-angle.png", "/images/panel-back.png"]

  // Función para determinar qué imagen mostrar basado en el ángulo actual
  const getVisiblePanel = (angle: number) => {
    // Normalizar el ángulo a un valor entre 0 y 359
    const normalizedAngle = angle % 360

    // Dividir los 360 grados en secciones iguales para cada imagen
    if (normalizedAngle >= 0 && normalizedAngle < 120) {
      return 0 // Panel frontal
    } else if (normalizedAngle >= 120 && normalizedAngle < 240) {
      return 1 // Panel en ángulo
    } else {
      return 2 // Panel trasero
    }
  }

  // Función para animar la rotación
  const animate = () => {
    // Incrementar el ángulo para la rotación continua
    setCurrentAngle((prevAngle) => (prevAngle + 0.5) % 360)

    animationRef.current = requestAnimationFrame(animate)
  }

  // Iniciar la animación
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Calcular qué panel debe mostrarse
  const visiblePanelIndex = getVisiblePanel(currentAngle)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        {panels.map((panel, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-300"
            style={{
              opacity: index === visiblePanelIndex ? 1 : 0,
              zIndex: index === visiblePanelIndex ? 10 : 0,
            }}
          >
            <Image
              src={panel || "/placeholder.svg"}
              alt={`Panel Solar Vista ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
