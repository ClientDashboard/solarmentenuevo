// Import necessary modules and components
import { formatNumber, formatCurrency } from "@/lib/utils"
import { getPropuesta } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Financiero from "@/components/financiero"
import Ambiental from "@/components/ambiental"
import Comportamiento from "@/components/comportamiento"
import PreciosPagos from "@/components/precios-pagos"
import EquipmentSummary from "@/components/equipment-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SunIcon, ZapIcon, CalendarIcon } from "lucide-react"

export default async function Page({ params }: { params: { id: string } }) {
  const propuesta = await getPropuesta(params.id)

  if (!propuesta) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Propuesta no encontrada</h1>
        <p>No se pudo encontrar la propuesta con el ID: {params.id}</p>
      </div>
    )
  }

  // Función para generar datos de proyección de ahorro
  const generarDatosProyeccionAhorro = () => {
    const datos = []
    const aumentoAnual = 0.03 // 3% de aumento anual en tarifas eléctricas

    for (let año = 1; año <= 25; año++) {
      // Calcular el ahorro considerando el aumento de tarifas
      const ahorroConAumento = propuesta.financiero.ahorroAnual * Math.pow(1 + aumentoAnual, año - 1)

      datos.push({
        año,
        ahorro: Math.round(ahorroConAumento),
        ahorroAcumulado:
          año === 1 ? Math.round(ahorroConAumento) : Math.round(datos[año - 2].ahorroAcumulado + ahorroConAumento),
      })
    }

    return datos
  }

  // Función para generar datos de producción mensual
  const generarDatosProduccionMensual = () => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    return meses.map((mes, index) => ({
      mes,
      produccion: propuesta.produccion.mensual[index],
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Propuesta Solar Personalizada</h1>
          <p className="text-muted-foreground">Para: {propuesta.cliente.nombre || "Cliente"}</p>
        </div>
        <div className="flex gap-2">
          {/* Remove the following 3 components */}
          {/*
          <SendEmailButton
            proposalId={params.id}
            clientEmail={propuesta.cliente.email}
            clientName={propuesta.cliente.nombre || "Cliente"}
            systemSize={propuesta.sistema.tamano}
            monthlySavings={propuesta.financiero.ahorroMensual}
          />
          <PdfGenerator
            propuesta={propuesta}
            clientNombre={propuesta.cliente.nombre || "Cliente"}
            formatNumber={formatNumber}
          />
          <SendAdminNotificationButton proposalId={params.id} />
          */}
        </div>
      </div>

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="resumen"
            className="transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger
            value="financiero"
            className="transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Financiero
          </TabsTrigger>
          <TabsTrigger
            value="ambiental"
            className="transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Ambiental
          </TabsTrigger>
          <TabsTrigger
            value="comportamiento"
            className="transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Comportamiento
          </TabsTrigger>
          <TabsTrigger
            value="precios"
            className="transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Precios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <SunIcon className="mr-2 h-5 w-5 text-yellow-500" />
                  Sistema Recomendado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidad</p>
                    <p className="text-2xl font-bold">{propuesta.sistema.tamano} kWp</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paneles</p>
                    <p className="text-2xl font-bold">{propuesta.sistema.paneles} unidades</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inversores</p>
                    <p className="text-2xl font-bold">{propuesta.sistema.inversores} unidades</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Espacio</p>
                    <p className="text-2xl font-bold">{propuesta.sistema.espacioTecho} m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <ZapIcon className="mr-2 h-5 w-5 text-amber-500" />
                  Ahorro Energético
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo Actual</p>
                    <p className="text-2xl font-bold">{formatNumber(propuesta.cliente.consumo)} kWh/mes</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ahorro Estimado</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(propuesta.ahorro.anual)}/año</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reducción de CO₂</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatNumber(propuesta.ambiental.co2Reducido)} ton/año
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipos del Sistema */}
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <SunIcon className="mr-2 h-5 w-5 text-blue-500" />
              Equipos del Sistema
            </h2>
            <EquipmentSummary propuesta={propuesta} formatNumber={formatNumber} />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                Resumen Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Inversión Inicial</p>
                  <p className="text-2xl font-bold">{formatCurrency(propuesta.precios.plan1.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retorno de Inversión</p>
                  <p className="text-2xl font-bold">{propuesta.sistema.roi} años</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ahorro a 25 años</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(propuesta.financiero.ahorro25Anos)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remove the following components */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SavingsComparisonChart
              totalInvestment={propuesta.precios.plan1.total}
              annualSavings={propuesta.financiero.ahorroAnual}
              totalYears={25}
              formatNumber={formatNumber}
            />

            <AnimatedSavingsChart
              totalInvestment={propuesta.precios.plan1.total}
              annualSavings={propuesta.financiero.ahorroAnual}
              totalYears={25}
              roiYears={propuesta.sistema.roi}
              formatNumber={formatNumber}
            />
          </div>

          <FinancialDashboard
            annualSavings={propuesta.financiero.ahorroAnual}
            monthlyConsumption={propuesta.cliente.consumo}
            electricityRate={5.5}
            totalYears={25}
            formatNumber={formatNumber}
            systemSizeKW={propuesta.sistema.tamano}
          />
          */}
        </TabsContent>

        <TabsContent value="financiero" className="space-y-6 pt-4">
          <Financiero
            propuesta={propuesta}
            formatNumber={formatNumber}
            currentCount={0}
            generarDatosProyeccionAhorro={generarDatosProyeccionAhorro}
          />
        </TabsContent>

        <TabsContent value="ambiental" className="space-y-6 pt-4">
          <Ambiental propuesta={propuesta} formatNumber={formatNumber} />
        </TabsContent>

        <TabsContent value="comportamiento" className="space-y-6 pt-4">
          <Comportamiento
            propuesta={propuesta}
            formatNumber={formatNumber}
            generarDatosProduccionMensual={generarDatosProduccionMensual}
          />
        </TabsContent>

        <TabsContent value="precios" className="space-y-6 pt-4">
          <PreciosPagos propuesta={propuesta} formatNumber={formatNumber} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
