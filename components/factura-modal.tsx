"use client"
import { X, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FacturaModalProps {
  isOpen: boolean
  onClose: () => void
  clientName: string
  nac: string
  clientId: string // Add this new prop
}

export default function FacturaModal({ isOpen, onClose, clientName, nac, clientId }: FacturaModalProps) {
  if (!isOpen) return null

  // Prevent scrolling on the body when modal is open
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden"
  }

  const handleClose = () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto"
    }
    onClose()
  }

  // Add conditional rendering based on clientId
  const renderFacturaContent = () => {
    if (clientId === "almacenadora") {
      return (
        <>
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-300 p-3 rounded">
              <div className="font-bold mb-2">CLIENTE</div>
              <div>NAC: {nac}</div>
              <div>Tarifa: MTD Tx: 1040200</div>
              <div>Nombre: {clientName}</div>
              <div>Servicio: Comercial</div>
              <div>Dirección: OJO DE AGUA, TRANSISTMICA 6</div>
              <div>Medidor: 191081850-LANDIS & GYR</div>
            </div>

            <div className="border border-gray-300 p-3 rounded">
              <div className="font-bold mb-2">FACTURA</div>
              <div>Desde: 05/02/2025 Hasta: 06/03/2025</div>
              <div>Número de la factura: 701806361198</div>
              <div>Emisión: 12 de Marzo de 2025</div>
              <div>Vencimiento: 11 de Abril de 2025</div>
              <div>Tipo de Lectura: Real Dias: 30</div>
              <div className="text-xs italic mt-2">
                Evite el cargo por mora. Pague antes de la fecha de vencimiento.
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DETALLE</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td colSpan={3} className="py-1 font-bold">
                      CARGOS DE ENERGIA
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Fijo</td>
                    <td className="py-1 text-right">9.09000</td>
                    <td className="py-1 text-right">9.09</td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Por Energia</td>
                    <td className="py-1 text-right">0.14573</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Por Demanda</td>
                    <td className="py-1 text-right">12.73000</td>
                    <td className="py-1 text-right">534.66</td>
                  </tr>
                  <tr>
                    <td className="py-1">Variacion Por Combustible</td>
                    <td className="py-1 text-right">0.00678</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1">Sub-Total</td>
                    <td className="py-1 text-right">0.00000</td>
                    <td className="py-1 text-right font-bold">543.75</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">SUBSIDIOS Y DESCUENTOS</div>
              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">OTROS</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">Ajuste</td>
                    <td className="py-1 text-right">0.00000</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">FACTURACION A TERCEROS</div>
              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">AVISOS</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">Factura de este mes</td>
                    <td className="py-1 text-right">543.75</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Total ENSA</td>
                    <td className="py-1 text-right">543.75</td>
                  </tr>
                  <tr>
                    <td className="py-1">Factura de este mes</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Facturación ENSA</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Saldo Pendiente</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Total Facturación a Terceros</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Facturación a Terceros</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Saldo Pendiente</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1 text-right font-bold">543.75</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DATOS DE CONSUMO</div>
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 text-left">Tipo de Consumo</th>
                    <th className="py-1 text-right">Lectura Anterior</th>
                    <th className="py-1 text-right">Lectura Actual</th>
                    <th className="py-1 text-right">Mult.</th>
                    <th className="py-1 text-right">Consumo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">Consumo HP</td>
                    <td className="py-1 text-right">27.00</td>
                    <td className="py-1 text-right">44.00</td>
                    <td className="py-1 text-right">3</td>
                    <td className="py-1 text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-1">Demanda máx. HP</td>
                    <td className="py-1 text-right">0.15</td>
                    <td className="py-1 text-right">0.12</td>
                    <td className="py-1 text-right">350</td>
                    <td className="py-1 text-right">42</td>
                  </tr>
                  <tr>
                    <td className="py-1">Consumo Reactivo</td>
                    <td className="py-1 text-right">14.00</td>
                    <td className="py-1 text-right">22.00</td>
                    <td className="py-1 text-right">350</td>
                    <td className="py-1 text-right">2,800</td>
                  </tr>
                  <tr>
                    <td className="py-1">Factor de Potencia</td>
                    <td className="py-1 text-right" colSpan={4}>
                      1.00
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mb-2 border-b border-gray-300 pb-1">HISTORIAL DE CONSUMO</div>
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 text-left">Fecha de Facturación</th>
                    <th className="py-1 text-right">Días</th>
                    <th className="py-1 text-right">Cons. kWh</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">06/03/2025</td>
                    <td className="py-1 text-right">30</td>
                    <td className="py-1 text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-1">04/02/2025</td>
                    <td className="py-1 text-right">31</td>
                    <td className="py-1 text-right">350</td>
                  </tr>
                  <tr>
                    <td className="py-1">04/01/2025</td>
                    <td className="py-1 text-right">30</td>
                    <td className="py-1 text-right">17150</td>
                  </tr>
                  <tr>
                    <td className="py-1">05/12/2024</td>
                    <td className="py-1 text-right">30</td>
                    <td className="py-1 text-right">18550</td>
                  </tr>
                  <tr>
                    <td className="py-1">05/11/2024</td>
                    <td className="py-1 text-right">31</td>
                    <td className="py-1 text-right">20650</td>
                  </tr>
                  <tr>
                    <td className="py-1">05/10/2024</td>
                    <td className="py-1 text-right">31</td>
                    <td className="py-1 text-right">22050</td>
                  </tr>
                  <tr>
                    <td className="py-1">04/09/2024</td>
                    <td className="py-1 text-right">30</td>
                    <td className="py-1 text-right">23100</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DATOS DE LA DEUDA DE ENSA</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">Saldo</td>
                    <td className="py-1 text-right">543.75</td>
                  </tr>
                  <tr>
                    <td className="py-1">Saldo vencido</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Marzo Vencimiento 11/abr/2025</td>
                    <td className="py-1 text-right">543.75</td>
                  </tr>
                  <tr>
                    <td className="py-1">Febrero</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Enero y previos</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1 text-right font-bold">543.75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )
    } else if (clientId === "valladares") {
      return (
        <>
          {/* Client Information for Valladares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-300 p-3 rounded">
              <div className="font-bold mb-2">CLIENTE</div>
              <div>NAC: {nac}</div>
              <div>Tarifa: BTD Tx: 80800050</div>
              <div>Nombre: {clientName}</div>
              <div>Servicio: Comercial</div>
              <div>Dirección: BARRIO SUR, 11 ED BAR OLIMPIA PI PB LO 11154 AL LADO HOTEL</div>
              <div>Medidor: 184586303-LANDIS & GYR</div>
            </div>

            <div className="border border-gray-300 p-3 rounded">
              <div className="font-bold mb-2">FACTURA</div>
              <div>Desde: 24/02/2025 Hasta: 26/03/2025</div>
              <div>Número de la factura: 700022652703</div>
              <div>Emisión: 31 de Marzo de 2025</div>
              <div>Vencimiento: 30 de Abril de 2025</div>
              <div>Tipo de Lectura: Real Dias: 31</div>
              <div className="text-xs italic mt-2">
                Evite el cargo por mora. Pague antes de la fecha de vencimiento.
              </div>
            </div>
          </div>

          {/* Billing Details for Valladares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DETALLE</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td colSpan={3} className="py-1 font-bold">
                      CARGOS DE ENERGIA
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Fijo</td>
                    <td className="py-1 text-right">5.06000</td>
                    <td className="py-1 text-right">5.06</td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Por Energia(1-10000)</td>
                    <td className="py-1 text-right">0.16151</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Cargo Por Demanda</td>
                    <td className="py-1 text-right">15.21000</td>
                    <td className="py-1 text-right">456.30</td>
                  </tr>
                  <tr>
                    <td className="py-1">Variacion Por Combustible</td>
                    <td className="py-1 text-right">0.00659</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1">Sub-Total</td>
                    <td className="py-1 text-right">0.00000</td>
                    <td className="py-1 text-right font-bold">461.36</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">SUBSIDIOS Y DESCUENTOS</div>
              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">OTROS</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">(*) Credito A Favor Cliente</td>
                    <td className="py-1 text-right">0.00000</td>
                    <td className="py-1 text-right">-0.05</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1">Sub-Total</td>
                    <td className="py-1 text-right">0.00000</td>
                    <td className="py-1 text-right">-0.05</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">FACTURACION A TERCEROS</div>
              <div className="font-bold mt-4 mb-2 border-b border-gray-300 pb-1">AVISOS</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">Factura de este mes</td>
                    <td className="py-1 text-right">461.31</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Total ENSA</td>
                    <td className="py-1 text-right">-1,098.32</td>
                  </tr>
                  <tr>
                    <td className="py-1">Factura de este mes</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Facturación ENSA</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Saldo Pendiente</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Total Facturación a Terceros</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Facturación a Terceros</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-4">Saldo Pendiente</td>
                    <td className="py-1 text-right">-1,559.63</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1 text-right font-bold text-green-600">-1,098.32</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DATOS DE CONSUMO</div>
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 text-left">Tipo de Consumo</th>
                    <th className="py-1 text-right">Lectura Anterior</th>
                    <th className="py-1 text-right">Lectura Actual</th>
                    <th className="py-1 text-right">Mult.</th>
                    <th className="py-1 text-right">Consumo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">Consumo HP</td>
                    <td className="py-1 text-right">3.00</td>
                    <td className="py-1 text-right">61.00</td>
                    <td className="py-1 text-right">120</td>
                    <td className="py-1 text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-1">Demanda máx. HP</td>
                    <td className="py-1 text-right">0.21</td>
                    <td className="py-1 text-right">0.25</td>
                    <td className="py-1 text-right">120</td>
                    <td className="py-1 text-right">30</td>
                  </tr>
                  <tr>
                    <td className="py-1">Consumo Reactivo</td>
                    <td className="py-1 text-right">0.00</td>
                    <td className="py-1 text-right">2.00</td>
                    <td className="py-1 text-right">120</td>
                    <td className="py-1 text-right">240</td>
                  </tr>
                  <tr>
                    <td className="py-1">Factor de Potencia</td>
                    <td className="py-1 text-right" colSpan={4}>
                      1.00
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mb-2 border-b border-gray-300 pb-1">HISTORIAL DE CONSUMO</div>
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 text-left">Fecha de Facturación</th>
                    <th className="py-1 text-right">Días</th>
                    <th className="py-1 text-right">Cons. kWh</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">26/03/2025</td>
                    <td className="py-1 text-right">31</td>
                    <td className="py-1 text-right">0</td>
                  </tr>
                  <tr>
                    <td className="py-1">23/02/2025</td>
                    <td className="py-1 text-right">29</td>
                    <td className="py-1 text-right">6240</td>
                  </tr>
                  <tr>
                    <td className="py-1">25/01/2025</td>
                    <td className="py-1 text-right">31</td>
                    <td className="py-1 text-right">7080</td>
                  </tr>
                  <tr>
                    <td className="py-1">25/12/2024</td>
                    <td className="py-1 text-right">28</td>
                    <td className="py-1 text-right">7920</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mb-2 border-b border-gray-300 pb-1">DATOS DE LA DEUDA DE ENSA</div>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1">Saldo</td>
                    <td className="py-1 text-right">461.31</td>
                  </tr>
                  <tr>
                    <td className="py-1">Saldo vencido</td>
                    <td className="py-1 text-right">-1,559.63</td>
                  </tr>
                  <tr>
                    <td className="py-1">Marzo Vencimiento 30/abr/2025</td>
                    <td className="py-1 text-right">461.31</td>
                  </tr>
                  <tr>
                    <td className="py-1">Febrero</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1">Enero y previos</td>
                    <td className="py-1 text-right">0.00</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-1 font-bold">TOTAL</td>
                    <td className="py-1 text-right font-bold text-green-600">-1,098.32</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                <p className="mb-2">MENSAJE PARA EL CLIENTE</p>
                <ul className="space-y-1">
                  <li>
                    Indisponibilidad del servicio del mes anterior: 0 horas y 0 min. Esta información incluye
                    interrupciones por causas ajenas a ENSA.
                  </li>
                  <li>M2: Su saldo pendiente incluye un ajuste de otros meses por un valor de $59.69-</li>
                  <li>
                    Este crédito o reducción tarifaria es debido a los servicios no suministrados o suministrados
                    deficientemente por Alumbrado Público dentro de la zona de concesión.
                  </li>
                  <li>Gracias por mantener su cuenta al día.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <div className="p-6 text-center">
          <p>No hay detalles disponibles para este cliente.</p>
        </div>
      )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Factura Eléctrica - {clientName}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="p-6 bg-white font-mono text-sm">
          {/* ENSA Header */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
            <div className="font-bold text-xl">ENSA</div>
            <div className="text-right">
              <div className="font-bold">FACTURA DE ELECTRICIDAD</div>
              <div>MARZO 2025</div>
            </div>
          </div>

          {/* Render content based on clientId */}
          {renderFacturaContent()}

          {/* Footer */}
          <div className="border-t border-gray-300 pt-4 text-xs">
            <div className="text-center mb-2">
              En caso de no sentirse conforme puede presentar su reclamo ante la Autoridad Nacional de los Servicios
              Públicos al teléfono 800-3333
            </div>
            <div className="text-center">RUC 57983-56-340439 D.V. 65</div>
          </div>
        </div>
      </div>
    </div>
  )
}
