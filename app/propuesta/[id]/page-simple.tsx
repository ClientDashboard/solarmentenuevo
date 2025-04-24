"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { obtenerCotizacion } from "@/lib/supabase"
import { Sun, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProposalPage() {
  const params = useParams()
  const [propuesta, setPropuesta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
            <Sun className="h-6 w-6 text-orange-500" />
            <span>SolarMente.IA</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Cargando propuesta...</h2>
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
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-500">Error al cargar los resultados</CardTitle>
              <CardDescription>
                {error || "No se pudo generar la propuesta solar. Por favor intenta nuevamente."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cotizador">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al cotizador
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <Sun className="h-6 w-6 text-orange-500" />
          <span>SolarMente.IA</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/cotizador">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Propuesta Solar</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Propuesta Cargada Correctamente</CardTitle>
              <CardDescription>ID de la propuesta: {params.id ? params.id.substring(0, 8) : ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                La propuesta se ha cargado correctamente. Esta es una versión simplificada para solucionar el error.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">© 2024 SolarMente.IA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
