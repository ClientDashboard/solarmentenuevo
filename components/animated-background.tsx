"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  className?: string
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear partículas
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 30))

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25

        // Colores solares: naranja, amarillo, dorado
        const colors = ["rgba(247, 127, 0, ", "rgba(255, 191, 0, ", "rgba(252, 211, 77, "]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Rebote en los bordes
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color + this.opacity + ")"
        ctx.fill()
      }
    }

    // Inicializar partículas
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Dibujar líneas entre partículas cercanas
    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = 1 - distance / 100
            ctx.strokeStyle = `rgba(247, 127, 0, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Crear gradientes animados
    let hue = 0
    function drawGradients() {
      // Gradiente radial que se mueve
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(hue * 0.01) * 100,
        canvas.height * 0.3 + Math.cos(hue * 0.01) * 100,
        0,
        canvas.width * 0.3 + Math.sin(hue * 0.01) * 100,
        canvas.height * 0.3 + Math.cos(hue * 0.01) * 100,
        canvas.width * 0.4,
      )

      gradient1.addColorStop(0, "rgba(247, 127, 0, 0.05)")
      gradient1.addColorStop(0.5, "rgba(247, 127, 0, 0.02)")
      gradient1.addColorStop(1, "rgba(247, 127, 0, 0)")

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Segundo gradiente
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(hue * 0.01) * 100,
        canvas.height * 0.7 + Math.sin(hue * 0.01) * 100,
        0,
        canvas.width * 0.7 + Math.cos(hue * 0.01) * 100,
        canvas.height * 0.7 + Math.sin(hue * 0.01) * 100,
        canvas.width * 0.3,
      )

      gradient2.addColorStop(0, "rgba(59, 130, 246, 0.05)")
      gradient2.addColorStop(0.5, "rgba(59, 130, 246, 0.02)")
      gradient2.addColorStop(1, "rgba(59, 130, 246, 0)")

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      hue += 0.5
    }

    // Función de animación
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar gradientes
      drawGradients()

      // Actualizar y dibujar partículas
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Conectar partículas
      connectParticles()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
