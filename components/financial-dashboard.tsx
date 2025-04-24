"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Calendar, DollarSign, Zap } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

// Constantes para cálculos solares
const MONTHLY_IRRADIANCE = [
  5.37, // Enero
  5.85, // Febrero
  6.22, // Marzo
  5.8, // Abril
  4.71, // Mayo
  4.4, // Junio
  4.24, // Julio
  4.43, // Agosto
  4.62, // Septiembre
  4.31, // Octubre
  3.95, // Noviembre
  4.39, // Diciembre
]
const SYSTEM_EFFICIENCY = 0.85 // Factor que considera pérdidas del sistema
const DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

interface FinancialDashboardProps {
  annualSavings: number
  monthlyConsumption: number
  electricityRate: number
  totalYears: number
  formatNumber: (num: number) => string
  systemSizeKW?: number // Añadir tamaño del sistema en kW
}

export default function FinancialDashboard({
  annualSavings,
  monthlyConsumption,
  electricityRate = 0.26, // Valor por defecto
  totalYears = 25,
  formatNumber,
  systemSizeKW = 10, // Valor por defecto de 10kW si no se proporciona
}: FinancialDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Intersection observer para activar animaciones cuando el componente es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current)
    }

    return () => {
      if (dashboardRef.current) {
        observer.unobserve(dashboardRef.current)
      }
    }
  }, [])

  // Generar datos para el gráfico de ahorros mensuales y producción
  const generateMonthlySavingsData = () => {
    const monthlySavings = annualSavings / 12
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Calcular producción mensual basada en irradiancia si tenemos el tamaño del sistema
    const systemSize = systemSizeKW || 0

    // Calculamos la producción diaria promedio por mes basada en la irradiancia
    const produccionesDiarias = MONTHLY_IRRADIANCE.map((irradiancia) => systemSize * irradiancia * SYSTEM_EFFICIENCY)

    // Calculamos la producción mensual (días de cada mes * producción diaria)
    const produccionesMensuales = produccionesDiarias.map((prod, i) => Math.round(prod * DIAS_POR_MES[i]))

    return months.map((month, index) => ({
      name: month,
      ahorro: Math.round(monthlySavings * (MONTHLY_IRRADIANCE[index] / 5)), // Ajustar ahorro según irradiancia
      produccion: produccionesMensuales[index], // Añadir producción mensual en kWh
      factor: MONTHLY_IRRADIANCE[index] / Math.max(...MONTHLY_IRRADIANCE), // Factor normalizado para visualización
    }))
  }

  // Generar datos para el gráfico de proyección de ahorros con aumento de tarifas
  const generateSavingsProjectionData = () => {
    const data = []
    const annualRateIncrease = 0.03 // 3% de aumento anual en tarifas

    for (let year = 1; year <= totalYears; year++) {
      // Calcular el ahorro considerando el aumento de tarifas
      const savingsWithIncrease = annualSavings * Math.pow(1 + annualRateIncrease, year - 1)

      data.push({
        year: year,
        ahorro: Math.round(savingsWithIncrease),
        ahorroAcumulado:
          year === 1
            ? Math.round(savingsWithIncrease)
            : Math.round(data[year - 2].ahorroAcumulado + savingsWithIncrease),
      })
    }

    return data
  }

  // Generar datos para el gráfico de distribución de costos vs ahorros
  const generateCostSavingsDistributionData = () => {
    const monthlyConsumptionKWh = monthlyConsumption
    const monthlyBillWithoutSolar = monthlyConsumptionKWh * electricityRate
    const annualBillWithoutSolar = monthlyBillWithoutSolar * 12
    const monthlySavings = annualSavings / 12

    // Porcentaje de ahorro
    const savingsPercentage = Math.min(100, Math.round((monthlySavings / monthlyBillWithoutSolar) * 100))
    const remainingPercentage = 100 - savingsPercentage

    return [
      { name: "Ahorro", value: savingsPercentage },
      { name: "Costo Restante", value: remainingPercentage },
    ]
  }

  const monthlySavingsData = generateMonthlySavingsData()
  const savingsProjectionData = generateSavingsProjectionData()
  const costSavingsDistributionData = generateCostSavingsDistributionData()

  // Colores para los gráficos
  const COLORS = ["#10B981", "#F97316", "#3B82F6", "#8B5CF6"]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm" ref={dashboardRef}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Dashboard Financiero
        </h3>
        <p className="text-sm text-gray-600 mt-1">Análisis detallado de tus ahorros y beneficios financieros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Tarjeta de Ahorro Mensual Promedio */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-800">Ahorro Mensual Promedio</h4>
          </div>
          <div className="text-3xl font-bold text-green-600 mt-2">${formatNumber(Math.round(annualSavings / 12))}</div>
          <div className="text-sm text-gray-600 mt-1">por mes</div>
          <div className="mt-auto pt-4">
            <div className="text-xs text-gray-500">Variación estacional</div>
            <div className="h-8 mt-1 flex items-end">
              {monthlySavingsData.map((entry, index) => (
                <div
                  key={index}
                  className="flex-1 bg-green-500 mx-0.5 rounded-t"
                  style={{
                    height: `${entry.factor * 100}%`,
                    opacity: 0.6 + entry.factor * 0.4,
                  }}
                  title={`${entry.name}: $${formatNumber(entry.ahorro)}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Ene</span>
              <span>Jun</span>
              <span>Dic</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Ahorro Total en 25 Años */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-800">Ahorro Total en 25 Años</h4>
          </div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            ${formatNumber(savingsProjectionData[totalYears - 1].ahorroAcumulado)}
          </div>
          <div className="text-sm text-gray-600 mt-1">ahorro acumulado</div>
          <div className="mt-auto pt-4">
            <div className="text-xs text-gray-500">Proyección con aumento de tarifas</div>
            <div className="h-8 mt-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-500 rounded"></div>
              <div className="absolute inset-0 flex items-center justify-around">
                {[5, 10, 15, 20, 25].map((year) => (
                  <div key={year} className="h-full flex flex-col items-center justify-between py-1">
                    <div className="w-px h-2 bg-white/50"></div>
                    <div className="text-[10px] text-white font-medium">{year}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Año 1</span>
              <span>Año 25</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Distribución de Costos */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-gray-800">Reducción de Factura</h4>
          </div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{costSavingsDistributionData[0].value}%</div>
          <div className="text-sm text-gray-600 mt-1">de tu factura actual</div>
          <div className="mt-auto pt-4 flex justify-center">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${costSavingsDistributionData[0].value}, 100`}
                  className={isVisible ? "animate-progress" : ""}
                  style={{
                    strokeDashoffset: isVisible ? "0" : "100",
                    transition: "stroke-dashoffset 2s ease-out",
                  }}
                />
                <text x="18" y="20.5" className="text-[5px] font-bold text-center" textAnchor="middle">
                  {costSavingsDistributionData[0].value}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Ahorros Mensuales */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-800 mb-4">Producción Mensual Estimada</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySavingsData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value} kWh`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "produccion") return [`${formatNumber(Number(value))} kWh`, "Producción"]
                    return [`$${formatNumber(Number(value))}`, "Ahorro"]
                  }}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="produccion"
                  name="Producción Mensual"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                  animationDuration={2000}
                  animationBegin={isVisible ? 0 : 9999}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <span className="font-medium">Producción anual estimada: </span>
            <span className="text-orange-600 font-semibold">
              {formatNumber(monthlySavingsData.reduce((sum, item) => sum + item.produccion, 0))} kWh
            </span>
          </div>
        </div>

        {/* Gráfico de Proyección de Ahorros */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-800 mb-4">Proyección de Ahorros a 25 Años</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={savingsProjectionData.filter((_, i) => i % 5 === 0 || i === savingsProjectionData.length - 1)}
                margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Años", position: "insideBottom", offset: -15 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                />
                <Tooltip
                  formatter={(value) => [`$${formatNumber(Number(value))}`, "Ahorro"]}
                  labelFormatter={(label) => `Año ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ahorroAcumulado"
                  name="Ahorro Acumulado"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3B82F6" }}
                  activeDot={{ r: 6 }}
                  animationDuration={2000}
                  animationBegin={isVisible ? 0 : 9999}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sección de Beneficios Financieros */}
      <div className="p-6 pt-0">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-4">Beneficios Financieros Adicionales</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <h5 className="font-medium text-gray-800">Valorización de Propiedad</h5>
              </div>
              <p className="text-sm text-gray-600">
                Los sistemas solares pueden aumentar el valor de tu propiedad hasta un 4.1% según estudios recientes.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <h5 className="font-medium text-gray-800">Protección contra Inflación</h5>
              </div>
              <p className="text-sm text-gray-600">
                Te proteges contra futuros aumentos en las tarifas eléctricas, que históricamente suben un 3-5% anual.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
