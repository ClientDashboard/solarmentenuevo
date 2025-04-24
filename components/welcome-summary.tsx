import { CheckCircle, Sun, Zap, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeSummaryProps {
  clientName: string
  monthlySavings: number
  annualSavings: number
  systemSize: number
  panels: number
  roi: number
  formatNumber: (num: number) => string
}

export default function WelcomeSummary({
  clientName,
  monthlySavings,
  annualSavings,
  systemSize,
  panels,
  roi,
  formatNumber,
}: WelcomeSummaryProps) {
  // Extraer el primer nombre para un saludo más personal
  const firstName = clientName.split(" ")[0]

  return (
    <Card className="overflow-hidden border-gray-200 shadow-lg mb-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Sun className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">¡Bienvenido, {firstName}!</h2>
        </div>
        <p className="text-orange-50 mb-2">
          Gracias por utilizar nuestra calculadora solar inteligente. Hemos generado una propuesta personalizada basada
          en tu consumo energético.
        </p>
      </div>

      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Resumen de tu Propuesta Solar</h3>
          <p className="text-gray-600">
            Basado en tu perfil de consumo, hemos diseñado un sistema solar de{" "}
            <span className="font-semibold">{systemSize} kW</span> con{" "}
            <span className="font-semibold">{panels} paneles</span> que te permitirá:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800">Ahorro Mensual</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">${formatNumber(monthlySavings)}</p>
            <p className="text-sm text-gray-600 mt-1">en tu factura eléctrica</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800">Ahorro Anual</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">${formatNumber(annualSavings)}</p>
            <p className="text-sm text-gray-600 mt-1">acumulado por año</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-100 p-2 rounded-full">
                <Sun className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-800">Retorno de Inversión</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600">{roi} años</p>
            <p className="text-sm text-gray-600 mt-1">para recuperar tu inversión</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Beneficios Principales</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Reducción significativa en tu factura eléctrica desde el primer mes
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Protección contra futuros aumentos en las tarifas eléctricas</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Contribución a la reducción de emisiones de CO₂</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Aumento en el valor de tu propiedad</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            Explora los detalles completos de tu propuesta en las pestañas a continuación para conocer más sobre los
            equipos recomendados, planes de financiamiento y análisis financiero detallado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
