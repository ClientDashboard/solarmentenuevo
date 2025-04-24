"use client"

import { Award, BarChart3, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface FinancieroProps {
  propuesta: any
  formatNumber: (num: number) => string
  currentCount: number
  generarDatosProyeccionAhorro: () => any[]
}

export default function Financiero({
  propuesta,
  formatNumber,
  currentCount,
  generarDatosProyeccionAhorro,
}: FinancieroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calcular el punto de equilibrio (ROI)
  const datosProyeccion = generarDatosProyeccionAhorro()
  const breakevenPoint = datosProyeccion.findIndex((d) => d.ahorroAcumulado >= propuesta.precios.plan1.total)
  const breakevenYear = breakevenPoint !== -1 ? datosProyeccion[breakevenPoint].año : propuesta.sistema.roi

  return (
    <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <span className="bg-green-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-green-500" />
          </span>
          Análisis Financiero
        </CardTitle>
        <p className="text-gray-500">Tu inversión solar: más que un gasto, una decisión financiera inteligente</p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Nueva sección: Tu Inversión Solar */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Inversión Solar: Más que un Gasto</h3>
            <p className="text-gray-700 mb-6">
              Instalar paneles solares no es un gasto, es una{" "}
              <span className="font-semibold text-green-700">inversión segura</span> con retornos predecibles y
              garantizados. A diferencia de otras inversiones, la energía solar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Retorno Garantizado</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Genera ahorros desde el primer día con un retorno de inversión en {propuesta.sistema.roi} años.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Protección Inflacionaria</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Te protege contra futuros aumentos en las tarifas eléctricas, que suben 3-5% anualmente.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Valor Patrimonial</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Aumenta el valor de tu propiedad hasta un 4.1% según estudios recientes.
                </p>
              </div>
            </div>
          </div>

          {/* Comparativa de Inversiones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Comparativa de Inversiones (25 años)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      Tipo de Inversión
                    </th>
                    <th className="text-center py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      Inversión Inicial
                    </th>
                    <th className="text-center py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      Retorno a 25 años
                    </th>
                    <th className="text-center py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      Rendimiento
                    </th>
                    <th className="text-center py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      Riesgo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 font-medium text-green-600">Sistema Solar</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      ${formatNumber(propuesta.precios.plan1.total)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-bold text-green-600">
                      ${formatNumber(propuesta.financiero.ahorro25Anos)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-bold text-green-600">
                      {Math.round((propuesta.financiero.ahorro25Anos / propuesta.precios.plan1.total - 1) * 100)}%
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center text-green-600">Muy Bajo</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Depósito a Plazo Fijo</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      ${formatNumber(propuesta.precios.plan1.total)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      ${formatNumber(Math.round(propuesta.precios.plan1.total * Math.pow(1.03, 25)))}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">110%</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">Bajo</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Mercado de Valores</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      ${formatNumber(propuesta.precios.plan1.total)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      ${formatNumber(Math.round(propuesta.precios.plan1.total * Math.pow(1.07, 25)))}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">480%</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">Alto</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
              <p>
                <span className="font-semibold">Nota:</span> La energía solar ofrece un retorno garantizado y
                predecible, a diferencia de otras inversiones que pueden fluctuar con el mercado. Además, los ahorros
                solares están exentos de impuestos, lo que aumenta aún más su rentabilidad efectiva.
              </p>
            </div>
          </div>

          {/* Ahorro Anual Proyectado - Versión Mejorada */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Ahorro Anual Proyectado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Ahorro estimado en el primer año:</p>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${formatNumber(propuesta.financiero.ahorroAnual)}
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-green-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: isVisible ? "100%" : "0%",
                        transition: "width 1.5s ease-out",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Ahorro mensual promedio:</p>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${formatNumber(propuesta.financiero.ahorroMensual)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: isVisible ? "100%" : "0%",
                        transition: "width 1.5s ease-out 0.3s",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    ${formatNumber(Math.round(propuesta.financiero.ahorroMensual * 12))} anual
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Ahorro en 25 años</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ${formatNumber(propuesta.financiero.ahorro25Anos)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{
                    width: isVisible ? "100%" : "0%",
                    transition: "width 2s ease-out 0.6s",
                  }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-right">
                {Math.round((propuesta.financiero.ahorro25Anos / propuesta.precios.plan1.total) * 100)}× tu inversión
                inicial
              </div>
            </div>
          </div>

          {/* Resumen de Ahorro Total */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de Ahorro Total a 25 Años</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Inversión Inicial</h4>
                  <span className="text-xl font-bold text-gray-800">
                    ${formatNumber(propuesta.precios.plan1.total)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${(propuesta.precios.plan1.total / propuesta.financiero.ahorro25Anos) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Ahorro Total (25 años)</h4>
                  <span className="text-xl font-bold text-green-600">
                    ${formatNumber(propuesta.financiero.ahorro25Anos)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Beneficio Neto</h4>
                <span className="text-2xl font-bold text-green-600">
                  ${formatNumber(propuesta.financiero.ahorro25Anos - propuesta.precios.plan1.total)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Tu sistema solar no solo pagará su costo inicial, sino que generará un beneficio neto de{" "}
                <span className="font-semibold text-green-600">
                  ${formatNumber(propuesta.financiero.ahorro25Anos - propuesta.precios.plan1.total)}
                </span>{" "}
                durante sus primeros 25 años de vida útil.
              </p>
            </div>
          </div>

          {/* Proyección de Ahorro a 25 Años */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Proyección de Ahorro a 25 Años</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-500 font-medium">Año</th>
                    <th className="py-3 px-4 text-gray-500 font-medium">Ahorro Anual</th>
                    <th className="py-3 px-4 text-gray-500 font-medium">Ahorro Acumulado</th>
                    <th className="py-3 px-4 text-gray-500 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {generarDatosProyeccionAhorro().map((dato, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${dato.año === breakevenYear ? "bg-green-50" : ""}`}
                    >
                      <td className="py-3 px-4 text-gray-800">{dato.año}</td>
                      <td className="py-3 px-4 text-green-600">${formatNumber(dato.ahorro)}</td>
                      <td className="py-3 px-4 text-green-600">${formatNumber(dato.ahorroAcumulado)}</td>
                      <td className="py-3 px-4">
                        {dato.ahorroAcumulado >= propuesta.precios.plan1.total ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Beneficio
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Recuperando
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
