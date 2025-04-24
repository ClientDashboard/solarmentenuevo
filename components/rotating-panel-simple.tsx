"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function RotatingPanelSimple() {
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(0)
  const angleRef = useRef<number>(0)

  const animate = () => {
    if (containerRef.current) {
      // Incrementar el ángulo para la rotación continua
      angleRef.current = (angleRef.current + 0.5) % 360

      // Aplicar la rotación
      containerRef.current.style.transform = `rotateY(${angleRef.current}deg)`
    }

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center perspective-1000">
      <div
        ref={containerRef}
        className="relative w-full h-full transform-style-3d"
        style={{ transformOrigin: "center center" }}
      >
        <Image src="/images/panel-front.png" alt="Panel Solar Vista 360" fill className="object-contain p-4" priority />
      </div>
    </div>
  )
}
