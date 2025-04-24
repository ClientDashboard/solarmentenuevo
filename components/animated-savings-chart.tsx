// "use client"

import { useEffect, useRef, useState } from "react"
import { BarChart3 } from "lucide-react"

interface AnimatedSavingsChartProps {
  totalInvestment: number
  annualSavings: number
  totalYears: number
  roiYears: number
  formatNumber: (num: number) => string
}

export default function AnimatedSavingsChart({
  totalInvestment,
  annualSavings,
  totalYears = 25,
  roiYears,
  formatNumber,
}: AnimatedSavingsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [showBreakeven, setShowBreakeven] = useState(false)

  // Generate savings data
  const generateSavingsData = () => {
    const data = []
    let accumulated = 0

    for (let i = 1; i <= totalYears; i++) {
      // Consider 3% annual increase in electricity costs
      const yearSavings = annualSavings * Math.pow(1.03, i - 1)
      accumulated += yearSavings

      data.push({
        year: i,
        savings: Math.round(yearSavings),
        accumulatedSavings: Math.round(accumulated),
      })
    }
    return data
  }

  const savingsData = generateSavingsData()
  const totalSavings = savingsData[totalYears - 1].accumulatedSavings

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
      const duration = 2000 // 2 seconds

      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        const progress = Math.min(elapsed / duration, 1)

        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Show breakeven point after line animation completes
          setTimeout(() => {
            setShowBreakeven(true)
          }, 500)
        }
      }

      requestAnimationFrame(animate)
    }

    return () => {
      setAnimationProgress(0)
      setShowBreakeven(false)
    }
  }, [isVisible])

  // Find breakeven point (ROI)
  const breakevenPoint = savingsData.findIndex((d) => d.accumulatedSavings >= totalInvestment)
  const breakevenYear = breakevenPoint !== -1 ? savingsData[breakevenPoint].year : roiYears

  // Calculate position for breakeven point
  const breakevenX = (breakevenYear / totalYears) * 100
  const breakevenY = 100 - (totalInvestment / totalSavings) * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" ref={chartRef}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-500" />
        Ahorro Acumulado vs. Inversión
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <p className="text-sm text-gray-600">
          Este gráfico muestra cómo tu ahorro acumulado supera la inversión inicial a lo largo del tiempo. El punto de
          equilibrio se alcanza en el año {breakevenYear.toFixed(1)}, momento en el que recuperas completamente tu
          inversión y comienzas a generar beneficios netos.
        </p>
      </div>

      <div className="h-80 w-full">
        <div className="relative h-64 w-full border-b border-l border-gray-300 bg-white">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((pos) => (
              <div
                key={`h-${pos}`}
                className="absolute border-t border-gray-100"
                style={{ top: `${pos}%`, width: "100%" }}
              />
            ))}
            {[0, 25, 50, 75, 100].map((pos) => (
              <div
                key={`v-${pos}`}
                className="absolute border-l border-gray-100"
                style={{ left: `${pos}%`, height: "100%" }}
              />
            ))}
          </div>

          {/* Investment line */}
          <div
            className="absolute left-0 border-t-2 border-dashed border-orange-500 w-full z-10"
            style={{
              top: `${100 - (totalInvestment / totalSavings) * 100}%`,
            }}
          >
            <div className="absolute -top-6 right-0 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Inversión: ${formatNumber(totalInvestment)}
            </div>
          </div>

          {/* Savings area */}
          <div className="absolute inset-0 overflow-hidden">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
                <clipPath id="animationClip">
                  <rect x="0" y="0" width={`${animationProgress * 100}%`} height="100%" />
                </clipPath>
              </defs>

              {/* Filled area with animation */}
              <g clipPath="url(#animationClip)">
                <path
                  d={`M0,${100} 
                    ${savingsData
                      .map(
                        (d, i) =>
                          `L${(i / (savingsData.length - 1)) * 100},${100 - (d.accumulatedSavings / totalSavings) * 100}`,
                      )
                      .join(" ")} 
                  L100,100 Z`}
                  fill="url(#areaGradient)"
                />
              </g>

              {/* Line with animation */}
              <g clipPath="url(#animationClip)">
                <path
                  d={`M0,${100} 
                    ${savingsData
                      .map(
                        (d, i) =>
                          `L${(i / (savingsData.length - 1)) * 100},${100 - (d.accumulatedSavings / totalSavings) * 100}`,
                      )
                      .join(" ")}`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
              </g>
            </svg>
          </div>

          {/* Breakeven point with animation */}
          {showBreakeven && (
            <div
              className="absolute z-20"
              style={{
                left: `${breakevenX}%`,
                top: `${breakevenY}%`,
              }}
            >
              <div className="w-4 h-4 bg-green-500 rounded-full transform -translate-x-2 -translate-y-2 animate-ping absolute opacity-75"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full transform -translate-x-2 -translate-y-2 relative"></div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                Punto de equilibrio: Año {breakevenYear.toFixed(1)}
              </div>
            </div>
          )}

          {/* Year markers */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
            {[1, Math.round(totalYears / 2), totalYears].map((year) => (
              <div key={year} className="relative">
                <div
                  className="absolute bottom-0 transform translate-x-[-50%]"
                  style={{ left: `${(year / totalYears) * 100}%` }}
                >
                  Año {year}
                </div>
              </div>
            ))}
          </div>

          {/* Amount markers */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <div className="transform -translate-y-2">$0</div>
            <div className="transform -translate-y-2">${formatNumber(Math.round(totalSavings / 2))}</div>
            <div className="transform -translate-y-2">${formatNumber(totalSavings)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Ahorro acumulado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Inversión inicial</span>
        </div>
        <div className="font-medium text-green-600">Retorno de inversión: {roiYears} años</div>
      </div>
    </div>
  )
}
