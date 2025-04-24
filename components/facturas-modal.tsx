"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface FacturasModalProps {
  isOpen: boolean
  closeModal: () => void
  projectId: string | null
}

export default function FacturasModal({ isOpen, closeModal, projectId }: FacturasModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [facturas, setFacturas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && projectId) {
      // Aquí cargaríamos las facturas desde la base de datos
      // Por ahora, usamos datos de ejemplo
      setLoading(true)

      setTimeout(() => {
        // Datos de ejemplo para DSV
        if (projectId === "dsv") {
          setFacturas([
            {
              mes: "Enero 2023",
              consumo: 28500,
              factura: 5700,
              ahorroKwh: 24225,
              ahorroDinero: 4845,
            },
            {
              mes: "Febrero 2023",
              consumo: 27800,
              factura: 5560,
              ahorroKwh: 23630,
              ahorroDinero: 4726,
            },
            {
              mes: "Marzo 2023",
              consumo: 29200,
              factura: 5840,
              ahorroKwh: 24820,
              ahorroDinero: 4964,
            },
          ])
        } else {
          setFacturas([])
        }
        setLoading(false)
      }, 1000)
    }
  }, [isOpen, projectId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {projectId === "dsv" ? "Resultados de Ahorro - DSV" : "Resultados de Ahorro"}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-3 px-6 font-medium ${activeTab === 0 ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveTab(0)}
                  >
                    Facturas Mensuales
                  </button>
                  <button
                    className={`py-3 px-6 font-medium ${activeTab === 1 ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveTab(1)}
                  >
                    Gráfico de Ahorro
                  </button>
                </div>
              </div>

              {activeTab === 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-gray-500 font-medium">Mes</th>
                        <th className="py-3 px-4 text-gray-500 font-medium">Consumo (kWh)</th>
                        <th className="py-3 px-4 text-gray-500 font-medium">Factura ($)</th>
                        <th className="py-3 px-4 text-gray-500 font-medium">Ahorro (kWh)</th>
                        <th className="py-3 px-4 text-gray-500 font-medium">Ahorro ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facturas.map((factura, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-4 px-4 text-gray-800">{factura.mes}</td>
                          <td className="py-4 px-4 text-gray-800">{factura.consumo.toLocaleString()}</td>
                          <td className="py-4 px-4 text-gray-800">${factura.factura.toLocaleString()}</td>
                          <td className="py-4 px-4 text-green-500">{factura.ahorroKwh.toLocaleString()}</td>
                          <td className="py-4 px-4 text-green-500">${factura.ahorroDinero.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-500 mb-4">Gráfico de ahorro mensual</div>
                    <div className="flex items-end justify-center h-40 space-x-4">
                      {facturas.map((factura, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="flex space-x-1">
                            <div
                              className="w-8 bg-gray-300 rounded-t-sm"
                              style={{ height: `${(factura.consumo - factura.ahorroKwh) / 300}px` }}
                            ></div>
                            <div
                              className="w-8 bg-orange-500 rounded-t-sm"
                              style={{ height: `${factura.ahorroKwh / 300}px` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{factura.mes.split(" ")[0].substring(0, 3)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-6 space-x-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Ahorro</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                        <span className="text-sm text-gray-600">Consumo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Ahorro</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Ahorro Total</div>
                    <div className="text-2xl font-bold text-green-500">
                      ${facturas.reduce((sum, factura) => sum + factura.ahorroDinero, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Ahorro Promedio Mensual</div>
                    <div className="text-2xl font-bold text-green-500">
                      $
                      {(
                        facturas.reduce((sum, factura) => sum + factura.ahorroDinero, 0) / facturas.length
                      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Reducción de CO₂</div>
                    <div className="text-2xl font-bold text-green-500">
                      {(facturas.reduce((sum, factura) => sum + factura.ahorroKwh, 0) * 0.0005).toLocaleString()} ton
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
