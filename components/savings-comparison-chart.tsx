"use client"

import { useEffect, useRef, useState } from "react"
import { DollarSign } from "lucide-react"

interface SavingsComparisonChartProps {
  totalInvestment: number
  annualSavings: number
  totalYears: number
  formatNumber: (num: number) => string
}

export default function SavingsComparisonChart({
  totalInvestment,
  annualSavings,
  totalYears = 25,
  formatNumber,
}: SavingsComparisonChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  const totalSavingsWithoutSolar = annualSavings * totalYears
  const totalSavingsWithSolar = totalSavingsWithoutSolar - totalInvestment
  const savingsPercentage = Math.round(100 - (totalInvestment / totalSavingsWithoutSolar) * 100)

  // Intersection observer to trigger animation when chart is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current)
      }
    }
  }, [])

  // Animation effect
  useEffect(() => {
    if (isVisible) {
      let start: number | null = null
      const duration = 1500 // 1.5 seconds

      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        const progress = Math.min(elapsed / duration, 1)

        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    return () => {
      setAnimationProgress(0)
    }
  }, [isVisible])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" ref={chartRef}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        Comparativa de Costos a 25 Años
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <p className="text-sm text-gray-600">
          Esta comparativa muestra el costo total de la electricidad durante 25 años con y sin paneles solares. La
          diferencia representa tu ahorro neto después de descontar la inversión inicial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Animated donut chart */}
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#F77F00" strokeWidth="10" />

              {/* Animated progress */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth="10"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 * (1 - (animationProgress * savingsPercentage) / 100)}
                transform="rotate(-90 50 50)"
              />

              {/* Text in the middle */}
              <text
                x="50"
                y="45"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#374151"
                opacity={animationProgress}
              >
                Ahorro
              </text>
              <text
                x="50"
                y="60"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#374151"
                opacity={animationProgress}
              >
                {Math.round(animationProgress * savingsPercentage)}%
              </text>
            </svg>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 mt-1 rounded-full bg-orange-500 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Con Paneles Solares</p>
                <p className="text-sm text-gray-600 mb-1">Inversión única que genera energía por décadas</p>
                <p className="text-xl font-bold text-orange-600">${formatNumber(totalInvestment)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-4 h-4 mt-1 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">Sin Paneles Solares</p>
                <p className="text-sm text-gray-600 mb-1">Pagos mensuales a la compañía eléctrica por 25 años</p>
                <p className="text-xl font-bold text-blue-600">${formatNumber(totalSavingsWithoutSolar)}</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">Ahorro total en 25 años:</p>
              <div className="relative">
                <p className="text-2xl font-bold text-green-600 opacity-0">${formatNumber(totalSavingsWithSolar)}</p>
                <p
                  className="text-2xl font-bold text-green-600 absolute top-0 left-0"
                  style={{
                    opacity: animationProgress,
                    transform: `translateY(${(1 - animationProgress) * 20}px)`,
                  }}
                >
                  ${formatNumber(Math.round(totalSavingsWithSolar * animationProgress))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
