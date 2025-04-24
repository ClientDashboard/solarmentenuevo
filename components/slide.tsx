import type React from "react"

interface SlideProps {
  className?: string
  children: React.ReactNode
}

export default function Slide({ className = "", children }: SlideProps) {
  return (
    <section id="proyectos" className={`py-24 relative ${className}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}
