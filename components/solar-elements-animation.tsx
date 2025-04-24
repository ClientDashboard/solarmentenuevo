"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Zap, Sun, Leaf, PiggyBank } from "lucide-react"

interface SolarElementsAnimationProps {
  className?: string
  numberOfElements?: number
}

export default function SolarElementsAnimation({ className = "", numberOfElements = 30 }: SolarElementsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<React.ReactNode[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Crear elementos solares animados
    const createElements = () => {
      const newElements = []
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight

      // Tipos de elementos con pesos para controlar la frecuencia
      const elementTypes = [
        { type: "panel", weight: 10 }, // Panel solar (mayor peso para que aparezcan más)
        { type: "zap", weight: 3 }, // Rayo (energía)
        { type: "sun", weight: 5 }, // Sol (del logo)
        { type: "leaf", weight: 3 }, // Hoja (ecológico)
        { type: "piggy", weight: 3 }, // Cerdito (ahorro)
      ]

      // Función para seleccionar un tipo de elemento basado en su peso
      const selectElementType = () => {
        // Calcular el peso total
        const totalWeight = elementTypes.reduce((sum, item) => sum + item.weight, 0)
        // Generar un número aleatorio entre 0 y el peso total
        let random = Math.random() * totalWeight

        // Seleccionar el tipo basado en el peso
        for (const element of elementTypes) {
          random -= element.weight
          if (random <= 0) {
            return element.type
          }
        }
        return "panel" // Por defecto, devolver panel
      }

      for (let i = 0; i < numberOfElements; i++) {
        // Seleccionar tipo de elemento aleatorio basado en pesos
        const elementType = selectElementType()

        // Posición inicial aleatoria
        const left = Math.random() * 100
        const top = Math.random() * 100

        // Tamaño aleatorio (más pequeño para no distraer demasiado)
        const size = Math.random() * 20 + 10

        // Duración de la animación aleatoria
        const duration = Math.random() * 60 + 30

        // Retraso aleatorio para que no todos empiecen al mismo tiempo
        const delay = Math.random() * 10

        // Opacidad aleatoria (baja para que sea sutil)
        const opacity = Math.random() * 0.2 + 0.05

        // Dirección aleatoria
        const directionX = Math.random() > 0.5 ? 1 : -1
        const directionY = Math.random() > 0.5 ? 1 : -1

        // Distancia de movimiento aleatoria
        const moveX = Math.random() * 20 + 10
        const moveY = Math.random() * 20 + 10

        // Rotación aleatoria
        const rotate = Math.random() * 360
        const rotateSpeed = Math.random() * 20 - 10

        // Colores según el tipo de elemento
        let color = "text-blue-500"
        if (elementType === "zap") {
          color = "text-yellow-500"
        } else if (elementType === "sun") {
          color = "text-orange-500"
        } else if (elementType === "leaf") {
          color = "text-green-500"
        } else if (elementType === "piggy") {
          color = "text-pink-500"
        }

        // Crear elemento según su tipo
        let element
        if (elementType === "panel") {
          element = (
            <div className="solar-panel-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-blue-500"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
          )
        } else if (elementType === "zap") {
          element = <Zap className={`w-full h-full ${color}`} />
        } else if (elementType === "sun") {
          element = <Sun className={`w-full h-full ${color}`} />
        } else if (elementType === "leaf") {
          element = <Leaf className={`w-full h-full ${color}`} />
        } else if (elementType === "piggy") {
          element = <PiggyBank className={`w-full h-full ${color}`} />
        }

        // Añadir elemento con sus propiedades de animación
        newElements.push(
          <div
            key={i}
            className="absolute solar-element"
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `
                moveX ${duration}s linear ${delay}s infinite alternate,
                moveY ${duration * 0.7}s linear ${delay}s infinite alternate,
                rotate ${Math.abs(rotateSpeed)}s linear infinite ${rotateSpeed < 0 ? "reverse" : ""}
              `,
                "--move-x": `${moveX * directionX}px`,
                "--move-y": `${moveY * directionY}px`,
                "--rotate": `${rotate}deg`,
              } as React.CSSProperties
            }
          >
            {element}
          </div>,
        )
      }

      setElements(newElements)
    }

    createElements()

    // Recrear elementos cuando cambie el tamaño de la ventana
    const handleResize = () => {
      createElements()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [numberOfElements])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      {elements}

      {/* Estilos específicos para las animaciones */}
      <style jsx global>{`
        @keyframes moveX {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--move-x, 20px)); }
        }
        
        @keyframes moveY {
          0% { transform: translateY(0); }
          100% { transform: translateY(var(--move-y, 20px)); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(var(--rotate, 360deg)); }
        }
        
        .solar-element {
          will-change: transform;
          transform-origin: center;
        }
        
        /* Combinar las animaciones */
        .solar-element {
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  )
}
