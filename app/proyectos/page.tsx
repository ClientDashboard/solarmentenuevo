"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sun, ArrowLeft, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Estructura de datos para los proyectos
interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  tipo: string
  potencia: string
  imagenes: string[]
  ahorro: string
}

// Componente para visualizar un proyecto individual
const ProyectoCard = ({ proyecto }: { proyecto: Proyecto }) => {
  const [showGallery, setShowGallery] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openGallery = () => {
    setCurrentImageIndex(0)
    setShowGallery(true)
    // Bloquear scroll cuando se abre la galería
    document.body.style.overflow = "hidden"
  }

  const closeGallery = () => {
    setShowGallery(false)
    // Restaurar scroll cuando se cierra la galería
    document.body.style.overflow = "auto"
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={openGallery}>
        {proyecto.imagenes.length > 0 ? (
          <Image
            src={proyecto.imagenes[0] || "/placeholder.svg"}
            alt={proyecto.titulo}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
        {proyecto.imagenes.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            +{proyecto.imagenes.length - 1} fotos
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">{proyecto.titulo}</h3>
          <span className="text-xs font-medium bg-orange-500 text-white px-3 py-1 rounded-full whitespace-nowrap">
            {proyecto.potencia}
          </span>
        </div>
        <div className="h-16 mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{proyecto.descripcion}</p>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Ahorro mensual:</span>
            <span className="font-bold text-green-500">{proyecto.ahorro}</span>
          </div>
          <button
            onClick={openGallery}
            className="w-full text-orange-500 hover:text-white inline-flex items-center justify-center text-sm font-medium py-2 border border-orange-500 rounded-lg hover:bg-orange-500 transition-all duration-300"
          >
            Ver galería de fotos
            <Search className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Galería de imágenes modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="absolute top-4 right-4">
            <button
              onClick={closeGallery}
              className="text-white hover:text-orange-500 transition-colors p-2 rounded-full bg-black/20 backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button
              onClick={prevImage}
              className="text-white hover:text-orange-500 transition-colors p-2 rounded-full bg-black/20 backdrop-blur-sm"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button
              onClick={nextImage}
              className="text-white hover:text-orange-500 transition-colors p-2 rounded-full bg-black/20 backdrop-blur-sm"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={proyecto.imagenes[currentImageIndex] || "/placeholder.svg"}
              alt={`${proyecto.titulo} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              <span className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {proyecto.imagenes.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Página principal de proyectos
export default function ProyectosPage() {
  // Datos de ejemplo - estos serán reemplazados con las imágenes que envíe el usuario
  const proyectos: Proyecto[] = [
    {
      id: "dsv",
      titulo: "Proyecto Comercial - DSV",
      descripcion: "367 paneles solares de última generación con sistema de monitoreo en tiempo real.",
      tipo: "comercial",
      potencia: "218.36 kW",
      imagenes: [
        "/images/dsv-solar-project.png",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      ahorro: "$4,500",
    },
    {
      id: "sunsave",
      titulo: "Proyecto Comercial - SUNSAVE",
      descripcion: "168 paneles solares de última generación con sistema de monitoreo en tiempo real.",
      tipo: "comercial",
      potencia: "98.28 kW",
      imagenes: [
        "/images/sunsave-solar-project.png",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      ahorro: "$2,800",
    },
    {
      id: "hotel-lacubana",
      titulo: "Proyecto Comercial - HOTEL LA CUBANA",
      descripcion: "150 paneles solares con sistema de monitoreo inteligente vía app móvil.",
      tipo: "comercial",
      potencia: "87.75 kW",
      imagenes: [
        "/images/hotel-lacubana-solar-project.png",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      ahorro: "$2,500",
    },
    {
      id: "santa-maria",
      titulo: "Casa - Santa Maria",
      descripcion: "40 paneles solares",
      tipo: "residencial",
      potencia: "15.34 kW",
      imagenes: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
      ahorro: "$450",
    },
  ]

  // Filtros para los proyectos
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)

  // Filtrar proyectos según el tipo seleccionado
  const proyectosFiltrados = filtroTipo ? proyectos.filter((proyecto) => proyecto.tipo === filtroTipo) : proyectos

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-xl">
                Solar<span className="text-orange-500">Mente</span>
                <span className="text-orange-500 font-light">.AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#beneficios" className="text-gray-600 hover:text-orange-500 transition-colors">
                Beneficios
              </Link>
              <Link href="/#tecnologia" className="text-gray-600 hover:text-orange-500 transition-colors">
                Tecnología IA
              </Link>
              <Link href="/proyectos" className="text-orange-500 font-medium">
                Proyectos
              </Link>
              <Link href="/#instalacion" className="text-gray-600 hover:text-orange-500 transition-colors">
                Instalación
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/cotizador"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cotizador IA
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al inicio</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Proyectos</h1>
            <p className="text-xl text-white/90">
              Descubre nuestras instalaciones solares en residencias y comercios. Cada proyecto representa ahorro
              energético y compromiso con el medio ambiente.
            </p>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white/10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 transform skew-x-12"></div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filtroTipo === null ? "default" : "outline"}
              onClick={() => setFiltroTipo(null)}
              className={filtroTipo === null ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Todos
            </Button>
            <Button
              variant={filtroTipo === "residencial" ? "default" : "outline"}
              onClick={() => setFiltroTipo("residencial")}
              className={filtroTipo === "residencial" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Residenciales
            </Button>
            <Button
              variant={filtroTipo === "comercial" ? "default" : "outline"}
              onClick={() => setFiltroTipo("comercial")}
              className={filtroTipo === "comercial" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Comerciales
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectosFiltrados.map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>

        {proyectosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron proyectos con los filtros seleccionados.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="h-8 w-8 text-orange-500" />
                <span className="font-bold text-xl text-gray-800">
                  Solar<span className="text-orange-500">Mente</span>
                  <span className="text-orange-500 font-light">.AI</span>
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Primera empresa en Panamá en integrar IA para diseñar sistemas solares personalizados en segundos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/cotizador" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Cotizador IA
                  </Link>
                </li>
                <li>
                  <Link href="/proyectos" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Proyectos
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Nosotros</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#beneficios" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Beneficios
                  </Link>
                </li>
                <li>
                  <Link href="/#tecnologia" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Tecnología IA
                  </Link>
                </li>
                <li>
                  <Link href="/#instalacion" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Instalación
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terminos" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} SolarMente.AI. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
