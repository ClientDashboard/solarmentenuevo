"use client"

import { useEffect, useRef } from "react"

interface SolarPanelsBackgroundProps {
  className?: string
  density?: number // Controla la densidad de paneles (1-10)
}

export default function SolarPanelsBackground({ className = "", density = 5 }: SolarPanelsBackgroundProps) {
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

    // Número de paneles basado en la densidad y tamaño de pantalla
    const panelCount = Math.floor((canvas.width * canvas.height) / (50000 / density))

    // Clase para los paneles solares
    class SolarPanel {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
      opacity: number
      type: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 15 + 10
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.opacity = Math.random() * 0.2 + 0.05

        // Diferentes tipos de elementos
        const types = ["panel", "zap", "sun", "leaf", "piggy"]
        this.type = types[Math.floor(Math.random() * types.length)]
      }

      update() {
        // Mover el panel
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        // Dibujar según el tipo
        if (this.type === "panel") {
          this.drawPanel()
        } else if (this.type === "zap") {
          this.drawZap()
        } else if (this.type === "sun") {
          this.drawSun()
        } else if (this.type === "leaf") {
          this.drawLeaf()
        } else if (this.type === "piggy") {
          this.drawPiggy()
        }

        ctx.restore()
      }

      drawPanel() {
        const s = this.size
        ctx.strokeStyle = "rgba(59, 130, 246, 0.8)" // Azul para paneles
        ctx.lineWidth = 1

        // Dibujar marco del panel
        ctx.strokeRect(-s / 2, -s / 2, s, s)

        // Dibujar celdas del panel
        ctx.beginPath()
        ctx.moveTo(-s / 2, -s / 6)
        ctx.lineTo(s / 2, -s / 6)
        ctx.moveTo(-s / 2, s / 6)
        ctx.lineTo(s / 2, s / 6)
        ctx.moveTo(-s / 6, -s / 2)
        ctx.lineTo(-s / 6, s / 2)
        ctx.moveTo(s / 6, -s / 2)
        ctx.lineTo(s / 6, s / 2)
        ctx.stroke()
      }

      drawZap() {
        const s = this.size
        ctx.strokeStyle = "rgba(245, 158, 11, 0.8)" // Amarillo para rayos
        ctx.lineWidth = 1.5

        // Dibujar rayo
        ctx.beginPath()
        ctx.moveTo(0, -s / 2)
        ctx.lineTo(s / 4, 0)
        ctx.lineTo(-s / 4, 0)
        ctx.lineTo(0, s / 2)
        ctx.stroke()
      }

      drawSun() {
        const s = this.size
        ctx.strokeStyle = "rgba(249, 115, 22, 0.8)" // Naranja para el sol
        ctx.lineWidth = 1.5

        // Dibujar círculo del sol
        ctx.beginPath()
        ctx.arc(0, 0, s / 3, 0, Math.PI * 2)

        // Dibujar rayos
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4
          const x1 = (s / 3) * Math.cos(angle)
          const y1 = (s / 3) * Math.sin(angle)
          const x2 = (s / 2) * Math.cos(angle)
          const y2 = (s / 2) * Math.sin(angle)

          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
        }

        ctx.stroke()
      }

      drawLeaf() {
        const s = this.size
        ctx.strokeStyle = "rgba(16, 185, 129, 0.8)" // Verde para hojas
        ctx.lineWidth = 1.5

        // Dibujar hoja
        ctx.beginPath()
        ctx.moveTo(0, -s / 2)
        ctx.bezierCurveTo(s / 2, -s / 3, s / 2, s / 3, 0, s / 2)
        ctx.bezierCurveTo(-s / 2, s / 3, -s / 2, -s / 3, 0, -s / 2)
        ctx.moveTo(0, -s / 2)
        ctx.lineTo(0, s / 2)
        ctx.stroke()
      }

      drawPiggy() {
        const s = this.size
        ctx.strokeStyle = "rgba(236, 72, 153, 0.8)" // Rosa para el cerdito
        ctx.lineWidth = 1.5

        // Dibujar cuerpo del cerdito (simplificado)
        ctx.beginPath()
        ctx.ellipse(0, 0, s / 2, s / 3, 0, 0, Math.PI * 2) // Cuerpo
        ctx.moveTo(s / 2 - s / 8, -s / 6)
        ctx.arc(s / 2, -s / 6, s / 8, 0, Math.PI * 2) // Cabeza
        ctx.moveTo(s / 2 + s / 6, -s / 6)
        ctx.arc(s / 2 + s / 8, -s / 6, s / 16, 0, Math.PI * 2) // Nariz
        ctx.moveTo(-s / 3, s / 4)
        ctx.lineTo(-s / 3, s / 2) // Pata trasera
        ctx.moveTo(-s / 6, s / 4)
        ctx.lineTo(-s / 6, s / 2) // Pata trasera
        ctx.moveTo(s / 6, s / 4)
        ctx.lineTo(s / 6, s / 2) // Pata delantera
        ctx.moveTo(s / 3, s / 4)
        ctx.lineTo(s / 3, s / 2) // Pata delantera
        ctx.stroke()
      }
    }

    // Crear array de paneles
    const panels: SolarPanel[] = []
    for (let i = 0; i < panelCount; i++) {
      panels.push(new SolarPanel())
    }

    // Función de animación
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar cada panel
      panels.forEach((panel) => {
        panel.update()
        panel.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
