"use client"

import { useState, useEffect } from "react"
import { Sparkles, FileText, User, Calendar, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import FacturaModal from "./factura-modal"

interface SavingsShowcaseProps {
  formatNumber: (num: number) => string
}

export default function SavingsShowcase({ formatNumber }: SavingsShowcaseProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedCards, setAnimatedCards] = useState([false, false, false])
  const [showFacturaModal, setShowFacturaModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{ name: string; nac: string; clientId: string } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)

          // Animate cards sequentially
          setTimeout(() => setAnimatedCards([true, false, false]), 300)
          setTimeout(() => setAnimatedCards([true, true, false]), 600)
          setTimeout(() => setAnimatedCards([true, true, true]), 900)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("savings-showcase")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  // Client data
  const clients = [
    {
      name: "ALMACENADORA MERCANTIL, S.A.",
      nac: "21197371",
      date: "12 de Marzo de 2025",
      before: 3442.97,
      after: 543.75,
      history: [
        { date: "06/03/2025", kwh: 0 },
        { date: "04/02/2025", kwh: 350 },
        { date: "04/01/2025", kwh: 17150 },
        { date: "05/12/2024", kwh: 18550 },
        { date: "05/11/2024", kwh: 20650 },
        { date: "05/10/2024", kwh: 22950 },
        { date: "05/09/2024", kwh: 23100 },
      ],
      note: "Se paga por demanda solamente. Consumo vino en $0",
      clientId: "almacenadora",
    },
    {
      name: "VALLADARES INTERNACIONAL, S.A.",
      nac: "21439939",
      date: "31 de Marzo de 2025",
      before: 2016.16,
      after: -1098.32,
      history: [
        { date: "28/03/2025", kwh: 0 },
        { date: "23/02/2025", kwh: 6240 },
        { date: "25/01/2025", kwh: 7080 },
        { date: "25/12/2024", kwh: 7920 },
      ],
      note: "Total a pagar",
      clientId: "valladares",
    },
    {
      name: "G4 MANAGEMENT, S.A.",
      nac: "21353226",
      date: "30 de Marzo de 2025",
      before: 875.32,
      after: -19.09,
      history: [
        { date: "27/03/2025", kwh: 0 },
        { date: "25/02/2025", kwh: 1306 },
        { date: "28/01/2025", kwh: 1576 },
        { date: "28/12/2024", kwh: 1593 },
        { date: "27/11/2024", kwh: 1439 },
        { date: "28/10/2024", kwh: 1602 },
        { date: "27/09/2024", kwh: 1611 },
      ],
      note: "Total a pagar",
      clientId: "g4",
    },
  ]

  const openFacturaModal = (client: { name: string; nac: string; clientId: string }) => {
    setSelectedClient(client)
    setShowFacturaModal(true)
  }

  const closeFacturaModal = () => {
    setShowFacturaModal(false)
    setSelectedClient(null)
  }

  return (
    <section id="savings-showcase" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div
            className={`inline-flex items-center bg-orange-50 px-4 py-1 rounded-full border border-orange-100 mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4"
            }`}
          >
            <Sparkles className="h-4 w-4 text-orange-500 mr-2 animate-pulse" />
            <span className="text-sm text-orange-800 font-medium">RESULTADOS REALES</span>
          </div>

          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4"
            }`}
          >
            <span className="text-gray-800">AHORRO</span>{" "}
            <span className="text-orange-500 relative">
              100% REAL
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-orange-500 rounded-full animate-pulse"></span>
            </span>
          </h2>

          <div
            className={`w-24 h-1 bg-orange-500 rounded-full mb-6 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 transform scale-x-100" : "opacity-0 transform scale-x-0"
            }`}
          ></div>

          <p
            className={`text-center text-gray-600 max-w-2xl transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            Gracias a nuestros sistemas solares optimizados por IA, estos clientes han logrado ahorros significativos e
            incluso reciben crédito en su factura eléctrica. Mira los resultados reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {clients.map((client, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-700 transform ${
                animatedCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } hover:shadow-xl hover:border-orange-200 flex flex-col h-full`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Client header */}
              <div className="p-6 border-b border-gray-100 flex-none">
                <div className="flex items-start gap-2 mb-3">
                  <User className="h-5 w-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <h3 className="font-bold text-gray-800">{client.name}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <span className="text-orange-500 font-bold mt-1">#</span>
                  <div>
                    <p className="text-sm text-gray-500">NAC</p>
                    <p className="font-medium text-gray-700">{client.nac}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de emisión</p>
                    <p className="font-medium text-gray-700">{client.date}</p>
                  </div>
                </div>
              </div>

              {/* Payment comparison */}
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex-none">
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <BarChart3 className="h-4 w-4 text-orange-500 mr-1" />
                    Comparación de pagos
                  </p>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Antes:</p>
                    <p className="font-medium text-gray-700">B/. {formatNumber(client.before)}</p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-gray-400" />

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Ahora:</p>
                    <p className={`font-bold ${client.after < 0 ? "text-green-600" : "text-orange-600"}`}>
                      B/. {formatNumber(client.after)}
                    </p>
                  </div>
                </div>

                {/* Progress bar showing savings */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full ${client.after < 0 ? "bg-green-500" : "bg-orange-500"} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: animatedCards[index]
                        ? `${Math.min(100, Math.max(0, 100 - (client.after / client.before) * 100))}%`
                        : "0%",
                    }}
                  ></div>
                </div>

                <p className="text-xs text-right mt-1 text-gray-500">
                  {client.after < 0
                    ? `Crédito de ${Math.abs(client.after).toFixed(2)}`
                    : `Ahorro del ${Math.round(100 - (client.after / client.before) * 100)}%`}
                </p>
              </div>

              {/* Consumption history */}
              <div className="p-6 border-b border-gray-100 flex-none">
                <p className="text-sm text-gray-500 mb-3">Historial de consumo</p>
                <div className="h-32 overflow-y-auto pr-2 space-y-1">
                  {client.history.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-500">{item.date}</span>
                      <span className="font-medium text-gray-700">{formatNumber(item.kwh)} kWh</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with note and button */}
              <div className="p-6 flex flex-col gap-3 mt-auto">
                <p className="text-sm text-gray-600">{client.note}</p>
                <Button
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    if (client.name === "ALMACENADORA MERCANTIL, S.A.") {
                      openFacturaModal({ name: client.name, nac: client.nac, clientId: "almacenadora" })
                    } else if (client.name === "VALLADARES INTERNACIONAL, S.A.") {
                      openFacturaModal({ name: client.name, nac: client.nac, clientId: "valladares" })
                    } else {
                      alert("Factura no disponible para este cliente")
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Detalles de la factura
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Factura Modal */}
      {selectedClient && (
        <FacturaModal
          isOpen={showFacturaModal}
          onClose={closeFacturaModal}
          clientName={selectedClient.name}
          nac={selectedClient.nac}
          clientId={selectedClient.clientId}
        />
      )}
    </section>
  )
}
