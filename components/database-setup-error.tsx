"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sun, AlertTriangle, Copy, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DatabaseSetupError({ error }: { error: string }) {
  const [sqlSetup, setSqlSetup] = useState<{ sql: string; instructions: string[] } | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSqlSetup() {
      try {
        const response = await fetch("/api/sql-setup")
        const data = await response.json()
        setSqlSetup(data)
      } catch (err) {
        console.error("Error fetching SQL setup:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSqlSetup()
  }, [])

  const copyToClipboard = () => {
    if (sqlSetup?.sql) {
      navigator.clipboard.writeText(sqlSetup.sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <Sun className="h-6 w-6 text-orange-500" />
          <span>SolarMente.IA</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-3xl bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white">Configuración de Base de Datos Requerida</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Es necesario crear las tablas en la base de datos de Supabase antes de continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg">
                <p className="text-red-300">{error || "Las tablas necesarias no existen en la base de datos"}</p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Cargando instrucciones...</p>
                </div>
              ) : sqlSetup ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Sigue estos pasos para crear las tablas:</h3>
                    <ol className="space-y-2 pl-5 list-decimal text-gray-300">
                      {sqlSetup.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-2">SQL para crear las tablas:</h3>
                    <div className="relative">
                      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-gray-300 text-sm">
                        {sqlSetup.sql}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    No se pudieron cargar las instrucciones. Por favor, intenta recargar la página.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
            <Link href="/">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600">
              Intentar nuevamente
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
