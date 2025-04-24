import { CheckCircle, CreditCard, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PreciosPagosProps {
  propuesta: any
  formatNumber: (num: number) => string
}

export default function PreciosPagos({ propuesta, formatNumber }: PreciosPagosProps) {
  // Function to generate WhatsApp message
  const generateWhatsAppMessage = (planName: string) => {
    const message = `Hola, estoy interesado en el ${planName} para mi propuesta solar con ${propuesta.sistema.tamano} kW.`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/50764143255?text=${encodedMessage}`
  }

  return (
    <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <span className="bg-orange-100 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-orange-500" />
          </span>
          Precio del Sistema
        </CardTitle>
        <p className="text-gray-500">Opciones de financiamiento para tu sistema solar personalizado</p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Tramites Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Trámites Bomberos</h4>
              <p className="text-sm text-gray-600">Nos encargamos de la gestión completa ante el cuerpo de bomberos.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Trámites Municipio</h4>
              <p className="text-sm text-gray-600">Gestionamos los permisos y requisitos municipales necesarios.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Trámites Compañía de Luz</h4>
              <p className="text-sm text-gray-600">
                Realizamos la interconexión y cambio de medidor con la compañía eléctrica.
              </p>
            </div>
          </div>

          {/* Plan 1: Estándar */}
          <div className="bg-white rounded-xl border-2 border-orange-200 shadow-lg overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Plan Estándar</h3>
                </div>
                <div className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  Recomendado
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Nuestro plan estándar divide el pago en tres abonos, permitiéndote distribuir la inversión durante el
                  proceso de instalación y puesta en marcha de tu sistema solar.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                        1
                      </div>
                      <h4 className="font-medium text-gray-800">Abono Inicial (70%)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Al recibir el primer abono damos inicio a la instalación del sistema solar en un máximo de 10 días
                      hábiles. También se da inicio a los trámites.
                    </p>
                    <div className="text-xl font-bold text-orange-500">
                      ${formatNumber(propuesta.precios.plan1.abono1)}
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                        2
                      </div>
                      <h4 className="font-medium text-gray-800">Segundo Abono (25%)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      El segundo abono se cancela al terminar la instalación de todos los equipos y dejar el sistema en
                      funcionamiento con inyección cero para obtener un ahorro mientras se hacen los trámites.
                    </p>
                    <div className="text-xl font-bold text-orange-500">
                      ${formatNumber(propuesta.precios.plan1.abono2)}
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                        3
                      </div>
                      <h4 className="font-medium text-gray-800">Abono Final (5%)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      El tercer y último abono se cancela al tener el nuevo medidor por la compañía de luz.
                    </p>
                    <div className="text-xl font-bold text-orange-500">
                      ${formatNumber(propuesta.precios.plan1.abono3)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div>
                    <span className="text-gray-600 font-medium">Inversión Total:</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${formatNumber(propuesta.precios.plan1.total)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Sin intereses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Instalación en 7-10 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Garantía completa</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <a
                    href={generateWhatsAppMessage("Plan Estándar")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    Chat por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Plan 2: Financiado */}
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Plan Financiado</h3>
                </div>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  Cuotas mensuales
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Nuestro plan financiado te permite realizar un abono inicial y pagar el resto en cuotas mensuales
                  durante 6 meses, facilitando la adquisición de tu sistema solar.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                        1
                      </div>
                      <h4 className="font-medium text-gray-800">Abono Inicial (60%)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Se realiza al firmar el contrato para iniciar el proceso de instalación.
                    </p>
                    <div className="text-xl font-bold text-blue-500">
                      ${formatNumber(propuesta.precios.plan2.abonoInicial)}
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                        2
                      </div>
                      <h4 className="font-medium text-gray-800">Saldo Pendiente (40%)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Se divide en 6 cuotas mensuales iguales sin intereses.</p>
                    <div className="text-xl font-bold text-blue-500">
                      ${formatNumber(propuesta.precios.plan2.saldoPendiente)}
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <h4 className="font-medium text-gray-800">Cuota Mensual (x6)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Pagos mensuales durante 6 meses consecutivos.</p>
                    <div className="text-xl font-bold text-blue-500">
                      ${formatNumber(propuesta.precios.plan2.cuotaMensual)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div>
                    <span className="text-gray-600 font-medium">Inversión Total:</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">${formatNumber(propuesta.precios.plan2.total)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Pagos flexibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Sin verificación crediticia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Instalación inmediata</span>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                  <a
                    href={generateWhatsAppMessage("Plan Financiado")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    Chat por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Comparativa de planes */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              Comparativa de Planes
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b border-gray-200"></th>
                    <th className="text-center py-3 px-4 bg-orange-50 text-orange-800 font-medium border-b border-orange-200">
                      Plan Estándar
                    </th>
                    <th className="text-center py-3 px-4 bg-blue-50 text-blue-800 font-medium border-b border-blue-200">
                      Plan Financiado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Pago inicial</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-medium">
                      70% (${formatNumber(propuesta.precios.plan1.abono1)})
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-medium">
                      60% (${formatNumber(propuesta.precios.plan2.abonoInicial)})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Pagos adicionales</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">2 pagos (25% y 5%)</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">6 cuotas mensuales</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Cuota mensual</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">No aplica</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-medium">
                      ${formatNumber(propuesta.precios.plan2.cuotaMensual)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Tiempo de pago</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">Durante la instalación</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">6 meses</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Intereses</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center text-green-500">Sin intereses</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center text-green-500">Sin intereses</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600 font-medium">Precio total</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-bold text-orange-600">
                      ${formatNumber(propuesta.precios.plan1.total)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center font-bold text-blue-600">
                      ${formatNumber(propuesta.precios.plan2.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
