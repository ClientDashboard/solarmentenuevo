"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap, Shield, ArrowRight, ChevronDown, Sun, Sparkles, LineChart } from "lucide-react"
import SavingsShowcase from "@/components/savings-showcase"
import TypingAnimation from "@/components/typing-animation"

export default function Home() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [count, setCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const targetCount = 180 // Número de instalaciones
  const mainRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("")

  // Valores para la animación de inyección cero
  const [powerValues, setPowerValues] = useState({
    pv: 5.4,
    load: 5.5,
    grid: 0.1,
  })

  const [calculatedPower, setCalculatedPower] = useState(0)
  const [calculatedPanels, setCalculatedPanels] = useState(0)
  const [calculatedSavings, setCalculatedSavings] = useState(0)
  const [calculatedAnnualSavings, setCalculatedAnnualSavings] = useState(0)
  const [calculatedROI, setCalculatedROI] = useState(0)

  // Primero, añadamos estados adicionales para controlar la visibilidad de cada sección
  // Busca la sección donde se declaran los estados (cerca del inicio del componente) y añade:

  const [visibleSections, setVisibleSections] = useState({
    title: false,
    system: false,
    savings: false,
    roi: false,
    generating: false,
  })

  // Función openModal con useCallback para evitar recreaciones innecesarias
  const openModal = useCallback((projectId: string) => {
    // Guardar posición actual del scroll antes de abrir el modal
    const scrollPosition = window.scrollY

    // Añadir clase para bloquear scroll
    document.body.classList.add("modal-open")
    document.body.setAttribute("data-scroll", scrollPosition.toString())

    // Actualizar estado
    setCurrentProject(projectId)
    setModalOpen(true)
  }, [])

  // Función closeModal con useCallback
  const closeModal = useCallback(() => {
    // Restaurar scroll cuando se cierra el modal
    const scrollPosition = Number.parseInt(document.body.getAttribute("data-scroll") || "0")
    document.body.classList.remove("modal-open")
    window.scrollTo(0, scrollPosition)

    // Actualizar estado
    setModalOpen(false)
  }, [])

  // Funciones específicas para los manejadores de eventos de cada proyecto
  const handleOpenDsvModal = useCallback(() => {
    openModal("dsv")
  }, [openModal])

  const handleOpenCostaEsteModal = useCallback(() => {
    openModal("costa-este")
  }, [openModal])

  const handleOpenSantaMariaModal = useCallback(() => {
    openModal("santa-maria")
  }, [openModal])

  useEffect(() => {
    // Efecto para la animación inicial
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Detectar sección activa para animaciones
      const sections = document.querySelectorAll("section[id]")

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

    // Iniciar contador cuando estamos en la vista correcta
    const counterInterval = setInterval(() => {
      setCount((prev) => {
        const increment = Math.ceil(targetCount / 30)
        const newValue = prev + increment
        if (newValue >= targetCount) {
          clearInterval(counterInterval)
          return targetCount
        }
        return newValue
      })
    }, 80)

    // Actualizar los valores de energía para la animación de inyección cero
    const powerUpdateInterval = setInterval(() => {
      // Generar valores aleatorios dentro de rangos específicos
      // PV: Entre 5.2 y 5.6 kW
      const pvValue = Number((5.2 + Math.random() * 0.4).toFixed(1))

      // Load: Entre 5.3 y 5.7 kW
      const loadValue = Number((5.3 + Math.random() * 0.4).toFixed(1))

      // Grid siempre será la diferencia (asegurando inyección cero)
      const gridValue = Number(Math.abs(loadValue - pvValue).toFixed(1))

      setPowerValues({
        pv: pvValue,
        load: loadValue,
        grid: gridValue,
      })
    }, 2000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
      clearInterval(counterInterval)
      clearInterval(powerUpdateInterval)
    }
  }, [scrollY, handleOpenDsvModal, openModal])

  // Ahora, modifica el useEffect que anima los valores para que también controle la aparición de las secciones:

  // Efecto para animar los valores de la propuesta
  useEffect(() => {
    const targetPower = 5.2
    const targetPanels = 13
    const targetSavings = 120
    const targetAnnualSavings = 1440
    const targetROI = 2.8

    const duration = 3000 // 3 segundos para la animación completa
    const steps = 40
    const interval = duration / steps

    // Mostrar el título después de un breve retraso inicial
    setTimeout(() => {
      setVisibleSections((prev) => ({ ...prev, title: true }))
    }, 500)

    // Mostrar la sección de sistema después de que aparezca el código de cálculo
    setTimeout(() => {
      setVisibleSections((prev) => ({ ...prev, system: true }))
    }, 2000)

    // Mostrar la sección de ahorro después de que se calcule la potencia
    setTimeout(() => {
      setVisibleSections((prev) => ({ ...prev, savings: true }))
    }, 3500)

    // Mostrar la sección de ROI después de que se calcule el ahorro
    setTimeout(() => {
      setVisibleSections((prev) => ({ ...prev, roi: true }))
    }, 5000)

    // Mostrar el mensaje de "generando propuesta" al final
    setTimeout(() => {
      setVisibleSections((prev) => ({ ...prev, generating: true }))
    }, 6500)

    let step = 0
    const animationInterval = setInterval(() => {
      step++
      const progress = step / steps

      setCalculatedPower(Number((targetPower * progress).toFixed(1)))
      setCalculatedPanels(Math.round(targetPanels * progress))
      setCalculatedSavings(Math.round(targetSavings * progress))
      setCalculatedAnnualSavings(Math.round(targetAnnualSavings * progress))
      setCalculatedROI(Number((targetROI * progress).toFixed(1)))

      if (step >= steps) {
        clearInterval(animationInterval)
      }
    }, interval)

    return () => clearInterval(animationInterval)
  }, [])

  // Función para dar formato al número con comas para miles
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div ref={mainRef} className="overflow-x-hidden bg-white text-gray-800">
      <style jsx global>{`
       /* Typing animation */
       .typing-container {
         display: block;
         font-family: monospace;
         white-space: nowrap;
         overflow: hidden;
       }

       .typing-container .line {
         position: relative;
         margin-bottom: 0.25rem;
         overflow: hidden;
         white-space: nowrap;
         opacity: 0;
         animation: typingLine 0.05s linear forwards;
       }

       @keyframes typingLine {
         0% {
           opacity: 0;
         }
         100% {
           opacity: 1;
         }
       }

       /* Cursor animation */
       .typing-container .line:last-child::after {
         content: '|';
         position: absolute;
         right: -4px;
         animation: cursor 1s infinite;
       }

       @keyframes cursor {
         0%,
         100% {
           opacity: 1;
         }
         50% {
           opacity: 0;
         }
       }
     `}</style>
      {/* Navbar fijo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Sun className="h-8 w-8 text-orange-500" />
              </div>
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
              <Link href="/#proyectos" className="text-gray-600 hover:text-orange-500 transition-colors">
                Proyectos
              </Link>
              <Link href="/#instalacion" className="text-gray-600 hover:text-orange-500 transition-colors">
                Instalación
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/cotizador"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-orange-200"
              >
                <Zap className="h-4 w-4" />
                <span>Cotizador IA</span>
              </Link>

              <button className="md:hidden text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section con diseño moderno */}
      <div className="pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
        </div>

        <div
          className={`relative z-10 container mx-auto px-4 py-20 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="w-full text-center">
            <div className="mb-6 inline-flex items-center bg-orange-50 px-4 py-1 rounded-full border border-orange-100">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm text-orange-800 font-medium">Primera empresa solar en Panamá con IA</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Energía Solar <span className="text-orange-500">Inteligente</span> para tu Futuro
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Ahorra hasta un <span className="font-semibold text-orange-500">100%</span> en tu factura eléctrica con
              energía limpia y renovable. Obtén propuestas personalizadas en tiempo real generadas por IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <Link
                href="/cotizador"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-200"
              >
                <span>Cotizador IA</span>
                <Zap className="h-5 w-5 group-hover:animate-pulse" />
              </Link>

              <Link
                href="/proyectos"
                className="flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span>Ver Proyectos</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">30s</div>
                <p className="text-xs md:text-sm text-gray-500">Propuesta IA</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">100%</div>
                <p className="text-xs md:text-sm text-gray-500">Ahorro Posible</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{formatNumber(count)}+</div>
                <p className="text-xs md:text-sm text-gray-500">Instalaciones</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">12</div>
                <p className="text-xs md:text-sm text-gray-500">Años Experiencia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce">
          <div className="w-10 h-10 flex items-center justify-center text-orange-500 bg-white rounded-full shadow-md">
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* New Section: Savings Showcase */}

      {/* Sección de Tecnología IA */}
      <section id="tecnologia" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center bg-orange-50 px-4 py-1 rounded-full border border-orange-100 mb-4">
              <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-orange-800 font-medium">TECNOLOGÍA IA</span>
            </div>

            {/* Reemplazar este bloque: */}

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-3">
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                {/* Cerebro digital minimalista */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
                <div className="absolute inset-1 flex items-center justify-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 grid grid-cols-3 grid-rows-3 gap-0.5">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${i % 2 === 0 ? "bg-orange-500" : "bg-orange-400"}
                        ${i === 4 ? "animate-pulse" : ""}`}
                        style={{
                          opacity: [0, 2, 5, 6, 8].includes(i) ? 0.9 : 0.5,
                          transform: `scale(${[4].includes(i) ? 1.2 : 1})`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 border border-orange-200 rounded-lg"></div>
              </div>
              <span className="text-gray-800">INTELIGENCIA</span> <span className="text-orange-500">ARTIFICIAL</span>
            </h2>

            <div className="w-24 h-1 bg-orange-500 rounded-full mb-6"></div>

            <p className="text-center text-gray-600 max-w-2xl">
              Utilizamos algoritmos avanzados de IA para diseñar el sistema solar perfecto para tu hogar o negocio,
              maximizando el ahorro y la eficiencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Diseño Optimizado por IA</h3>
              <p className="text-gray-600 mb-6">
                Nuestra tecnología de inteligencia artificial analiza múltiples variables para crear el sistema solar
                perfecto para tu propiedad:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-500 font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Análisis de Consumo</h4>
                    <p className="text-gray-600 text-sm">
                      La IA analiza tu patrón de consumo eléctrico para dimensionar el sistema óptimo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-500 font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Simulación Solar</h4>
                    <p className="text-gray-600 text-sm">
                      Simulamos la producción solar basada en datos meteorológicos históricos de tu ubicación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-500 font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Optimización Financiera</h4>
                    <p className="text-gray-600 text-sm">
                      Calculamos el retorno de inversión y maximizamos tu ahorro a largo plazo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-500 font-bold">04</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Propuesta en Tiempo Real</h4>
                    <p className="text-gray-600 text-sm">
                      Generamos una propuesta detallada en segundos, no en días como la competencia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Probar Cotizador IA</span>
                  <Sparkles className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="order-1 md:order-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-xl border border-orange-200">
              <div className="relative h-80 w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3">
                  {/* Código generándose en tiempo real */}
                  <div className="bg-gray-900 rounded-lg p-3 overflow-hidden text-xs font-mono h-full">
                    <TypingAnimation>
                      <div className="line">
                        <span className="text-gray-500">// Calculando sistema solar con IA</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">import</span> <span className="text-white">{"{"}</span>{" "}
                        <span className="text-blue-300">calcularSistemaSolar</span>{" "}
                        <span className="text-white">{"}"}</span> <span className="text-purple-400">from</span>{" "}
                        <span className="text-yellow-300">'./calculadora'</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="line">&nbsp;</div>
                      <div className="line">
                        <span className="text-gray-500">// Datos del cliente</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">consumo</span>{" "}
                        <span className="text-white">=</span> <span className="text-orange-300">850</span>
                        <span className="text-white">;</span> <span className="text-gray-500">// kWh mensuales</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">ubicacion</span>{" "}
                        <span className="text-white">=</span> <span className="text-yellow-300">"Panamá"</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-blue-300">tipoPropiedad</span> <span className="text-white">=</span>{" "}
                        <span className="text-yellow-300">"residencial"</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="line">&nbsp;</div>
                      <div className="line">
                        <span className="text-gray-500">// Análisis de radiación solar</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-blue-300">radiacionPromedio</span> <span className="text-white">=</span>{" "}
                        <span className="text-orange-300">5.2</span>
                        <span className="text-white">;</span> <span className="text-gray-500">// kWh/m²/día</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-blue-300">eficienciaPanel</span> <span className="text-white">=</span>{" "}
                        <span className="text-orange-300">0.21</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="line">&nbsp;</div>
                      <div className="line">
                        <span className="text-gray-500">// Cálculo del sistema</span>
                      </div>
                      <div className="line">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">resultado</span>{" "}
                        <span className="text-white">=</span>{" "}
                        <span className="text-cyan-300">calcularSistemaSolar</span>
                        <span className="text-white">({"{"}</span>
                      </div>
                      <div className="line">
                        <span className="text-white">&nbsp;&nbsp;</span>
                        <span className="text-blue-300">consumo</span>
                        <span className="text-white">,</span>
                      </div>
                      <div className="line">
                        <span className="text-white">&nbsp;&nbsp;</span>
                        <span className="text-blue-300">ubicacion</span>
                        <span className="text-white">,</span>
                      </div>
                      <div className="line">
                        <span className="text-white">&nbsp;&nbsp;</span>
                        <span className="text-blue-300">tipoPropiedad</span>
                        <span className="text-white">,</span>
                      </div>
                      <div className="line">
                        <span className="text-white">&nbsp;&nbsp;</span>
                        <span className="text-blue-300">radiacionPromedio</span>
                        <span className="text-white">,</span>
                      </div>
                      <div className="line">
                        <span className="text-white">{"}"})</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="line">&nbsp;</div>
                      <div className="line">
                        <span className="text-gray-500">// Generando propuesta...</span>
                      </div>
                      <div className="line">
                        <span className="text-cyan-300">console</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">log</span>
                        <span className="text-white">(</span>
                        <span className="text-yellow-300">"Potencia:"</span>
                        <span className="text-white">,</span> <span className="text-blue-300">resultado</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">potencia</span>
                        <span className="text-white">,</span> <span className="text-yellow-300">"kW"</span>
                        <span className="text-white">);</span>
                      </div>
                      <div className="line">
                        <span className="text-cyan-300">console</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">log</span>
                        <span className="text-white">(</span>
                        <span className="text-yellow-300">"Paneles:"</span>
                        <span className="text-white">,</span> <span className="text-blue-300">resultado</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">paneles</span>
                        <span className="text-white">);</span>
                      </div>
                      <div className="line">
                        <span className="text-cyan-300">console</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">log</span>
                        <span className="text-white">(</span>
                        <span className="text-yellow-300">"Ahorro:"</span>
                        <span className="text-white">,</span> <span className="text-blue-300">resultado</span>
                        <span className="text-white">.</span>
                        <span className="text-blue-300">ahorro</span>
                        <span className="text-white">,</span> <span className="text-yellow-300">"$/mes"</span>
                        <span className="text-white">);</span>
                      </div>
                    </TypingAnimation>
                  </div>

                  {/* Ahora, modifica la sección del "Preview de la propuesta" para usar estos estados: */}

                  {/* Preview de la propuesta */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex flex-col h-full overflow-hidden">
                    {/* Simulación de propuesta generándose */}
                    <div className="flex flex-col h-full">
                      {/* Encabezado de la propuesta */}
                      <div
                        className={`transition-all duration-500 ${visibleSections.title ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
                      >
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-md p-2 mb-2">
                          <div className="typing-text-white text-[10px] text-white font-bold text-center">
                            PROPUESTA SOLAR PERSONALIZADA
                          </div>
                        </div>
                      </div>

                      {/* Contenido de la propuesta */}
                      <div className="flex-1 overflow-y-auto space-y-2 text-[9px]">
                        {/* Sistema Recomendado */}
                        <div
                          className={`transition-all duration-500 ${visibleSections.system ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}
                        >
                          <div className="border-l-2 border-orange-500 pl-1 font-bold text-gray-700 mb-1 typing-text-slow">
                            Sistema Recomendado
                          </div>
                          <div className="bg-orange-50 rounded-md p-1.5 border border-orange-100">
                            <div className="grid grid-cols-2 gap-1 typing-text-delay-1">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                <span className="text-gray-600">Potencia:</span>
                              </div>
                              <div className="text-right font-semibold text-orange-600 number-animation">
                                {calculatedPower} kW
                              </div>

                              <div className="flex items-center gap-1 typing-text-delay-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                <span className="text-gray-600">Paneles:</span>
                              </div>
                              <div className="text-right font-semibold text-orange-600 number-animation">
                                {calculatedPanels} unidades
                              </div>

                              <div className="flex items-center gap-1 typing-text-delay-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                <span className="text-gray-600">Área:</span>
                              </div>
                              <div className="text-right font-semibold text-orange-600 number-animation">
                                {Math.round(calculatedPanels * 2.2)} m²
                              </div>
                            </div>

                            {/* Gráfico simplificado de paneles */}
                            <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden typing-text-delay-4">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-3000"
                                style={{ width: `${(calculatedPanels / 20) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Ahorro Estimado */}
                        <div
                          className={`transition-all duration-500 ${visibleSections.savings ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}
                        >
                          <div className="border-l-2 border-blue-500 pl-1 font-bold text-gray-700 mb-1 typing-text-slow">
                            Ahorro Estimado
                          </div>
                          <div className="bg-blue-50 rounded-md p-1.5 border border-blue-100">
                            <div className="grid grid-cols-2 gap-1 typing-text-delay-1">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-gray-600">Mensual:</span>
                              </div>
                              <div className="text-right font-semibold text-blue-600 number-animation">
                                ${calculatedSavings}
                              </div>

                              <div className="flex items-center gap-1 typing-text-delay-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-gray-600">Anual:</span>
                              </div>
                              <div className="text-right font-semibold text-blue-600 number-animation">
                                ${calculatedAnnualSavings}
                              </div>

                              <div className="flex items-center gap-1 typing-text-delay-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-gray-600">25 años:</span>
                              </div>
                              <div className="text-right font-semibold text-blue-600 number-animation">
                                ${calculatedAnnualSavings * 25}
                              </div>
                            </div>

                            {/* Mini gráfico de ahorro */}
                            <div className="mt-1 flex items-end h-3 gap-[1px] typing-text-delay-4">
                              {[...Array(12)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 bg-blue-400 rounded-t-sm transition-all duration-1000"
                                  style={{
                                    height: `${Math.max(15, Math.min(100, (Math.sin(i / 2) + 1) * 50))}%`,
                                    opacity: calculatedSavings > 0 ? 0.5 + i / 24 : 0,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Retorno de Inversión */}
                        <div
                          className={`transition-all duration-500 ${visibleSections.roi ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}
                        >
                          <div className="border-l-2 border-green-500 pl-1 font-bold text-gray-700 mb-1 typing-text-slow">
                            Retorno de Inversión
                          </div>
                          <div className="bg-green-50 rounded-md p-1.5 border border-green-100">
                            <div className="grid grid-cols-2 gap-1 typing-text-delay-1">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-gray-600">ROI:</span>
                              </div>
                              <div className="text-right font-semibold text-green-600 number-animation">
                                {calculatedROI} años
                              </div>

                              <div className="flex items-center gap-1 typing-text-delay-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-gray-600">Inversión:</span>
                              </div>
                              <div className="text-right font-semibold text-green-600 number-animation">
                                ${calculatedPower * 1000}
                              </div>
                            </div>

                            {/* Línea de tiempo ROI */}
                            <div className="mt-1 relative h-2 bg-gray-100 rounded-full overflow-hidden typing-text-delay-3">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all duration-3000"
                                style={{ width: `${(calculatedROI / 10) * 100}%` }}
                              ></div>
                              <div
                                className="absolute top-0 h-full w-1 bg-green-700 rounded-full transition-all duration-3000"
                                style={{ left: `${(calculatedROI / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pie de la propuesta */}
                      <div className="mt-1 pt-1 border-t border-gray-100 flex justify-center">
                        <div
                          className={`text-[8px] px-2 py-0.5 bg-orange-500 text-white rounded-full transition-all duration-500 ${visibleSections.generating ? "opacity-100" : "opacity-0"}`}
                        >
                          <span className="typing-dots">Generando propuesta completa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios con estilo moderno */}
      
      <section id="beneficios" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center bg-orange-50 px-4 py-1 rounded-full border border-orange-100 mb-4">
              <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-orange-800 font-medium">BENEFICIOS</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-gray-800">AHORRO</span> <span className="text-orange-500">GARANTIZADO</span>
            </h2>

            <div className="w-24 h-1 bg-orange-500 rounded-full mb-6"></div>

            <p className="text-center text-gray-600 max-w-2xl">
              Instala energía solar en tu hogar o negocio y comienza a ahorrar desde el primer día con tecnología
              inteligente que optimiza tu consumo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Hasta 100% de Ahorro</h3>
              <p className="text-gray-600">
                Reduce drásticamente o elimina por completo tu factura eléctrica con nuestros sistemas solares
                personalizados por IA.
              </p>

              {/* Indicador de ahorro */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Ahorro promedio</span>
                  <span className="text-sm font-bold text-orange-500">100%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <LineChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Retorno de Inversión Rápido</h3>
              <p className="text-gray-600">
                Recupera tu inversión en 2-3 años mientras disfrutas de energía gratuita por décadas. Monitorea en
                tiempo real.
              </p>

              {/* Gráfico de ROI */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">ROI promedio</span>
                  <span className="text-sm font-bold text-blue-500">2.5 años</span>
                </div>
                <div className="flex h-12 items-end space-x-1">
                  <div className="w-1/5 h-4 bg-blue-100 rounded-t"></div>
                  <div className="w-1/5 h-6 bg-blue-200 rounded-t"></div>
                  <div className="w-1/5 h-8 bg-blue-300 rounded-t"></div>
                  <div className="w-1/5 h-10 bg-blue-400 rounded-t"></div>
                  <div className="w-1/5 h-12 bg-blue-500 rounded-t"></div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Garantía Completa</h3>
              <p className="text-gray-600">
                Paneles con 30 años y 12 años en inversores. Incluye mantenimiento preventivo y soporte técnico 24/7.
              </p>

              {/* Indicador de garantía */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Garantía paneles</span>
                  <span className="text-sm font-bold text-green-500">30 años</span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex h-2 overflow-hidden text-xs bg-gray-100 rounded-full">
                        <div
                          className="flex flex-col justify-center text-center text-white bg-gradient-to-r from-green-400 to-green-600 shadow-none whitespace-nowrap"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: AHORRO 100% REAL */}
      <SavingsShowcase formatNumber={formatNumber} />

      {/* Sección de Proceso de Instalación */}
      <section id="instalacion" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center bg-orange-50 px-4 py-1 rounded-full border border-orange-100 mb-4">
              <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-orange-800 font-medium">PROCESO</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-gray-800">INSTALACIÓN</span> <span className="text-orange-500">SIMPLE</span>
            </h2>

            <div className="w-24 h-1 bg-orange-500 rounded-full mb-6"></div>

            <p className="text-center text-gray-600 max-w-2xl">
              Nuestro proceso de instalación está diseñado para ser rápido, eficiente y sin complicaciones para ti.
            </p>
          </div>

          {/* Nuevas tarjetas interactivas */}
          <div className="relative max-w-4xl mx-auto">
            {/* Línea de conexión */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 transform -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Tarjeta 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0"></div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative z-10 transition-all duration-500 group-hover:shadow-2xl group-hover:border-orange-200 group-hover:translate-y-[-8px]">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-white">
                    <span className="text-orange-500 font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                    Cotización IA
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-white/90 transition-colors duration-300">
                    Obtén una propuesta personalizada en segundos con nuestro cotizador impulsado por IA.
                  </p>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0"></div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative z-10 transition-all duration-500 group-hover:shadow-2xl group-hover:border-orange-200 group-hover:translate-y-[-8px]">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-white">
                    <span className="text-orange-500 font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                    Visita Técnica
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-white/90 transition-colors duration-300">
                    Nuestros expertos visitan tu propiedad para confirmar los detalles y finalizar el diseño.
                  </p>
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0"></div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative z-10 transition-all duration-500 group-hover:shadow-2xl group-hover:border-orange-200 group-hover:translate-y-[-8px]">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-white">
                    <span className="text-orange-500 font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                    Instalación
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-white/90 transition-colors duration-300">
                    Instalamos tu sistema solar en tiempo récord con mínimas molestias para ti.
                  </p>
                </div>
              </div>

              {/* Tarjeta 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0"></div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative z-10 transition-all duration-500 group-hover:shadow-2xl group-hover:border-orange-200 group-hover:translate-y-[-8px]">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-white">
                    <span className="text-orange-500 font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                    Activación
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-white/90 transition-colors duration-300">
                    Activamos tu sistema y te enseñamos a monitorear tu producción y ahorro en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-orange-500" />
              <span className="font-bold text-xl text-gray-800">
                Solar<span className="text-orange-500">Mente</span>
                <span className="text-orange-500 font-light">.AI</span>
              </span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">© 2024 SolarMente.AI. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
