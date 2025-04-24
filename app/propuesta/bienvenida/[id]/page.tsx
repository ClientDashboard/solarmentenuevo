"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { obtenerCotizacion } from "@/lib/supabase"
import type { ProposalData } from "@/lib/types"
import { Loader2, Sun, ArrowRight, Zap, DollarSign, TreePine, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function BienvenidaPage() {
  const params = useParams()
  const router = useRouter()
  const [propuesta, setPropuesta] = useState<ProposalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [animateCounter, setAnimateCounter] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const [currentMonthlySavings, setCurrentMonthlySavings] = useState(0)
  const [currentCO2, setCurrentCO2] = useState(0)

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

        setPropuesta(data.propuesta_data)
      } catch (err) {
        console.error("Error al cargar la propuesta:", err)
        setError("Ocurrió un error al cargar los resultados")
      } finally {
        setLoading(false)
      }
    }

    cargarPropuesta()
  }, [params])

  // Animación de contador
  useEffect(() => {
    if (propuesta && !animateCounter) {
      setAnimateCounter(true)
      const targetAhorro = propuesta.financiero.ahorroAnual
      const targetMonthlySavings = propuesta.financiero.ahorroMensual
      const targetCO2 = propuesta.ambiental.co2Reducido
      const duration = 2000 // 2 segundos
      const steps = 60
      const incrementAnual = targetAhorro / steps
      const incrementMensual = targetMonthlySavings / steps
      const incrementCO2 = targetCO2 / steps
      let current = 0
      let currentMonthly = 0
      let currentCO2Value = 0
      let step = 0

      const interval = setInterval(() => {
        step++
        current = Math.min(targetAhorro, Math.round(incrementAnual * step))
        currentMonthly = Math.min(targetMonthlySavings, Math.round(incrementMensual * step))
        currentCO2Value = Math.min(targetCO2, Math.round(incrementCO2 * step * 10) / 10)

        setCurrentCount(current)
        setCurrentMonthlySavings(currentMonthly)
        setCurrentCO2(currentCO2Value)

        if (step >= steps) {
          clearInterval(interval)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [propuesta, animateCounter])

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleVerPropuesta = () => {
    try {
      if (params.id) {
        router.push(`/propuesta/${params.id}`)
      } else {
        console.error("No proposal ID available")
        toast({
          title: "Error",
          description: "No se pudo encontrar el ID de la propuesta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Navigation error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al navegar a la propuesta",
        variant: "destructive",
      })
    }
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
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Preparando tu propuesta solar</h2>
            <p className="text-gray-500 max-w-md">Estamos generando una propuesta personalizada para ti...</p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse-x"></div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Cargando datos</span>
                <span>Generando propuesta</span>
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

  // Extraer el primer nombre para un saludo más personal
  const firstName = propuesta.cliente.nombre.split(" ")[0]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-36">
            <Image src="/images/logo.png" alt="SolarMente Logo" fill className="object-contain" />
          </div>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                ¡Hola, <span className="text-orange-100">{firstName}!</span>
              </h1>
              <p className="text-orange-50 text-lg">Tu propuesta solar personalizada está lista.</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white mb-3">
                    <Zap className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Ahorro Mensual</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${formatNumber(propuesta.financiero.ahorroMensual)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mb-3">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Ahorro Anual</p>
                  <p className="text-2xl font-bold text-gray-800">${formatNumber(propuesta.financiero.ahorroAnual)}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-3">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">ROI</p>
                  <p className="text-2xl font-bold text-gray-800">{propuesta.sistema.roi} años</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Hemos diseñado un sistema solar de{" "}
                  <span className="font-semibold">{propuesta.sistema.tamano} kW</span> con{" "}
                  <span className="font-semibold">{propuesta.sistema.paneles} paneles</span> optimizado para tu consumo.
                </p>
              </div>

              <Button
                onClick={handleVerPropuesta}
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 group"
              >
                <span>VER PROPUESTA COMPLETA</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 relative z-10">
        <p>© 2024 SolarMente.IA. Todos los derechos reservados.</p>
      </footer>

      {/* Estilos adicionales para animaciones */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0px, 0px); }
          33% { transform: scale(1.1) translate(30px, -30px); }
          66% { transform: scale(0.9) translate(-30px, 30px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
