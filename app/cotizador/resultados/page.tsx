"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Download, Sun, Zap, Calendar, DollarSign, BarChart3, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { obtenerCotizacion } from "@/lib/supabase"
import { calcularProyeccionAhorro } from "@/lib/calculadora-solar"
import { useToast } from "@/components/ui/use-toast"

export default function ResultadosPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [resultados, setResultados] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proyeccion, setProyeccion] = useState<any[]>([])

  useEffect(() => {
    async function cargarCotizacion() {
      try {
        setLoading(true)
        const cotizacionId = searchParams.get("id")

        if (!cotizacionId) {
          setError("No se encontró el ID de la cotización")
          return
        }

        const { data, error: supabaseError } = await obtenerCotizacion(cotizacionId)

        if (supabaseError || !data) {
          console.error("Error al obtener la cotización:", supabaseError)
          setError("No se pudo cargar la cotización")
          return
        }

        // Extraer datos del cliente y la cotización
        const clienteData = data.clientes
        const cotizacionData = {
          potenciaSistemaKW: data.potencia_sistema_kw,
          numeroPaneles: data.numero_paneles,
          areaRequerida: data.area_requerida,
          costoEstimado: data.costo_estimado,
          ahorroMensual: data.ahorro_mensual,
          ahorroAnual: data.ahorro_anual,
          retornoInversion: data.retorno_inversion,
          reduccionCO2: data.reduccion_co2,
          consumoKWh: data.consumo_kwh,
          tipoPropiedad: data.tipo_propiedad,
        }

        setCliente(clienteData)
        setResultados(cotizacionData)

        // Calcular proyección de ahorro
        const proyeccionData = calcularProyeccionAhorro(cotizacionData, 25)
        setProyeccion(proyeccionData)
      } catch (err) {
        console.error("Error al cargar la cotización:", err)
        setError("Ocurrió un error al cargar los resultados")
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados de la cotización",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarCotizacion()
  }, [searchParams, toast])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Generando tu propuesta solar</h2>
            <p className="text-gray-500">Estamos calculando el sistema ideal para ti...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !resultados) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-500">Error al cargar los resultados</CardTitle>
              <CardDescription>
                {error || "No se pudo generar la propuesta solar. Por favor intenta nuevamente."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cotizador">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Volver al cotizador</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sun className="h-6 w-6 text-orange-500" />
          <span>SolarMente.IA</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/cotizador">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Tu Propuesta Solar Personalizada</h1>
              <p className="text-gray-500">
                Basada en tu consumo de {resultados.consumoKWh} kWh mensuales en {cliente?.ubicacion}
              </p>
            </div>
            <Button variant="outline" className="ml-auto" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Sistema Recomendado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resultados.potenciaSistemaKW} kW</div>
                <p className="text-xs text-gray-500">Potencia total del sistema</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm font-medium">{resultados.numeroPaneles}</div>
                    <p className="text-xs text-gray-500">Paneles solares</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{resultados.areaRequerida} m²</div>
                    <p className="text-xs text-gray-500">Área requerida</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Inversión Estimada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${resultados.costoEstimado.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Costo total del sistema</p>
                <div className="mt-4">
                  <div className="text-sm font-medium">{resultados.retornoInversion} años</div>
                  <p className="text-xs text-gray-500">Retorno de inversión</p>
                  <Progress
                    value={Math.min(100, (100 / Number(resultados.retornoInversion)) * 5)}
                    className="mt-2 h-2"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ahorro Proyectado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${resultados.ahorroAnual.toLocaleString()}/año</div>
                <p className="text-xs text-gray-500">${resultados.ahorroMensual.toLocaleString()}/mes</p>
                <div className="mt-4">
                  <div className="text-sm font-medium">{resultados.reduccionCO2} ton</div>
                  <p className="text-xs text-gray-500">Reducción anual de CO₂</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="detalles">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detalles">Detalles del Sistema</TabsTrigger>
              <TabsTrigger value="financiero">Análisis Financiero</TabsTrigger>
              <TabsTrigger value="ambiental">Impacto Ambiental</TabsTrigger>
            </TabsList>
            <TabsContent value="detalles" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Componentes del Sistema</CardTitle>
                  <CardDescription>Equipos recomendados para tu instalación solar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium">Paneles Solares</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {resultados.numeroPaneles} x Panel Monocristalino 400W
                        </p>
                        <div className="mt-2 flex items-center text-sm">
                          <Zap className="h-4 w-4 text-orange-500 mr-1" />
                          <span>Eficiencia: 21.3%</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                          <span>Garantía: 25 años</span>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium">Inversor</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Inversor {Math.ceil(Number(resultados.potenciaSistemaKW))}kW
                        </p>
                        <div className="mt-2 flex items-center text-sm">
                          <Zap className="h-4 w-4 text-orange-500 mr-1" />
                          <span>Eficiencia: 98.2%</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                          <span>Garantía: 10 años</span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Estructura de Montaje</h3>
                      <p className="text-sm text-gray-500 mt-1">Sistema de montaje para techo inclinado o plano</p>
                      <div className="mt-2 flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                        <span>Garantía: 15 años</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="financiero" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Financiero</CardTitle>
                  <CardDescription>Proyección de ahorro e inversión a 25 años</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Resumen Financiero</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">Inversión Inicial</p>
                          <p className="text-xl font-bold">${resultados.costoEstimado.toLocaleString()}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">Ahorro Total (25 años)</p>
                          <p className="text-xl font-bold">
                            ${(proyeccion[24]?.ahorroAcumulado || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Flujo de Caja</h3>
                      <div className="h-[200px] border rounded-lg p-4 flex items-end">
                        <div className="w-full flex items-end justify-between gap-1">
                          {proyeccion.slice(0, 10).map((item, i) => (
                            <div
                              key={i}
                              className="bg-orange-500 w-8 rounded-t-md"
                              style={{
                                height: `${Math.min(100, (item.ahorroAcumulado / resultados.costoEstimado) * 100)}px`,
                                opacity: 0.6 + i * 0.04,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>Año 1</span>
                        <span>Año 10</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Retorno de Inversión</h3>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Punto de equilibrio</span>
                          <span className="font-medium">{resultados.retornoInversion} años</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-orange-500 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(100, (100 / Number(resultados.retornoInversion)) * 5)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Hoy</span>
                          <span>{resultados.retornoInversion} años</span>
                          <span>25 años</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ambiental" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Impacto Ambiental</CardTitle>
                  <CardDescription>Beneficios ambientales de tu sistema solar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 mx-auto">
                          <BarChart3 className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="font-medium text-center mb-1">Reducción de CO₂</h3>
                        <p className="text-center text-2xl font-bold">{resultados.reduccionCO2} ton/año</p>
                        <p className="text-center text-xs text-gray-500 mt-1">
                          {(resultados.reduccionCO2 * 25).toFixed(2)} toneladas en 25 años
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 mx-auto">
                          <Zap className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="font-medium text-center mb-1">Energía Limpia</h3>
                        <p className="text-center text-2xl font-bold">
                          {(resultados.potenciaSistemaKW * 1500).toFixed(0)} kWh/año
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-1">
                          Equivalente al consumo de {Math.floor((resultados.potenciaSistemaKW * 1500) / 3000)} hogares
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 mx-auto">
                          <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="font-medium text-center mb-1">Valor Sostenible</h3>
                        <p className="text-center text-2xl font-bold">+5-7%</p>
                        <p className="text-center text-xs text-gray-500 mt-1">
                          Aumento estimado en el valor de tu propiedad
                        </p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Equivalencias Ambientales</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Tu reducción anual de CO₂ ({resultados.reduccionCO2} toneladas) equivale a:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-500 text-sm font-medium">🌲</span>
                          </div>
                          <div>
                            <p className="font-medium">{Math.floor(resultados.reduccionCO2 * 45)} árboles</p>
                            <p className="text-xs text-gray-500">plantados y crecidos por 10 años</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-500 text-sm font-medium">🚗</span>
                          </div>
                          <div>
                            <p className="font-medium">{Math.floor(resultados.reduccionCO2 * 4000)} km</p>
                            <p className="text-xs text-gray-500">no recorridos en automóvil</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Solicitar Instalación
            </Button>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 SolarMente.IA. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
