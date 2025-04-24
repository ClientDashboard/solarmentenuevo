"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { obtenerCotizacion } from "@/lib/supabase"
import type { ProposalData } from "@/lib/types"
import {
  Loader2,
  Sun,
  Download,
  ArrowLeft,
  Zap,
  DollarSign,
  BarChart3,
  CheckCircle,
  Lightbulb,
  TreePine,
  Car,
  Home,
  Share2,
  Award,
  CreditCard,
  Clock,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FinancialDashboard from "@/components/financial-dashboard"

// Asegúrate de importar los estilos de animación en el archivo
// Puedes añadir esto justo después de las importaciones
import "./animations.css"

export default function ProposalPage() {
  const params = useParams()
  const [propuesta, setPropuesta] = useState<ProposalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("detalles")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [animateCounter, setAnimateCounter] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const targetRef = useRef<HTMLDivElement>(null)

  // Datos para gráficos simplificados
  const [ahorroData, setAhorroData] = useState<any[]>([])
  const [produccionData, setProduccionData] = useState<any[]>([])

  useEffect(() => {
    async function cargarPropuesta() {
      try {
        setLoading(true)
        const id = params.id as string

        if (!id) {
          setError("No se encontró el ID de la propuesta")
          return
        }

        const { data, error: supabaseError } = await obtenerCotizacion(id)

        if (supabaseError || !data) {
          console.error("Error al obtener la propuesta:", supabaseError)
          setError("No se pudo cargar la propuesta")
          return
        }

        // Verificar que data.propuesta_data existe
        if (!data.propuesta_data) {
          console.error("La propuesta no contiene datos:", data)
          setError("La propuesta no contiene datos válidos")
          return
        }

        // Verificar si la estructura de datos es la esperada
        if (!data.propuesta_data.produccion) {
          // Posible error: 'produccion' podría estar mal escrito como 'produesta.produccion'
          // Intentar corregir si ese es el caso
          if (data.propuesta_data.produesta && data.propuesta_data.produesta.produccion) {
            // Crear una copia corregida de los datos
            const dataCopy = { ...data.propuesta_data }
            dataCopy.produccion = data.propuesta_data.produesta.produccion
            setPropuesta(dataCopy)
            prepararDatosGraficos(dataCopy)
          } else {
            console.error("Estructura de datos inesperada:", data.propuesta_data)
            setError("La estructura de datos de la propuesta es incorrecta")
          }
        } else {
          // Estructura correcta
          setPropuesta(data.propuesta_data)
          prepararDatosGraficos(data.propuesta_data)
        }
      } catch (err) {
        console.error("Error al cargar la propuesta:", err)
        setError("Ocurrió un error al cargar los resultados")
      } finally {
        setLoading(false)
      }
    }

    cargarPropuesta()
  }, [params])

  // Buscar la línea donde se preparan los datos para gráficos
  // Reemplazar la función prepararDatosGraficos con esta versión que incluye verificación de datos

  const prepararDatosGraficos = (data: ProposalData) => {
    // Verificar que los datos necesarios existen antes de usarlos
    if (!data || !data.financiero || !data.produccion) {
      console.error("Datos incompletos en la propuesta:", data)
      setAhorroData([])
      setProduccionData([])
      return
    }

    // Datos para gráfico de ahorro acumulado
    const ahorroAcumuladoData = []
    let acumulado = 0

    for (let i = 1; i <= 25; i++) {
      const ahorroAnual = data.financiero.ahorroAnual * Math.pow(1.03, i - 1) // Considerando aumento de 3% anual en costo de electricidad
      acumulado += ahorroAnual

      ahorroAcumuladoData.push({
        año: i,
        ahorro: Math.round(ahorroAnual),
        ahorroAcumulado: Math.round(acumulado),
        inversion: i === 1 ? data.precios.plan1.total : 0,
      })
    }
    setAhorroData(ahorroAcumuladoData)

    // Datos para gráfico de producción mensual
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Verificar que data.produccion.mensual existe y es un array
    if (Array.isArray(data.produccion.mensual)) {
      const produccionMensualData = data.produccion.mensual.map((valor, index) => ({
        mes: meses[index],
        produccion: valor,
      }))
      setProduccionData(produccionMensualData)
    } else {
      console.error("data.produccion.mensual no es un array:", data.produccion)
      setProduccionData([])
    }
  }

  // Animación de contador
  useEffect(() => {
    if (propuesta && !animateCounter) {
      setAnimateCounter(true)
      const targetAhorro = propuesta.financiero.ahorroAnual
      const duration = 2000 // 2 segundos
      const steps = 60
      const increment = targetAhorro / steps
      let current = 0
      let step = 0

      const interval = setInterval(() => {
        step++
        current = Math.min(targetAhorro, Math.round(increment * step))
        setCurrentCount(current)

        if (step >= steps) {
          clearInterval(interval)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [propuesta, animateCounter])

  // Observador de intersección para animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [loading])

  // Función para copiar enlace
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-gray-50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sun className="h-12 w-12 text-orange-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Generando tu propuesta solar</h2>
            <p className="text-gray-500 max-w-md">
              Estamos calculando el sistema ideal para ti con nuestra tecnología de IA...
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse-x"></div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Analizando consumo</span>
                <span>Calculando ahorro</span>
                <span>Finalizando</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !propuesta) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-gray-50">
          <div className="w-full max-w-lg opacity-0 translate-y-4 animate-fade-in">
            <Card className="border-red-200 shadow-lg">
              <CardHeader className="bg-red-50 rounded-t-lg">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <span className="bg-red-100 p-2 rounded-full">
                    <Loader2 className="h-5 w-5 text-red-500" />
                  </span>
                  Error al cargar los resultados
                </CardTitle>
                <CardDescription className="text-red-500">
                  {error || "No se pudo generar la propuesta solar. Por favor intenta nuevamente."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Link href="/cotizador">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver al cotizador
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header con efecto de glassmorphism */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 relative"
              onClick={() => setShowShareOptions(!showShareOptions)}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartir</span>

              {showShareOptions && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-48">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Enlace copiado" : "Copiar enlace"}
                  </button>
                </div>
              )}
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-white to-gray-50">
        {/* Hero section con animación */}
        <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-4xl mx-auto opacity-0 translate-y-4 animate-fade-in">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <Link href="/cotizador">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-200">
                      Propuesta #{params.id?.substring(0, 8)}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Listo para instalar
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-800 mb-1">Tu Propuesta Solar Personalizada</h1>
                  <p className="text-gray-600">
                    Basada en tu consumo de{" "}
                    <span className="font-semibold">{formatNumber(propuesta.cliente.consumo)} kWh</span> mensuales
                  </p>
                </div>
              </div>

              {/* Tarjeta de resumen con animación */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-8 opacity-0 translate-y-4 animate-fade-in animation-delay-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white mb-4">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sistema Recomendado</h3>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{propuesta.sistema.tamano} kW</div>
                    <p className="text-sm text-gray-600">{propuesta.sistema.paneles} paneles solares</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mb-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Inversión Estimada</h3>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${formatNumber(propuesta.precios.plan1.total)}
                    </div>
                    <p className="text-sm text-gray-600">ROI: {propuesta.sistema.roi} años</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Ahorro Anual</h3>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${animateCounter ? formatNumber(currentCount) : formatNumber(propuesta.financiero.ahorroAnual)}
                    </div>
                    <p className="text-sm text-gray-600">${formatNumber(propuesta.financiero.ahorroMensual)}/mes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Tabs con animación */}
            <Tabs defaultValue="detalles" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-1">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="detalles"
                    className={`rounded-lg transition-all duration-300 ${activeTab === "detalles" ? "bg-white shadow-sm text-gray-800" : "text-gray-600 hover:text-gray-800"}`}
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Detalles de Equipos</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="planes"
                    className={`rounded-lg transition-all duration-300 ${activeTab === "planes" ? "bg-white shadow-sm text-gray-800" : "text-gray-600 hover:text-gray-800"}`}
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Planes de Pago</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="financiero"
                    className={`rounded-lg transition-all duration-300 ${activeTab === "financiero" ? "bg-white shadow-sm text-gray-800" : "text-gray-600 hover:text-gray-800"}`}
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Financiero</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ambiental"
                    className={`rounded-lg transition-all duration-300 ${activeTab === "ambiental" ? "bg-white shadow-sm text-gray-800" : "text-gray-600 hover:text-gray-800"}`}
                  >
                    <span className="flex items-center gap-2">
                      <TreePine className="h-4 w-4" />
                      <span>Ambiental</span>
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="detalles" className="space-y-6">
                {/* Componentes del sistema */}
                <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <span className="bg-orange-100 p-2 rounded-full">
                          <Zap className="h-5 w-5 text-orange-500" />
                        </span>
                        Componentes del Sistema
                      </CardTitle>
                      <CardDescription>
                        Equipos de alta eficiencia recomendados para tu instalación solar
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Paneles solares con imagen */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {/* Buscar la sección del panel solar y modificar el estilo para que la imagen se muestre más grande */}
                            {/* Cambiar esto: */}
                            {/* <div className="md:w-1/3 bg-gradient-to-br from-orange-50 to-orange-100 p-6 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-48 mb-4">
                                  <Image
                                    src="/images/panel-front.png"
                                    alt="Panel Solar LONGi Hi-MO 6 585W"
                                    fill
                                    className="object-contain"
                                    priority
                                  />
                                </div>
                              </div>
                            </div> */}

                            {/* Reemplazar por esto (reduciendo el padding y ajustando el tamaño de la imagen): */}
                            <div className="md:w-1/3 bg-gradient-to-br from-orange-50 to-orange-100 p-2 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-56 mb-2">
                                  <Image
                                    src="/images/panel-front.png"
                                    alt="Panel Solar LONGi Hi-MO 6 585W"
                                    fill
                                    className="object-contain scale-110"
                                    priority
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="space-y-4">
                                {/* Update here */}
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Marca y Modelo</span>
                                  <span className="font-medium text-gray-800">LONGi o ERASolar</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Potencia Total</span>
                                  <span className="font-medium text-gray-800">{propuesta.sistema.tamano} kW</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Cantidad de Paneles</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.paneles} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Potencia por Panel</span>
                                  <span className="font-medium text-gray-800">{propuesta.sistema.potenciaPanel}W</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Eficiencia</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.eficienciaPanel}%
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Área Requerida</span>
                                  <span className="font-medium text-gray-800">{propuesta.sistema.espacioTecho} m²</span>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-gray-600">Garantía</span>
                                  <span className="font-medium text-green-600 flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    30 años
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Inversores con imagen */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {/* Ahora buscar la sección del microinversor y actualizar la ruta de la imagen */}
                            {/* Cambiar esto: */}
                            {/* <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-48 mb-4">
                                  <Image
                                    src="/images/apsystems-microinverter.png"
                                    alt="Microinversor APsystems"
                                    fill
                                    className="object-contain"
                                    priority
                                  />
                                </div>
                              </div>
                            </div> */}

                            {/* Reemplazar por esto (usando la nueva imagen y ajustando el tamaño): */}
                            <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-2 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-56 mb-2">
                                  <Image
                                    src="/images/APsystems_DS3-2022-BC.png"
                                    alt="Microinversor APsystems DS3"
                                    fill
                                    className="object-contain scale-110"
                                    priority
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="space-y-4">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Marca y Modelo</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.marcaInversor} {propuesta.sistema.modeloInversor}
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Cantidad</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.inversores} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Tipo</span>
                                  <span className="font-medium text-gray-800">{propuesta.sistema.tipoInversor}</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Eficiencia</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.eficienciaInversor}%
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Detalle</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.detalle_inversores}
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-gray-600">Garantía</span>
                                  <span className="font-medium text-green-600 flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    12 años
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Estructura Solar */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-white p-2 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-56 mb-2">
                                  <Image
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Uranus-Solar-Tin-Roof-2kW-Main-Image-Rail.jpg-SFKsoxf0PjDtqSpgoRCPNFZjaduIyf.jpeg"
                                    alt="Estructura de Montaje Solar"
                                    fill
                                    className="object-contain scale-110"
                                    priority
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="space-y-4">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Tipo de Estructura</span>
                                  <span className="font-medium text-gray-800">Montaje para Techo Metálico</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Rieles de Aluminio</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 0.52)} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Abrazaderas Finales (End Clamp)</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 1.03)} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Abrazaderas Intermedias (Middle Clamp)</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 1.48)} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Pies en L (L Feet)</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 0.52 * 3)} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Tornillos y Tuercas</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 4)} juegos
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-gray-600">Garantía</span>
                                  <span className="font-medium text-green-600 flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    15 años
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                  </Card>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex flex-col justify-center">
                              <div className="text-center">
                                <div className="relative w-full h-56 mb-2 grid grid-cols-2 gap-2">
                                  <div className="relative">
                                    <Image
                                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cable-negro-ok-02-kSdcOzpWwkOb1ZAvpvnRC48ipzmbsj.webp"
                                      alt="Cable Solar con Conectores MC4"
                                      fill
                                      className="object-contain scale-110"
                                      priority
                                    />
                                  </div>
                                  <div className="relative">
                                    <Image
                                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cable-solar-19ZjBoJfpwMPXD2f5JySt2IESEN3XA.webp"
                                      alt="Cable de Tierra"
                                      fill
                                      className="object-contain scale-110"
                                      priority
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="space-y-4">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Tipo de Componentes</span>
                                  <span className="font-medium text-gray-800">Cableado y Conectores</span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Cable Solar</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 2 * 1.2)} metros (6mm²)
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Conectores MC4</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 2)} pares
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Cable de Tierra</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 0.5)} metros (10mm²)
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Canaletas y Tubería</span>
                                  <span className="font-medium text-gray-800">
                                    {Math.ceil(propuesta.sistema.paneles * 0.3)} metros
                                  </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                  <span className="text-gray-600">Caja de Combinación</span>
                                  <span className="font-medium text-gray-800">
                                    {propuesta.sistema.paneles > 10 ? Math.ceil(propuesta.sistema.paneles / 10) : 1} unidades
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-gray-600">Garantía</span>
                                  <span className="font-medium text-green-600 flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    10 años
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                  </Card>
                </TabsContent>

                {/* NUEVO TAB: Planes de Pago */}
                <TabsContent value="planes" className="space-y-6">
                  <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <span className="bg-orange-100 p-2 rounded-full">
                          <CreditCard className="h-5 w-5 text-orange-500" />
                        </span>
                        Planes de Pago
                      </CardTitle>
                      <CardDescription>Opciones de financiamiento para tu sistema solar personalizado</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="space-y-8">
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
                                Nuestro plan estándar divide el pago en tres abonos, permitiéndote distribuir la
                                inversión durante el proceso de instalación y puesta en marcha de tu sistema solar.
                              </p>

                              <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                                      1
                                    </div>
                                    <h4 className="font-medium text-gray-800">Abono Inicial (60%)</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Se realiza al firmar el contrato para iniciar el proceso de instalación.
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
                                    <h4 className="font-medium text-gray-800">Segundo Abono (30%)</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Se realiza cuando los equipos llegan a nuestras instalaciones.
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
                                    <h4 className="font-medium text-gray-800">Abono Final (10%)</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Se realiza al finalizar la instalación y verificar el funcionamiento.
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
                              <Button className="w-full bg-orange-500 hover:bg-orange-600">Seleccionar Plan</Button>
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
                                Nuestro plan financiado te permite realizar un abono inicial y pagar el resto en cuotas
                                mensuales durante 6 meses, facilitando la adquisición de tu sistema solar.
                              </p>

                              <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                                      1
                                    </div>
                                    <h4 className="font-medium text-gray-800">Abono Inicial (70%)</h4>
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
                                    <h4 className="font-medium text-gray-800">Saldo Pendiente (30%)</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Se divide en 6 cuotas mensuales iguales sin intereses.
                                  </p>
                                  <div className="text-xl font-bold text-blue-500">
                                    ${formatNumber(propuesta.precios.plan2.saldoPendiente)}
                                  </div>
                                </div>

                                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                                      <Clock className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <h4 className="font-medium text-gray-800">Cuota Mensual (x6)</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Pagos mensuales durante 6 meses consecutivos.
                                  </p>
                                  <div className="text-xl font-bold text-blue-500">
                                    ${formatNumber(propuesta.precios.plan2.cuotaMensual)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div>
                                  <span className="text-gray-600 font-medium">Inversión Total:</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                  ${formatNumber(propuesta.precios.plan2.total)}
                                </div>
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
                              <Button className="w-full bg-blue-500 hover:bg-blue-600">Seleccionar Plan</Button>
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
                                    60% (${formatNumber(propuesta.precios.plan1.abono1)})
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-100 text-center font-medium">
                                    70% (${formatNumber(propuesta.precios.plan2.abonoInicial)})
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b border-gray-100 text-gray-600">
                                    Pagos adicionales
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-100 text-center">
                                    2 pagos (30% y 10%)
                                  </td>
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
                                  <td className="py-3 px-4 border-b border-gray-100 text-center">
                                    Durante la instalación
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-100 text-center">6 meses</td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b border-gray-100 text-gray-600">Intereses</td>
                                  <td className="py-3 px-4 border-b border-gray-100 text-center text-green-500">
                                    Sin intereses
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-100 text-center text-green-500">
                                    Sin intereses
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b border-gray-100 text-gray-600 font-medium">
                                    Precio total
                                  </td>
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
                </TabsContent>

                <TabsContent value="financiero" className="space-y-6">
                  {/* Reemplazar el componente AnimatedSavingsChart con el nuevo FinancialDashboard */}
                  <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <span className="bg-blue-100 p-2 rounded-full">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                        </span>
                        Análisis Financiero
                      </CardTitle>
                      <CardDescription>Proyección de ahorro e inversión a 25 años</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      {/* Reemplazar AnimatedSavingsChart y SavingsComparisonChart con FinancialDashboard */}
                      <FinancialDashboard
                        annualSavings={propuesta.financiero.ahorroAnual}
                        monthlyConsumption={propuesta.cliente.consumo}
                        electricityRate={0.26}
                        totalYears={25}
                        formatNumber={formatNumber}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ambiental" className="space-y-6">
                  {/* Impacto ambiental */}
                  <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <span className="bg-green-100 p-2 rounded-full">
                          <TreePine className="h-5 w-5 text-green-500" />
                        </span>
                        Impacto Ambiental
                      </CardTitle>
                      <CardDescription>Beneficios ambientales de tu sistema solar</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Tarjetas de impacto */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
                              <TreePine className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Reducción de CO₂</h3>
                            <div className="text-3xl font-bold text-green-600 mb-1">
                              {propuesta.ambiental.co2Reducido} ton/año
                            </div>
                            <p className="text-sm text-gray-600">
                              {propuesta.ambiental.co2Reducido * 25} toneladas en 25 años
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
                              <Lightbulb className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Energía Limpia</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {formatNumber(propuesta.produccion.anual)} kWh/año
                            </div>
                            <p className="text-sm text-gray-600">
                              Equivalente al consumo de {Math.floor(propuesta.produccion.anual / 3000)} hogares
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 text-white mb-4">
                              <DollarSign className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Petróleo Ahorrado</h3>
                            <div className="text-3xl font-bold text-orange-600 mb-1">
                              {propuesta.ambiental.petroleoReducido} gal/año
                            </div>
                            <p className="text-sm text-gray-600">
                              {propuesta.ambiental.petroleoReducido * 25} galones en 25 años
                            </p>
                          </div>
                        </div>

                        {/* Equivalencias ambientales */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-6">Equivalencias Ambientales</h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-xl border border-green-100">
                              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm mb-4">
                                <TreePine className="h-8 w-8 text-green-500" />
                              </div>
                              <h4 className="font-bold text-gray-800 mb-2">Árboles Plantados</h4>
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {Math.floor(propuesta.ambiental.co2Reducido * 45)}
                              </div>
                              <p className="text-sm text-gray-600">Equivalente en absorción de CO₂ por 10 años</p>
                            </div>

                            <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm mb-4">
                                <Car className="h-8 w-8 text-blue-500" />
                              </div>
                              <h4 className="font-bold text-gray-800 mb-2">Kilómetros No Recorridos</h4>
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {formatNumber(Math.floor(propuesta.ambiental.co2Reducido * 4000))}
                              </div>
                              <p className="text-sm text-gray-600">Equivalente en emisiones de un automóvil</p>
                            </div>

                            <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm mb-4">
                                <Home className="h-8 w-8 text-orange-500" />
                              </div>
                              <h4 className="font-bold text-gray-800 mb-2">Hogares Alimentados</h4>
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {Math.floor(propuesta.produccion.anual / 3000)}
                              </div>
                              <p className="text-sm text-gray-600">Equivalente en consumo eléctrico anual</p>
                            </div>
                          </div>

                          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                              <div className="md:w-1/4 flex justify-center">
                                <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full shadow-sm">
                                  <Award className="h-12 w-12 text-green-500" />
                                </div>
                              </div>

                              <div className="md:w-3/4">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Certificado Verde</h4>
                                <p className="text-gray-600 mb-4">
                                  Tu sistema solar contribuye significativamente a la reducción de emisiones de CO₂ y al
                                  cuidado del medio ambiente. Recibirás un certificado que acredita tu compromiso con la
                                  sostenibilidad.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Certificado incluido con tu instalación</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
  </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-orange-500" />
              <span className="font-bold text-xl text-gray-800">
                Solar<span className="text-orange-500">Mente</span>
                <span className="text-orange-500 font-light">.IA</span>
              </span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">© 2024 SolarMente.IA. Todos los derechos reservados.</p>
              <p className="text-xs text-gray-400 mt-1">
                Propuesta generada con IA - ID:
  params.id ? params.id.substring(0, 8) : ""
  </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
