"use client"

import { useState } from "react"
import {
  Award,
  Car,
  Download,
  Factory,
  Leaf,
  Lightbulb,
  Mountain,
  Sprout,
  TreePine,
  Wind,
  X,
  Zap,
  Home,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface AmbientalProps {
  propuesta: any
  formatNumber: (num: number) => string
}

export default function Ambiental({ propuesta, formatNumber }: AmbientalProps) {
  // Calcular árboles plantados equivalentes (45 árboles por tonelada de CO2)
  const arbolesPlantados = Math.floor(propuesta.ambiental.co2Reducido * 45)

  // Calcular kilómetros no recorridos (4000 km por tonelada de CO2)
  const kilometrosNoRecorridos = Math.floor(propuesta.ambiental.co2Reducido * 4000)

  const [showCertificateModal, setShowCertificateModal] = useState(false)

  return (
    <Card className="overflow-hidden border-gray-200 shadow-lg animate-on-scroll">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <span className="bg-green-100 p-2 rounded-full">
            <TreePine className="h-5 w-5 text-green-500" />
          </span>
          Impacto Ambiental
        </CardTitle>
        <p className="text-gray-500">Contribución a la sostenibilidad y reducción de emisiones de CO2</p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Tarjetas de impacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
                <TreePine className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Reducción de CO₂</h3>
              <div className="text-3xl font-bold text-green-600 mb-1">{propuesta.ambiental.co2Reducido} ton/año</div>
              <p className="text-sm text-gray-600">{propuesta.ambiental.co2Reducido * 25} toneladas en 25 años</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
                <TreePine className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Árboles Equivalentes</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">{arbolesPlantados}</div>
              <p className="text-sm text-gray-600">Equivalente a plantar {arbolesPlantados} árboles</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 text-white mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Kilómetros Ahorrados</h3>
              <div className="text-3xl font-bold text-orange-600 mb-1">{formatNumber(kilometrosNoRecorridos)} km</div>
              <p className="text-sm text-gray-600">
                Equivalente a no recorrer {formatNumber(kilometrosNoRecorridos)} km en auto
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
                <div className="text-2xl font-bold text-green-600 mb-1">{arbolesPlantados}</div>
                <p className="text-sm text-gray-600">Equivalente en absorción de CO₂ por 10 años</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm mb-4">
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Kilómetros No Recorridos</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{formatNumber(kilometrosNoRecorridos)}</div>
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

            <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute w-28 h-28 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <Award className="h-14 w-14 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="md:w-3/4 text-center md:text-left">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Certificado Verde</h4>
                  <p className="text-gray-600 mb-4">
                    Tu sistema solar contribuye significativamente a la reducción de emisiones de CO₂ y al cuidado del
                    medio ambiente. Recibirás un certificado personalizado que acredita tu compromiso con la
                    sostenibilidad.
                  </p>
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <Award className="h-4 w-4" />
                    <span>Ver Certificado</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal del Certificado Verde */}
            {showCertificateModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-in fade-in duration-300">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-500" />
                      Certificado Verde
                    </h3>
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-200 rounded-lg p-8 relative overflow-hidden">
                      {/* Elementos decorativos */}
                      <div className="absolute top-0 left-0 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

                      {/* Logo en la esquina izquierda */}
                      <div className="absolute top-6 left-6">
                        <div className="relative w-48 h-24">
                          <Image
                            src="/images/logo.png"
                            alt="SolarMente Logo"
                            width={192}
                            height={96}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Sello */}
                      <div className="absolute top-6 right-6">
                        <div className="relative w-24 h-24">
                          <div className="absolute inset-0 bg-green-100 rounded-full"></div>
                          <div className="absolute inset-2 border-2 border-dashed border-green-500 rounded-full flex items-center justify-center">
                            <TreePine className="h-10 w-10 text-green-600" />
                          </div>
                        </div>
                      </div>

                      {/* Contenido del certificado */}
                      <div className="text-center mb-6 mt-16">
                        <h4 className="text-2xl font-bold text-green-800 mb-1">CERTIFICADO VERDE</h4>
                        <p className="text-sm text-green-600">COMPROMISO CON LA SOSTENIBILIDAD</p>
                      </div>

                      <div className="mb-8 text-center">
                        <p className="text-lg text-gray-700 mb-2">Se certifica que</p>
                        <p className="text-2xl font-bold text-gray-800 mb-2">{propuesta.cliente.nombre || "Cliente"}</p>
                        <p className="text-lg text-gray-700">
                          contribuye activamente a la protección del medio ambiente mediante la instalación de un
                          sistema de energía solar de <span className="font-bold">{propuesta.sistema.tamano} kW</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm">
                          <TreePine className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Equivalente a plantar</p>
                          <p className="text-xl font-bold text-green-600">
                            {Math.floor(propuesta.ambiental.co2Reducido * 45)} árboles
                          </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm">
                          <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Reducción anual de CO₂</p>
                          <p className="text-xl font-bold text-blue-600">{propuesta.ambiental.co2Reducido} ton</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm">
                          <Car className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Equivale a no recorrer</p>
                          <p className="text-xl font-bold text-orange-600">
                            {formatNumber(Math.floor(propuesta.ambiental.co2Reducido * 4000))} km
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                          Este certificado reconoce el compromiso con un futuro más sostenible y la contribución a la
                          reducción de la huella de carbono global.
                        </p>

                        <div className="flex justify-center items-center gap-8 mt-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Fecha de emisión</p>
                            <p className="font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
                          </div>

                          <div className="h-16 w-32 relative">
                            <Image
                              src="/images/firma-digital.png"
                              alt="Firma Digital"
                              fill
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCAxMCBDIDMwIDIwLCA3MCAxNSwgOTAgMzUgUyAxNDAgMjUsIDE5MCAyMCIgc3Ryb2tlPSIjMjIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4="
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowCertificateModal(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors mr-2"
                      >
                        Cerrar
                      </button>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar Certificado
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Beneficios Ambientales Adicionales */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-green-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Beneficios Ambientales Adicionales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-3 rounded-xl shadow-sm">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Reducción de combustibles fósiles</h4>
                    <p className="text-gray-600 text-sm">
                      Al generar tu propia energía, disminuyes la necesidad de utilizar fuentes de energía contaminantes
                      y reduces la dependencia de combustibles fósiles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 rounded-xl shadow-sm">
                    <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Aire más limpio y saludable</h4>
                    <p className="text-gray-600 text-sm">
                      La energía solar no produce emisiones nocivas ni contaminantes, contribuyendo a un aire más limpio
                      y un entorno más saludable para todos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3 rounded-xl shadow-sm">
                    <Mountain className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Conservación de recursos naturales</h4>
                    <p className="text-gray-600 text-sm">
                      Al utilizar energía solar, ayudas a preservar los recursos naturales no renovables y reduces la
                      presión sobre los ecosistemas vulnerables.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-3 rounded-xl shadow-sm">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Futuro sostenible</h4>
                    <p className="text-gray-600 text-sm">
                      Contribuyes activamente a un futuro más sostenible al adoptar una fuente de energía limpia y
                      renovable, inspirando a otros a seguir tu ejemplo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-3 rounded-full shadow-sm">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">¿Sabías que?</h4>
                  <p className="text-gray-600">
                    Un sistema solar como el tuyo, de {propuesta.sistema.tamano} kW, durante sus 25 años de vida útil
                    evitará la emisión de aproximadamente{" "}
                    <span className="font-bold text-green-600">
                      {(propuesta.ambiental.co2Reducido * 25).toFixed(1)} toneladas de CO₂
                    </span>
                    , equivalente a plantar{" "}
                    <span className="font-bold text-green-600">
                      {Math.floor(propuesta.ambiental.co2Reducido * 45 * 25)} árboles
                    </span>{" "}
                    o retirar{" "}
                    <span className="font-bold text-green-600">
                      {Math.floor((propuesta.ambiental.co2Reducido * 25) / 4.6)} vehículos
                    </span>{" "}
                    de circulación durante un año.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
