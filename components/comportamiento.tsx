"use client"

import { useState } from "react"
import {
  Brush,
  CheckCircle,
  Cloud,
  Lightbulb,
  Sun,
  Shield,
  BarChartIcon as ChartBar,
  LineChart,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComportamientoProps {
  propuesta: any
  formatNumber: (num: number) => string
  generarDatosProduccionMensual: () => any[]
}

export default function Comportamiento({
  propuesta,
  formatNumber,
  generarDatosProduccionMensual,
}: ComportamientoProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const produccionMensual = generarDatosProduccionMensual()
  const maxProduccion = Math.max(...produccionMensual.map((d) => d.produccion))

  // Añadir esto justo antes del return final
  const barAnimationStyle = `
  @keyframes barAppear {
    0% {
      transform: scaleY(0);
      opacity: 0;
    }
    100% {
      transform: scaleY(1);
      opacity: 1;
    }
  }
  
  .animate-bar-appear {
    animation: barAppear 0.5s ease-out forwards;
    transform-origin: bottom;
  }
`

  return (
    <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
      <style jsx>{barAnimationStyle}</style>
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <span className="bg-yellow-100 p-2 rounded-full">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </span>
          Comportamiento del Sistema
        </CardTitle>
        <p className="text-gray-500">Análisis de producción y factores que afectan el rendimiento</p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Producción Mensual Estimada - Gráfica Mejorada */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Producción Mensual Estimada
            </h3>

            <div className="h-80 w-full">
              <div className="relative h-full w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* Líneas de referencia horizontales */}
                <div className="absolute left-0 right-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-gray-200"></div>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div className="w-full h-px bg-gray-200"></div>
                </div>

                {/* Línea de consumo del usuario */}
                <div
                  className="absolute left-0 right-4 pointer-events-none z-10"
                  style={{
                    top: `${100 - (propuesta.cliente.consumo / maxProduccion) * 100}%`,
                    minTop: "10%",
                    maxTop: "90%",
                  }}
                >
                  <div className="w-full h-0.5 bg-blue-500 border-dashed border-blue-500 flex items-center">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-2 border border-blue-200">
                      Consumo mensual: {formatNumber(propuesta.cliente.consumo)} kWh
                    </div>
                  </div>
                </div>

                {/* Contenedor de barras */}
                <div className="absolute left-4 right-4 top-4 bottom-10 flex items-end justify-between">
                  {produccionMensual.map((dato, index) => {
                    const altura = (dato.produccion / maxProduccion) * 100
                    const isHovered = hoveredBar === index
                    const delay = index * 0.1 // Retraso para animación secuencial

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                        style={{ height: "100%" }}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div className="relative h-full flex items-end">
                          <div
                            className={`w-8 rounded-t-sm transition-all duration-300 animate-bar-appear ${
                              isHovered ? "w-10" : "w-8"
                            }`}
                            style={{
                              height: `${altura}%`,
                              minHeight: "4px",
                              background: `linear-gradient(to top, #F97316, #FDBA74)`,
                              boxShadow: isHovered ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                              animationDelay: `${delay}s`,
                            }}
                          ></div>

                          {/* Tooltip mejorado */}
                          {isHovered && (
                            <div className="absolute bottom-full mb-2 -left-12 w-24 bg-white rounded-md shadow-lg p-2 text-center z-10">
                              <p className="text-xs font-bold text-gray-800">{formatNumber(dato.produccion)} kWh</p>
                              <p className="text-xs text-gray-500">{dato.mes}</p>
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Eje X - Meses */}
                <div className="absolute left-4 right-4 bottom-0 h-10 flex justify-between items-center">
                  {produccionMensual.map((dato, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      {dato.mes}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Producción anual total:{" "}
                  <span className="font-semibold text-orange-600">{formatNumber(propuesta.produccion.anual)} kWh</span>
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h4 className="font-medium text-gray-800 mb-2">Análisis de Producción Mensual</h4>
                <p className="text-sm text-gray-600 mb-3">
                  La gráfica muestra la variación estacional en la producción de energía solar a lo largo del año:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
                    <span>
                      <strong>Meses de alta producción (Feb-Abr):</strong> Durante estos meses, tu sistema generará un
                      excedente significativo de energía que se acreditará a tu cuenta con la compañía eléctrica.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-300 mt-1 flex-shrink-0"></div>
                    <span>
                      <strong>Meses de producción media (May-Oct, Dic-Ene):</strong> En estos meses, la producción se
                      mantiene estable y generalmente cubre tu consumo mensual.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-200 mt-1 flex-shrink-0"></div>
                    <span>
                      <strong>Meses de menor producción (Nov):</strong> Noviembre presenta la menor radiación solar del
                      año, pero gracias al sistema de medición neta, los créditos acumulados durante los meses de alta
                      producción compensarán cualquier déficit.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 mb-2">Informe de Rendimiento IA</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Basado en el análisis de tus datos de consumo ({formatNumber(propuesta.cliente.consumo)} kWh/mes) y
                    la producción estimada de tu sistema solar ({formatNumber(propuesta.produccion.anual)} kWh/año),
                    podemos concluir:
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>
                      Tu sistema está dimensionado para producir aproximadamente{" "}
                      {Math.round((propuesta.produccion.anual / (propuesta.cliente.consumo * 12)) * 100)}% de tu consumo
                      anual total.
                    </li>
                    <li>
                      {propuesta.produccion.anual > propuesta.cliente.consumo * 12
                        ? `Generarás un excedente anual de aproximadamente ${formatNumber(
                            propuesta.produccion.anual - propuesta.cliente.consumo * 12,
                          )} kWh.`
                        : `Necesitarás complementar con aproximadamente ${formatNumber(
                            propuesta.cliente.consumo * 12 - propuesta.produccion.anual,
                          )} kWh de la red eléctrica anualmente.`}
                    </li>
                    <li>
                      El mes de mayor producción (
                      {produccionMensual.reduce(
                        (max, item, i, arr) => (item.produccion > arr[max].produccion ? i : max),
                        0,
                      )}
                      ) genera aproximadamente{" "}
                      {Math.round(
                        (Math.max(...produccionMensual.map((d) => d.produccion)) / propuesta.cliente.consumo) * 100,
                      )}
                      % de tu consumo mensual.
                    </li>
                    <li>
                      El mes de menor producción (
                      {produccionMensual.reduce(
                        (min, item, i, arr) => (item.produccion < arr[min].produccion ? i : min),
                        0,
                      )}
                      ) genera aproximadamente{" "}
                      {Math.round(
                        (Math.min(...produccionMensual.map((d) => d.produccion)) / propuesta.cliente.consumo) * 100,
                      )}
                      % de tu consumo mensual.
                    </li>
                    <li>
                      Con el sistema de medición neta, los excedentes de los meses de alta producción compensarán los
                      déficits de los meses de baja producción, optimizando tu inversión.
                    </li>
                  </ul>
                  <p className="mt-2 italic">
                    Este análisis se ha generado automáticamente basado en los datos específicos de tu propuesta y las
                    condiciones climáticas de tu ubicación.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
                      <div className="absolute w-28 h-28 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <Shield className="h-14 w-14 text-orange-500" />
                      </div>
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">Garantía de Ahorro SolarMente</h4>
                    <p className="text-gray-700 mb-4">
                      En SolarMente te garantizamos el ahorro. Por eso, hemos dimensionado tu sistema de{" "}
                      {propuesta.sistema.tamano} kW para asegurar que obtengas los máximos beneficios de tu inversión
                      solar.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                          <ChartBar className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-600">Dimensionamiento óptimo basado en tu perfil de consumo</p>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                          <LineChart className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-600">Análisis predictivo de variaciones estacionales</p>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                          <ShieldCheck className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-600">Margen de seguridad para garantizar cobertura</p>
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-orange-100 mt-2">
                      <p className="text-sm text-gray-600 italic">
                        "Siempre es recomendable dimensionar un sistema ligeramente mayor para garantizar el ahorro,
                        considerando posibles aumentos en el consumo y variaciones climáticas. Tu sistema de{" "}
                        {propuesta.sistema.tamano} kW está diseñado con este margen de seguridad para maximizar tu
                        retorno de inversión."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nueva sección de Garantía de Ahorro */}
              {/* <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-md">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse opacity-50"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <Shield className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-orange-500">Garantía de Ahorro SolarMente</span>
                    </h3>

                    <p className="text-gray-700 mb-4">
                      En SolarMente te <span className="font-bold text-orange-600">garantizamos el ahorro</span>.
                      Nuestros sistemas están dimensionados estratégicamente para asegurar que obtengas el máximo
                      beneficio de tu inversión solar.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-1 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Dimensionamiento óptimo:</span> Recomendamos sistemas
                          ligeramente más grandes para garantizar que cubras tu consumo incluso en meses de menor
                          producción.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-white p-1 rounded-full">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Análisis predictivo:</span> Nuestros algoritmos analizan
                          patrones de consumo y factores estacionales para asegurar que tu sistema genere suficiente
                          energía durante todo el año.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-white p-1 rounded-full">
                          <Zap className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Margen de seguridad:</span> Incluimos un margen adicional del
                          10-15% para compensar variaciones climáticas inesperadas y posibles aumentos en tu consumo
                          futuro.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                      <p className="text-sm text-gray-700 italic">
                        "Tu sistema de {propuesta.sistema.tamano} kW ha sido diseñado específicamente para garantizar un
                        ahorro sostenido a largo plazo, considerando tu patrón de consumo actual y posibles variaciones
                        futuras."
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Factores que Afectan la Producción */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Factores que Afectan la Producción</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  Estacionalidad
                </h4>
                <p className="text-sm text-gray-600">
                  La producción varía según la época del año, con mayor generación en meses con más horas de sol. En
                  Panamá, los meses de febrero a abril suelen tener mayor producción.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  Clima
                </h4>
                <p className="text-sm text-gray-600">
                  Los días nublados reducen la producción, mientras que los días soleados la maximizan. La producción
                  puede variar hasta un 30% dependiendo de las condiciones climáticas.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Brush className="h-4 w-4 text-green-500" />
                  Mantenimiento
                </h4>
                <p className="text-sm text-gray-600">
                  La limpieza regular de los paneles puede aumentar la eficiencia hasta un 5%. Recomendamos una limpieza
                  cada 3-6 meses dependiendo de las condiciones ambientales.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <h4 className="font-medium text-gray-800 mb-3">Rendimiento Óptimo</h4>
              <p className="text-gray-600 mb-4">
                Tu sistema solar ha sido diseñado para maximizar la producción energética según las condiciones
                específicas de tu ubicación en {propuesta.cliente.direccion}. La orientación e inclinación de los
                paneles se han optimizado para captar la mayor cantidad de radiación solar durante todo el año.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Monitoreo en tiempo real</span> para detectar cualquier anomalía en el
                    rendimiento del sistema.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Mantenimiento preventivo</span> incluido para asegurar el máximo
                    rendimiento durante toda la vida útil del sistema.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativa de Producción */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Comparativa de Producción vs Consumo</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium text-gray-800 mb-2">Producción Anual</h4>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {formatNumber(propuesta.produccion.anual)} kWh
                </div>
                <p className="text-sm text-gray-600">Generación total estimada de tu sistema solar por año</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-2">Consumo Anual</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatNumber(propuesta.cliente.consumo * 12)} kWh
                </div>
                <p className="text-sm text-gray-600">Consumo eléctrico total estimado por año</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Cobertura de consumo</span>
                <span className="text-sm font-bold text-green-600">
                  {Math.min(100, Math.round((propuesta.produccion.anual / (propuesta.cliente.consumo * 12)) * 100))}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((propuesta.produccion.anual / (propuesta.cliente.consumo * 12)) * 100),
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
