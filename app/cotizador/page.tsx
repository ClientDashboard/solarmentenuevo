"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Sun,
  Loader2,
  CheckCircle,
  Sparkles,
  Zap,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Building2,
  BatteryCharging,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { DatabaseSetupError } from "@/components/database-setup-error"
import SolarElementsAnimation from "@/components/solar-elements-animation"
import SolarPanelsBackground from "@/components/solar-panels-background"

const PROVINCIAS = [
  "Bocas del Toro",
  "Chiriquí",
  "Coclé",
  "Colón",
  "Darién",
  "Herrera",
  "Los Santos",
  "Panamá",
  "Panamá Oeste",
  "Veraguas",
  "Emberá-Wounaan",
  "Guna Yala",
  "Ngäbe-Buglé",
]

export default function CotizadorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [animateBackground, setAnimateBackground] = useState(false)
  // Modificar el estado inicial para tener un string vacío en consumo
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ubicacion: "Panamá",
    tipoPropiedad: "residencial",
    faseElectrica: "monofasico",
    consumo: "", // Cambiado a string vacío
  })

  // Referencia para controlar las animaciones entre pasos
  const stepContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Activar animación del fondo después de cargar la página
    setAnimateBackground(true)

    // Efecto de entrada para el formulario
    const timer = setTimeout(() => {
      document.querySelector(".form-container")?.classList.add("form-visible")
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Reemplazar la función handleConsumoChange con esta nueva versión
  const handleConsumoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Eliminar todas las comas y caracteres no numéricos
    const rawValue = e.target.value.replace(/[^\d]/g, "")

    // Actualizar el estado con el valor ingresado (como string)
    setFormData((prev) => ({ ...prev, consumo: rawValue }))
  }

  // Reemplazar la función validateStep para validar el consumo en el paso 3
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.nombre.trim()) {
        toast({
          title: "Campo requerido",
          description: "Por favor ingresa tu nombre completo",
          variant: "destructive",
        })
        return false
      }
    } else if (step === 2) {
      if (!formData.telefono.trim() || !/^\d{8}$/.test(formData.telefono)) {
        toast({
          title: "Teléfono inválido",
          description: "Por favor ingresa un número de teléfono válido (8 dígitos)",
          variant: "destructive",
        })
        return false
      }
      if (!formData.email.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        toast({
          title: "Email inválido",
          description: "Por favor ingresa un email válido",
          variant: "destructive",
        })
        return false
      }
    } else if (step === 3) {
      // Validar el consumo al pasar al siguiente paso
      const consumoValue = formData.consumo ? Number.parseInt(formData.consumo, 10) : 0

      if (!formData.consumo || consumoValue < 1500) {
        toast({
          title: "Consumo inválido",
          description: "El consumo mínimo debe ser 1,500 kWh",
          variant: "destructive",
        })
        return false
      }

      if (consumoValue > 40000) {
        toast({
          title: "Consumo inválido",
          description: "El consumo máximo debe ser 40,000 kWh",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  // Buscar la función nextStep y reemplazarla con esta versión mejorada
  const nextStep = () => {
    // Proporcionar feedback visual inmediato
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      // Añadir clase para efecto visual inmediato
      button.classList.add("processing")

      // Desactivar temporalmente el botón para evitar múltiples clics
      button.disabled = true
    }

    // Validar el paso actual
    if (validateStep(activeStep)) {
      // Añadir clase para animación de salida inmediatamente
      if (stepContentRef.current) {
        stepContentRef.current.classList.add("step-exit")
      }

      // Reducir el tiempo de espera para la transición
      setTimeout(() => {
        setActiveStep(activeStep + 1)
        // Eliminar la clase de animación después de cambiar el paso
        setTimeout(() => {
          if (stepContentRef.current) {
            stepContentRef.current.classList.remove("step-exit")
          }
          // Restaurar el botón
          if (button) {
            button.classList.remove("processing")
            button.disabled = false
          }
        }, 50)
      }, 200) // Reducido de 300ms a 200ms para una transición más rápida
    } else {
      // Si la validación falla, restaurar el botón
      if (button) {
        button.classList.remove("processing")
        button.disabled = false
      }
    }
  }

  // Buscar la función prevStep y reemplazarla con esta versión mejorada
  const prevStep = () => {
    // Proporcionar feedback visual inmediato
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      // Añadir clase para efecto visual inmediato
      button.classList.add("processing")

      // Desactivar temporalmente el botón para evitar múltiples clics
      button.disabled = true
    }

    // Añadir clase para animación de salida inmediatamente
    if (stepContentRef.current) {
      stepContentRef.current.classList.add("step-exit")
    }

    // Reducir el tiempo de espera para la transición
    setTimeout(() => {
      setActiveStep(activeStep - 1)
      // Eliminar la clase de animación después de cambiar el paso
      setTimeout(() => {
        if (stepContentRef.current) {
          stepContentRef.current.classList.remove("step-exit")
        }
        // Restaurar el botón
        if (button) {
          button.classList.remove("processing")
          button.disabled = false
        }
      }, 50)
    }, 200) // Reducido de 300ms a 200ms para una transición más rápida
  }

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Modificar la función calculateSavings para manejar el string vacío
  const calculateSavings = (): number => {
    const tarifaPromedio = 0.26
    const consumoValue = formData.consumo ? Number.parseInt(formData.consumo, 10) : 0
    const ahorroMensual = consumoValue * tarifaPromedio
    return Math.round(ahorroMensual)
  }

  const estimatedSavings = calculateSavings()
  const [databaseSetupError, setDatabaseSetupError] = useState<string | null>(null)

  // Modificar la función handleSubmit para asegurar que el consumo esté dentro del rango
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar y ajustar el consumo antes de enviar
    let consumoFinal = formData.consumo ? Number.parseInt(formData.consumo, 10) : 1500

    if (consumoFinal < 1500) consumoFinal = 1500
    if (consumoFinal > 40000) consumoFinal = 40000

    // Actualizar el estado con el valor final
    setFormData((prev) => ({ ...prev, consumo: consumoFinal.toString() }))

    if (!validateStep(activeStep)) return

    setIsSubmitting(true)
    try {
      const telefonoFormatted = `+507 ${formData.telefono}`

      console.log("Submitting form data:", {
        ...formData,
        telefono: telefonoFormatted,
        consumo: consumoFinal, // Usar el valor validado
      })

      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: telefonoFormatted,
          ubicacion: formData.ubicacion,
          consumo: consumoFinal, // Usar el valor validado
          tipoPropiedad: formData.tipoPropiedad,
          faseElectrica: formData.faseElectrica,
        }),
      })

      const data = await response.json()
      console.log("Response from API:", data)

      if (!response.ok) {
        // Check if this is a database setup error
        if (data.sqlSetupUrl) {
          // Render the database setup error page
          setDatabaseSetupError(data.message || "Es necesario configurar la base de datos")
          return
        }

        throw new Error(data?.error || data?.message || "Error al procesar la solicitud")
      }

      // Redirigir al usuario a la propuesta
      // Buscar la función handleSubmit y revisar la línea de redirección
      // Cambiar esta línea:
      //router.push(`/propuesta/bienvenida/${data.solicitudId}`)

      // Por esta línea (asegurando que la ruta sea correcta):
      router.push(`/propuesta/${data.solicitudId}`)
    } catch (error: any) {
      console.error("Error en handleSubmit:", error)
      toast({
        title: "Error",
        description: `Hubo un error al procesar tu solicitud: ${error.message || "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (databaseSetupError) {
    return <DatabaseSetupError error={databaseSetupError} />
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-white to-gray-50">
      {/* Elementos animados de fondo */}
      <div
        className={`absolute inset-0 overflow-hidden ${animateBackground ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      >
        {/* Fondo con paneles solares y símbolos animados */}
        <SolarPanelsBackground density={4} />

        {/* Elementos solares flotantes */}
        <SolarElementsAnimation numberOfElements={40} />

        {/* Elementos decorativos mínimos */}
        <div className="absolute top-1/2 right-1/3 w-8 h-8 opacity-20">
          <Sun className="w-full h-full text-orange-500 animate-pulse-slow" />
        </div>
      </div>

      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <Sun className="h-6 w-6 text-orange-500" />
          <span>SolarMente.IA</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="form-container opacity-0 transform translate-y-8 transition-all duration-700 ease-out w-full max-w-md">
          <Card className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl overflow-hidden rounded-2xl">
            {/* Efectos de luz en las esquinas */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-[50px]"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[50px]"></div>

            <CardHeader className="relative z-10 border-b border-gray-100 pb-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-gray-800 text-xl">Cotizador Solar Inteligente</CardTitle>
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      IA
                    </span>
                  </div>
                  <CardDescription className="text-gray-500">
                    {activeStep < 4 ? `Paso ${activeStep} de 3` : "Revisar datos"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Barra de progreso mejorada */}
            <div className="relative h-1.5 w-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700 ease-out"
                style={{ width: `${(activeStep / 3) * 100}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-white/50 animate-shimmer-slow"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 md:p-8 relative z-10 text-gray-800">
                <div ref={stepContentRef} className="step-content transition-all duration-300 ease-out">
                  {activeStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl mx-auto mb-4 shadow-lg shadow-orange-500/20 transform hover:rotate-6 transition-transform">
                          <User className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Comencemos!</h2>
                        <p className="text-gray-500 mt-1">Tu propuesta personalizada en segundos</p>
                      </div>

                      <div className="group">
                        <Label htmlFor="nombre" className="text-gray-700 font-medium flex items-center gap-2 text-base">
                          <User className="h-4 w-4 text-orange-500" />
                          Nombre Completo
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="bg-white border-gray-200 focus:border-orange-500 focus:ring focus:ring-orange-500/20 text-gray-800 placeholder:text-gray-400 transition-all pl-10"
                            placeholder="Escribe tu nombre completo"
                            autoFocus
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {/* Imagen decorativa */}
                      <div className="mt-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-xl"></div>
                        <Image
                          src="/images/aerial-solar-homes.png"
                          alt="Comunidad con Paneles Solares"
                          width={800}
                          height={600}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                          <p className="text-white text-sm font-medium">
                            Únete a la revolución solar y ahorra hasta un{" "}
                            <span className="text-orange-300 font-bold">100%</span> en tu factura eléctrica
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20 transform hover:rotate-6 transition-transform">
                          <Phone className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Datos de Contacto</h2>
                        <p className="text-gray-500 mt-1">¿Cómo podemos comunicarnos contigo?</p>
                      </div>

                      <div className="group">
                        <Label
                          htmlFor="telefono"
                          className="text-gray-700 font-medium flex items-center gap-2 text-base"
                        >
                          <Phone className="h-4 w-4 text-blue-500" />
                          Teléfono
                        </Label>
                        <div className="relative mt-2">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 text-sm">🇵🇦</span>
                            <span className="ml-1 text-gray-500">+507</span>
                          </div>
                          <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="bg-white border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-gray-800 placeholder:text-gray-400 transition-all pl-20"
                            placeholder="8 dígitos"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2 text-base">
                          <Mail className="h-4 w-4 text-blue-500" />
                          Email
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-white border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-gray-800 placeholder:text-gray-400 transition-all pl-10"
                            placeholder="correo@ejemplo.com"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <Label
                          htmlFor="ubicacion"
                          className="text-gray-700 font-medium flex items-center gap-2 text-base"
                        >
                          <MapPin className="h-4 w-4 text-blue-500" />
                          Provincia
                        </Label>
                        <div className="relative mt-2">
                          <select
                            id="ubicacion"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={(e) => handleSelectChange("ubicacion", e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500/20 text-gray-800"
                          >
                            {PROVINCIAS.map((provincia) => (
                              <option key={provincia} value={provincia}>
                                {provincia}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl mx-auto mb-4 shadow-lg shadow-green-500/20 transform hover:rotate-6 transition-transform">
                          <Home className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Detalles de Propiedad</h2>
                        <p className="text-gray-500 mt-1">Información para dimensionar tu sistema solar</p>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium flex items-center gap-2 text-base mb-3">
                          <Building2 className="h-4 w-4 text-green-500" />
                          Tipo de Propiedad
                        </Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div
                            className={`relative border-2 ${formData.tipoPropiedad === "residencial" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"} rounded-xl p-4 cursor-pointer transition-all duration-300 group overflow-hidden`}
                            onClick={() => handleSelectChange("tipoPropiedad", "residencial")}
                          >
                            {formData.tipoPropiedad === "residencial" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-5 w-5 text-orange-500" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center">
                              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 mb-3 group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                                <Home className="h-7 w-7 text-orange-500" />
                              </div>
                              <span className="font-medium text-gray-800">Residencial</span>
                            </div>
                          </div>

                          <div
                            className={`relative border-2 ${formData.tipoPropiedad === "comercial" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"} rounded-xl p-4 cursor-pointer transition-all duration-300 group overflow-hidden`}
                            onClick={() => handleSelectChange("tipoPropiedad", "comercial")}
                          >
                            {formData.tipoPropiedad === "comercial" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center">
                              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                                <Building2 className="h-7 w-7 text-blue-500" />
                              </div>
                              <span className="font-medium text-gray-800">Comercial</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium flex items-center gap-2 text-base mb-3">
                          <BatteryCharging className="h-4 w-4 text-green-500" />
                          Fase Eléctrica
                        </Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div
                            className={`relative border-2 ${formData.faseElectrica === "monofasico" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300 bg-white"} rounded-xl p-4 cursor-pointer transition-all duration-300 group overflow-hidden`}
                            onClick={() => handleSelectChange("faseElectrica", "monofasico")}
                          >
                            {formData.faseElectrica === "monofasico" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center">
                              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-3 group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                                <Zap className="h-7 w-7 text-green-500" />
                              </div>
                              <span className="font-medium text-gray-800">Monofásico</span>
                            </div>
                          </div>

                          <div
                            className={`relative border-2 ${formData.faseElectrica === "trifasico" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300 bg-white"} rounded-xl p-4 cursor-pointer transition-all duration-300 group overflow-hidden`}
                            onClick={() => handleSelectChange("faseElectrica", "trifasico")}
                          >
                            {formData.faseElectrica === "trifasico" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-5 w-5 text-purple-500" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center">
                              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-3 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                                <BatteryCharging className="h-7 w-7 text-purple-500" />
                              </div>
                              <span className="font-medium text-gray-800">Trifásico</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Modificar la parte del input de consumo en el paso 3 */}
                        {/* Buscar esta sección en el código: */}
                        <div className="flex justify-between items-end mb-3">
                          <Label className="text-gray-700 font-medium flex items-center gap-2 text-base">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            Consumo mensual (kWh)
                          </Label>
                          <span className="text-yellow-600 font-bold text-lg">
                            {formData.consumo ? `${formatNumber(Number.parseInt(formData.consumo, 10))} kWh` : ""}
                          </span>
                        </div>

                        <div className="bg-white border-2 border-gray-200 p-5 rounded-xl">
                          <div className="relative mb-3">
                            <div className="flex items-center">
                              <Input
                                id="consumo"
                                name="consumo"
                                type="text"
                                value={formData.consumo ? formatNumber(Number.parseInt(formData.consumo, 10)) : ""}
                                onChange={handleConsumoChange}
                                className="bg-white border-gray-200 focus:border-yellow-500 focus:ring focus:ring-yellow-500/20 text-gray-800 text-right pr-14 text-lg font-bold"
                                placeholder="Ingresa tu consumo"
                              />
                              <span className="absolute right-3 text-yellow-500 font-medium">kWh</span>
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500 mt-3">
                            <span className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                              Mínimo: 1,500 kWh
                            </span>
                            <span className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                              Máximo: 40,000 kWh
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-700">
                          <p className="flex items-start gap-2">
                            <span className="bg-blue-100 p-1 rounded-full mt-0.5">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                            </span>
                            <span>
                              <span className="font-medium">¿Dónde encuentro mi consumo?</span> Revisa en tu factura de
                              electricidad, donde se muestra el consumo mensual en kWh. Normalmente aparece como
                              "Consumo" o "kWh consumidos".
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl mx-auto mb-4 shadow-lg shadow-emerald-500/20 transform hover:rotate-6 transition-transform">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Todo listo!</h2>
                        <p className="text-gray-500 mt-1">Revisa tus datos y genera tu propuesta</p>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          <div className="col-span-2 border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Nombre</p>
                            <p className="font-medium text-gray-800">{formData.nombre}</p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Teléfono</p>
                            <p className="font-medium text-gray-800">+507 {formData.telefono}</p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-800 truncate">{formData.email}</p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Provincia</p>
                            <p className="font-medium text-gray-800">{formData.ubicacion}</p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Tipo de Propiedad</p>
                            <p className="font-medium text-gray-800 capitalize">{formData.tipoPropiedad}</p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Consumo mensual</p>
                            <p className="font-medium text-gray-800">
                              {formData.consumo
                                ? `${formatNumber(Number.parseInt(formData.consumo, 10))} kWh`
                                : "No especificado"}
                            </p>
                          </div>
                          <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs text-gray-500">Fase Eléctrica</p>
                            <p className="font-medium text-gray-800">
                              {formData.faseElectrica === "monofasico" ? "Monofásico" : "Trifásico"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 flex items-start gap-3">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-2 text-white shrink-0 mt-1 shadow-lg shadow-green-500/20">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-green-700 font-medium">Ahorro Estimado Preliminar</h4>
                          <p className="text-sm text-gray-700 mt-1 mb-2">
                            Basado en tu consumo de{" "}
                            <span className="font-semibold text-gray-800">
                              {formData.consumo
                                ? `${formatNumber(Number.parseInt(formData.consumo, 10))} kWh`
                                : "No especificado"}
                            </span>
                            , podrías ahorrar aproximadamente{" "}
                            <span className="font-bold text-green-600 text-lg">
                              ${formatNumber(estimatedSavings)}/mes
                            </span>
                            .
                          </p>
                          <div className="text-xs text-gray-500">
                            Recibirás un análisis financiero detallado en tu propuesta.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-6 md:px-8 py-5 border-t border-gray-200 bg-gray-50 flex justify-between">
                {activeStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Atrás
                    </span>
                    <span className="absolute inset-0 bg-gray-200/30 transform scale-x-0 origin-right transition-transform duration-300 ease-out btn-shine"></span>
                  </Button>
                )}

                {activeStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`${activeStep === 1 ? "w-full" : "ml-auto"} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center">
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </span>
                    <span className="absolute inset-0 bg-white/20 transform scale-x-0 origin-left transition-transform duration-300 ease-out btn-shine"></span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white relative overflow-hidden group shadow-lg shadow-green-500/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Generar Propuesta
                        <span className="absolute right-0 h-full w-12 -ml-2 bg-gradient-to-r from-transparent to-white/20 skew-x-[30deg] group-hover:animate-shimmer"></span>
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      {/* Estilos adicionales */}
      <style jsx global>{`
        /* Animaciones para el formulario */
        .form-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Animación para cambio de pasos */
        .step-exit {
          opacity: 0;
          transform: translateY(-10px);
        }
        
        /* Animaciones adicionales */
        @keyframes shimmer-slow {
          0% {
            transform: translateX(-100%) skewX(30deg);
          }
          100% {
            transform: translateX(200%) skewX(30deg);
          }
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        /* Animaciones para los elementos de fondo */
        .energy-wave {
          position: absolute;
          border-radius: 50%;
          border: 2px solid;
          transform: translate(-50%, -50%);
          animation: wave 4s ease-out forwards;
          pointer-events: none;
        }
        
        @keyframes wave {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
        
        .floating-icon {
          animation: float 15s ease-in-out infinite;
          opacity: 0.2;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(20px) rotate(-5deg);
          }
        }

        .btn-shine {
          transition: all 0.3s ease-out;
        }

        .btn-shine:hover {
          transform: scaleX(1);
        }

        /* Estilos para el efecto de brillo al hacer clic */
        .btn-shine {
          transform: scaleX(0);
        }

        button:active .btn-shine {
          transform: scaleX(1);
          transition: transform 0.2s ease-out;
        }

        /* Estilo para el estado de procesamiento */
        .processing {
          opacity: 0.8;
          pointer-events: none;
        }

        /* Reducir la duración de las animaciones de transición */
        .step-exit {
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease-out;
        }

        /* Mejorar la animación de entrada */
        .step-content {
          transition: all 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
