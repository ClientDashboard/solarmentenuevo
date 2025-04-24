"use client"

import { useState } from "react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PdfGeneratorProps {
  propuesta: any
  clienteNombre: string
  formatNumber: (num: number) => string
}

export default function PdfGenerator({ propuesta, clienteNombre, formatNumber }: PdfGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const generatePDF = async () => {
    if (generating) return
    setGenerating(true)

    try {
      // Crear un nuevo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Dimensiones de la página
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15

      // Función para añadir una nueva página
      const addPage = () => {
        pdf.addPage()
        // Añadir pie de página con número de página
        const pageNumber = pdf.getNumberOfPages()
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text(`SolarMente.IA - Página ${pageNumber}`, pageWidth / 2, pageHeight - 5, { align: "center" })
      }

      // Función para añadir encabezado a cada página
      const addHeader = () => {
        // Título en lugar del logo
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(247, 127, 0) // Color naranja
        pdf.text("SolarMente.IA", margin, margin)

        // Línea separadora
        pdf.setDrawColor(240, 240, 240)
        pdf.line(margin, margin + 5, pageWidth - margin, margin + 5)
      }

      // ===== PÁGINA 1: PORTADA =====
      // Fondo de color suave
      pdf.setFillColor(252, 245, 235) // Color naranja muy claro
      pdf.rect(0, 0, pageWidth, pageHeight, "F")

      // Título en lugar del logo
      pdf.setFontSize(28)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0) // Color naranja
      pdf.text("SolarMente.IA", pageWidth / 2, 40, { align: "center" })

      // Título
      pdf.setFontSize(24)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(50, 50, 50)
      pdf.text("PROPUESTA SOLAR PERSONALIZADA", pageWidth / 2, 70, { align: "center" })

      // Subtítulo
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Energía limpia y ahorro garantizado", pageWidth / 2, 80, { align: "center" })

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0) // Color naranja
      pdf.setLineWidth(1)
      pdf.line(pageWidth / 2 - 40, 90, pageWidth / 2 + 40, 90)

      // Información del cliente
      pdf.setFontSize(12)
      pdf.setTextColor(80, 80, 80)
      pdf.text(`Preparado para: ${clienteNombre}`, pageWidth / 2, 110, { align: "center" })
      pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 120, { align: "center" })

      // Tarjetas de resumen
      const cardWidth = (pageWidth - margin * 4) / 3
      const cardY = 140

      // Tarjeta 1: Sistema Recomendado
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(margin, cardY, cardWidth, 70, 3, 3, "F")
      pdf.setDrawColor(230, 230, 230)
      pdf.roundedRect(margin, cardY, cardWidth, 70, 3, 3, "S")

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(100, 100, 100)
      pdf.text("Sistema Recomendado", margin + 5, cardY + 10)

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(50, 50, 50)
      pdf.text(`${propuesta.sistema.tamano} kW`, margin + 5, cardY + 25)

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(120, 120, 120)
      pdf.text("Potencia total del sistema", margin + 5, cardY + 35)

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text(`${propuesta.sistema.paneles} paneles`, margin + 5, cardY + 50)
      pdf.text(`${propuesta.sistema.espacioTecho} m²`, margin + 5, cardY + 60)

      // Tarjeta 2: Inversión Estimada
      const card2XPos = margin * 2 + cardWidth
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(card2XPos, cardY, cardWidth, 70, 3, 3, "F")
      pdf.setDrawColor(230, 230, 230)
      pdf.roundedRect(card2XPos, cardY, cardWidth, 70, 3, 3, "S")

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(100, 100, 100)
      pdf.text("Inversión Estimada", card2XPos + 5, cardY + 10)

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(50, 50, 50)
      pdf.text(`$${formatNumber(propuesta.precios.plan1.total)}`, card2XPos + 5, cardY + 25)

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(120, 120, 120)
      pdf.text("Costo total del sistema", card2XPos + 5, cardY + 35)

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text(`ROI: ${propuesta.sistema.roi} años`, card2XPos + 5, cardY + 50)

      // Tarjeta 3: Ahorro Proyectado
      const card3X = margin * 3 + cardWidth * 2
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(card3X, cardY, cardWidth, 70, 3, 3, "F")
      pdf.setDrawColor(230, 230, 230)
      pdf.roundedRect(card3X, cardY, cardWidth, 70, 3, 3, "S")

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(100, 100, 100)
      pdf.text("Ahorro Proyectado", card3X + 5, cardY + 10)

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(50, 50, 50)
      pdf.text(`$${formatNumber(propuesta.financiero.ahorroAnual)}/año`, card3X + 5, cardY + 25)

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(120, 120, 120)
      pdf.text(`$${formatNumber(propuesta.financiero.ahorroMensual)}/mes`, card3X + 5, cardY + 35)

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text(`${propuesta.ambiental.co2Reducido} ton CO₂/año`, card3X + 5, cardY + 50)

      // Pie de página
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text("© SolarMente.IA - Primera empresa solar en Panamá con IA", pageWidth / 2, pageHeight - 10, {
        align: "center",
      })
      pdf.text("www.solarmente.ai | info@solarmente.ai | +507 6123-4567", pageWidth / 2, pageHeight - 5, {
        align: "center",
      })

      // ===== PÁGINA 2: DETALLES DEL SISTEMA =====
      addPage()
      addHeader()

      // Título de la sección
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Detalles del Sistema", margin, margin + 15)

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 20, margin + 60, margin + 20)

      // Contenido
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Componentes Principales", margin, margin + 30)

      // Tabla de componentes
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)

      const tableTop = margin + 40
      const rowHeight = 8
      const col1 = margin
      const col2 = margin + 50
      const col3 = margin + 100

      // Encabezados de tabla
      pdf.setFont("helvetica", "bold")
      pdf.text("Componente", col1, tableTop)
      pdf.text("Especificación", col2, tableTop)
      pdf.text("Cantidad", col3, tableTop)

      pdf.setDrawColor(220, 220, 220)
      pdf.line(margin, tableTop + 2, pageWidth - margin, tableTop + 2)

      // Filas de la tabla
      pdf.setFont("helvetica", "normal")
      pdf.text("Paneles Solares", col1, tableTop + rowHeight * 1)
      pdf.text(`${propuesta.sistema.marcaPanel} ${propuesta.sistema.potenciaPanel}W`, col2, tableTop + rowHeight * 1)
      pdf.text(`${propuesta.sistema.paneles} unidades`, col3, tableTop + rowHeight * 1)

      pdf.text("Inversores", col1, tableTop + rowHeight * 2)
      pdf.text(`${propuesta.sistema.marcaInversor} ${propuesta.sistema.modeloInversor}`, col2, tableTop + rowHeight * 2)
      pdf.text(`${propuesta.sistema.inversores} unidades`, col3, tableTop + rowHeight * 2)

      pdf.text("Estructura", col1, tableTop + rowHeight * 3)
      pdf.text("Montaje para Techo", col2, tableTop + rowHeight * 3)
      pdf.text("1 sistema", col3, tableTop + rowHeight * 3)

      pdf.text("Cableado", col1, tableTop + rowHeight * 4)
      pdf.text("Cable Solar 6mm²", col2, tableTop + rowHeight * 4)
      pdf.text(`${Math.ceil(propuesta.sistema.paneles / 8) * 80} metros`, col3, tableTop + rowHeight * 4)

      // Características del panel
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Características del Panel", margin, tableTop + rowHeight * 6)

      // Tarjeta para el panel
      pdf.setFillColor(252, 245, 235) // Naranja claro
      pdf.roundedRect(margin, tableTop + rowHeight * 7, pageWidth - margin * 2, 50, 3, 3, "F")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.setTextColor(247, 127, 0)
      pdf.text(`${propuesta.sistema.marcaPanel} ${propuesta.sistema.modeloPanel}`, margin + 5, tableTop + rowHeight * 9)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(80, 80, 80)
      pdf.text(`• Potencia: ${propuesta.sistema.potenciaPanel}W`, margin + 5, tableTop + rowHeight * 11)
      pdf.text(`• Eficiencia: ${propuesta.sistema.eficienciaPanel}%`, margin + 5, tableTop + rowHeight * 12)
      pdf.text("• Garantía: 30 años", margin + 5, tableTop + rowHeight * 13)
      pdf.text(`• Cantidad: ${propuesta.sistema.paneles} unidades`, margin + 5, tableTop + rowHeight * 14)

      // Características del inversor
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Características del Inversor", margin, tableTop + rowHeight * 17)

      // Tarjeta para el inversor
      pdf.setFillColor(240, 248, 255) // Azul claro
      pdf.roundedRect(margin, tableTop + rowHeight * 18, pageWidth - margin * 2, 50, 3, 3, "F")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.setTextColor(59, 130, 246)
      pdf.text(
        `${propuesta.sistema.marcaInversor} ${propuesta.sistema.modeloInversor}`,
        margin + 5,
        tableTop + rowHeight * 20,
      )

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(80, 80, 80)
      pdf.text(`• Tipo: ${propuesta.sistema.tipoInversor}`, margin + 5, tableTop + rowHeight * 22)
      pdf.text(`• Eficiencia: ${propuesta.sistema.eficienciaInversor}%`, margin + 5, tableTop + rowHeight * 23)
      pdf.text("• Garantía: 12 años", margin + 5, tableTop + rowHeight * 24)
      pdf.text(`• Cantidad: ${propuesta.sistema.inversores} unidades`, margin + 5, tableTop + rowHeight * 25)

      // ===== PÁGINA 3: ANÁLISIS FINANCIERO =====
      addPage()
      addHeader()

      // Título de la sección
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Análisis Financiero", margin, margin + 15)

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 20, margin + 60, margin + 20)

      // Resumen financiero
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Resumen de Inversión y Ahorro", margin, margin + 30)

      // Tarjeta de ahorro anual
      pdf.setFillColor(240, 255, 240) // Verde claro
      pdf.roundedRect(margin, margin + 35, (pageWidth - margin * 3) / 2, 50, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(16, 185, 129) // Verde
      pdf.text("Ahorro Anual", margin + 5, margin + 45)

      pdf.setFontSize(18)
      pdf.text(`$${formatNumber(propuesta.financiero.ahorroAnual)}`, margin + 5, margin + 60)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(`$${formatNumber(propuesta.financiero.ahorroMensual)} mensual`, margin + 5, margin + 70)

      // Tarjeta de ahorro a 25 años
      const card2FinX = margin * 2 + (pageWidth - margin * 3) / 2
      pdf.setFillColor(240, 248, 255) // Azul claro
      pdf.roundedRect(card2FinX, margin + 35, (pageWidth - margin * 3) / 2, 50, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(59, 130, 246) // Azul
      pdf.text("Ahorro a 25 Años", card2FinX + 5, margin + 45)

      pdf.setFontSize(18)
      pdf.text(`$${formatNumber(propuesta.financiero.ahorro25Anos)}`, card2FinX + 5, margin + 60)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(`ROI: ${propuesta.sistema.roi} años`, card2FinX + 5, margin + 70)

      // Gráfico simplificado de ROI
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Proyección de Retorno de Inversión", margin, margin + 95)

      const chartTop = margin + 105
      const chartHeight = 40
      const chartWidth = pageWidth - margin * 2

      // Eje X
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, chartTop + chartHeight, margin + chartWidth, chartTop + chartHeight)

      // Eje Y
      pdf.line(margin, chartTop, margin, chartTop + chartHeight)

      // Línea de inversión
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(1)
      pdf.line(margin, chartTop + 10, margin + chartWidth, chartTop + 10)

      // Línea de ahorro acumulado
      pdf.setDrawColor(16, 185, 129) // Verde
      pdf.setLineWidth(1)

      // Puntos para la curva de ahorro
      const points = []
      for (let i = 0; i <= 25; i++) {
        const x = margin + (i / 25) * chartWidth
        const y =
          chartTop +
          chartHeight -
          (Math.min(i * propuesta.financiero.ahorroAnual, propuesta.precios.plan1.total * 3) /
            (propuesta.precios.plan1.total * 3)) *
            chartHeight
        points.push({ x, y })
      }

      // Dibujar la curva
      for (let i = 1; i < points.length; i++) {
        pdf.line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y)
      }

      // Punto de equilibrio
      const roiX = margin + (propuesta.sistema.roi / 25) * chartWidth
      pdf.setFillColor(16, 185, 129)
      pdf.circle(roiX, chartTop + 10, 2, "F")

      // Leyenda
      pdf.setFontSize(8)
      pdf.setTextColor(247, 127, 0)
      pdf.text("Inversión", margin + 5, chartTop + 8)

      pdf.setTextColor(16, 185, 129)
      pdf.text("Ahorro Acumulado", margin + 5, chartTop + chartHeight - 5)

      pdf.setTextColor(80, 80, 80)
      pdf.text("Punto de Equilibrio", roiX - 10, chartTop + 5)

      // Etiquetas del eje X
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text("0", margin, chartTop + chartHeight + 5)
      pdf.text("5", margin + (5 / 25) * chartWidth, chartTop + chartHeight + 5)
      pdf.text("10", margin + (10 / 25) * chartWidth, chartTop + chartHeight + 5)
      pdf.text("15", margin + (15 / 25) * chartWidth, chartTop + chartHeight + 5)
      pdf.text("20", margin + (20 / 25) * chartWidth, chartTop + chartHeight + 5)
      pdf.text("25", margin + chartWidth, chartTop + chartHeight + 5)
      pdf.text("Años", margin + chartWidth / 2, chartTop + chartHeight + 10, { align: "center" })

      // Planes de pago
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Planes de Pago Disponibles", margin, chartTop + chartHeight + 25)

      // Plan Estándar
      pdf.setFillColor(252, 245, 235) // Naranja claro
      pdf.roundedRect(margin, chartTop + chartHeight + 30, (pageWidth - margin * 3) / 2, 60, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Plan Estándar", margin + 5, chartTop + chartHeight + 40)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(10)
      pdf.text(
        `• Abono inicial (70%): $${formatNumber(propuesta.precios.plan1.abono1)}`,
        margin + 5,
        chartTop + chartHeight + 50,
      )
      pdf.text(
        `• Segundo abono (25%): $${formatNumber(propuesta.precios.plan1.abono2)}`,
        margin + 5,
        chartTop + chartHeight + 60,
      )
      pdf.text(
        `• Abono final (5%): $${formatNumber(propuesta.precios.plan1.abono3)}`,
        margin + 5,
        chartTop + chartHeight + 70,
      )
      pdf.text(`• Total: $${formatNumber(propuesta.precios.plan1.total)}`, margin + 5, chartTop + chartHeight + 80)

      // Plan Financiado
      const plan2X = margin * 2 + (pageWidth - margin * 3) / 2

      pdf.setFillColor(240, 248, 255) // Azul claro
      pdf.roundedRect(plan2X, chartTop + chartHeight + 30, (pageWidth - margin * 3) / 2, 60, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(59, 130, 246) // Azul
      pdf.text("Plan Financiado", plan2X + 5, chartTop + chartHeight + 40)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(10)
      pdf.text(
        `• Abono inicial (60%): $${formatNumber(propuesta.precios.plan2.abonoInicial)}`,
        plan2X + 5,
        chartTop + chartHeight + 50,
      )
      pdf.text(
        `• Saldo pendiente (40%): $${formatNumber(propuesta.precios.plan2.saldoPendiente)}`,
        plan2X + 5,
        chartTop + chartHeight + 60,
      )
      pdf.text(
        `• Cuota mensual (x6): $${formatNumber(propuesta.precios.plan2.cuotaMensual)}`,
        plan2X + 5,
        chartTop + chartHeight + 70,
      )
      pdf.text(`• Total: $${formatNumber(propuesta.precios.plan2.total)}`, plan2X + 5, chartTop + chartHeight + 80)

      // ===== PÁGINA 4: IMPACTO AMBIENTAL =====
      addPage()
      addHeader()

      // Título de la sección
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Impacto Ambiental", margin, margin + 15)

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 20, margin + 60, margin + 20)

      // Beneficios ambientales
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Beneficios Ambientales de Tu Sistema Solar", margin, margin + 30)

      // Tarjetas de beneficios
      const envTop = margin + 40
      const cardHeight = 50
      const cardWidthEnv = (pageWidth - margin * 3) / 2

      // Tarjeta 1: Reducción de CO2
      pdf.setFillColor(240, 255, 240) // Verde claro
      pdf.roundedRect(margin, envTop, cardWidthEnv, cardHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(16, 185, 129) // Verde
      pdf.text("Reducción de CO₂", margin + 5, envTop + 10)

      pdf.setFontSize(18)
      pdf.text(`${propuesta.ambiental.co2Reducido} ton/año`, margin + 5, envTop + 25)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(`${propuesta.ambiental.co2Reducido * 25} toneladas en 25 años`, margin + 5, envTop + 40)

      // Tarjeta 2: Árboles Equivalentes
      const card2XEnv = margin * 2 + cardWidthEnv

      pdf.setFillColor(240, 248, 255) // Azul claro
      pdf.roundedRect(card2XEnv, envTop, cardWidthEnv, cardHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(59, 130, 246) // Azul
      pdf.text("Árboles Equivalentes", card2XEnv + 5, envTop + 10)

      const arboles = Math.floor(propuesta.ambiental.co2Reducido * 45)
      pdf.setFontSize(18)
      pdf.text(`${formatNumber(arboles)} árboles`, card2XEnv + 5, envTop + 25)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(`Equivalente a plantar ${formatNumber(arboles)} árboles`, card2XEnv + 5, envTop + 40)

      // Tarjeta 3: Kilómetros No Recorridos
      pdf.setFillColor(255, 245, 240) // Naranja claro
      pdf.roundedRect(margin, envTop + cardHeight + margin, cardWidthEnv, cardHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0) // Naranja
      pdf.text("Kilómetros No Recorridos", margin + 5, envTop + cardHeight + margin + 10)

      const kilometros = Math.floor(propuesta.ambiental.co2Reducido * 4000)
      pdf.setFontSize(18)
      pdf.text(`${formatNumber(kilometros)} km`, margin + 5, envTop + cardHeight + margin + 25)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        `Equivalente a no recorrer ${formatNumber(kilometros)} km en auto`,
        margin + 5,
        envTop + cardHeight + margin + 40,
      )

      // Tarjeta 4: Hogares Alimentados
      pdf.setFillColor(245, 240, 255) // Púrpura claro
      pdf.roundedRect(card2XEnv, envTop + cardHeight + margin, cardWidthEnv, cardHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(139, 92, 246) // Púrpura
      pdf.text("Hogares Alimentados", card2XEnv + 5, envTop + cardHeight + margin + 10)

      const hogares = Math.floor(propuesta.produccion.anual / 3000)
      pdf.setFontSize(18)
      pdf.text(`${hogares} hogares`, card2XEnv + 5, envTop + cardHeight + margin + 25)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(`Equivalente en consumo eléctrico anual`, card2XEnv + 5, envTop + cardHeight + margin + 40)

      // Certificado Verde
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Certificado Verde", margin, envTop + cardHeight * 2 + margin * 2 + 10)

      // Imagen del certificado
      pdf.setFillColor(240, 255, 240) // Verde claro
      pdf.roundedRect(margin, envTop + cardHeight * 2 + margin * 2 + 15, pageWidth - margin * 2, 60, 3, 3, "F")

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(16, 185, 129) // Verde
      pdf.text("CERTIFICADO VERDE", pageWidth / 2, envTop + cardHeight * 2 + margin * 2 + 30, { align: "center" })

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        `Se certifica que ${clienteNombre} contribuye activamente a la protección`,
        pageWidth / 2,
        envTop + cardHeight * 2 + margin * 2 + 40,
        { align: "center" },
      )
      pdf.text(
        `del medio ambiente mediante la instalación de un sistema de energía solar de ${propuesta.sistema.tamano} kW`,
        pageWidth / 2,
        envTop + cardHeight * 2 + margin * 2 + 48,
        { align: "center" },
      )
      pdf.text(
        `que reduce ${propuesta.ambiental.co2Reducido} toneladas de CO₂ anualmente.`,
        pageWidth / 2,
        envTop + cardHeight * 2 + margin * 2 + 56,
        { align: "center" },
      )

      // ===== PÁGINA 5: COMPORTAMIENTO DEL SISTEMA =====
      addPage()
      addHeader()

      // Título de la sección
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Comportamiento del Sistema", margin, margin + 15)

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 20, margin + 60, margin + 20)

      // Producción mensual
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Producción Mensual Estimada", margin, margin + 30)

      // Gráfico de barras simplificado
      const chartBarTop = margin + 40
      const chartBarHeight = 60
      const chartBarWidth = pageWidth - margin * 2
      const barWidth = chartBarWidth / 12 - 2

      // Eje X
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, chartBarTop + chartBarHeight, margin + chartBarWidth, chartBarTop + chartBarHeight)

      // Eje Y
      pdf.line(margin, chartBarTop, margin, chartBarTop + chartBarHeight)

      // Meses y barras
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

      // Calcular producción mensual si no está disponible
      let produccionMensual = []
      if (propuesta.produccion && propuesta.produccion.mensual && Array.isArray(propuesta.produccion.mensual)) {
        produccionMensual = propuesta.produccion.mensual.map((valor, index) => ({
          mes: meses[index],
          produccion: valor,
        }))
      } else {
        // Valores de ejemplo si no hay datos
        produccionMensual = meses.map((mes, index) => ({
          mes,
          produccion: 1000 + Math.random() * 500,
        }))
      }

      // Encontrar el valor máximo para escalar las barras
      const maxProduccion = Math.max(...produccionMensual.map((d) => d.produccion))

      // Dibujar barras y etiquetas
      for (let i = 0; i < 12; i++) {
        const barX = margin + i * (barWidth + 2)
        const barHeight = (produccionMensual[i].produccion / maxProduccion) * chartBarHeight
        const barY = chartBarTop + chartBarHeight - barHeight

        // Dibujar barra
        pdf.setFillColor(247, 127, 0, 0.7 + (i / 12) * 0.3) // Naranja con opacidad variable
        pdf.rect(barX, barY, barWidth, barHeight, "F")

        // Etiqueta del mes
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text(meses[i], barX + barWidth / 2, chartBarTop + chartBarHeight + 8, { align: "center" })
      }

      // Información adicional
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        `Producción anual total: ${formatNumber(propuesta.produccion.anual)} kWh`,
        margin,
        chartBarTop + chartBarHeight + 20,
      )

      // Análisis de producción
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Análisis de Producción", margin, chartBarTop + chartBarHeight + 35)

      // Tarjeta de análisis
      pdf.setFillColor(252, 245, 235) // Naranja claro
      pdf.roundedRect(margin, chartBarTop + chartBarHeight + 40, pageWidth - margin * 2, 70, 3, 3, "F")

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        "• Meses de alta producción (Feb-Abr): Durante estos meses, tu sistema generará un excedente",
        margin + 5,
        chartBarTop + chartBarHeight + 50,
      )
      pdf.text(
        "  significativo de energía que se acreditará a tu cuenta con la compañía eléctrica.",
        margin + 5,
        chartBarTop + chartBarHeight + 58,
      )

      pdf.text(
        "• Meses de producción media (May-Oct, Dic-Ene): En estos meses, la producción se mantiene",
        margin + 5,
        chartBarTop + chartBarHeight + 70,
      )
      pdf.text("  estable y generalmente cubre tu consumo mensual.", margin + 5, chartBarTop + chartBarHeight + 78)

      pdf.text(
        "• Meses de menor producción (Nov): Noviembre presenta la menor radiación solar del año,",
        margin + 5,
        chartBarTop + chartBarHeight + 90,
      )
      pdf.text(
        "  pero los créditos acumulados compensarán cualquier déficit.",
        margin + 5,
        chartBarTop + chartBarHeight + 98,
      )

      // ===== PÁGINA 6: PRÓXIMOS PASOS =====
      addPage()
      addHeader()

      // Título de la sección
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("Próximos Pasos", margin, margin + 15)

      // Línea decorativa
      pdf.setDrawColor(247, 127, 0)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 20, margin + 60, margin + 20)

      // Proceso de instalación
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Proceso de Instalación", margin, margin + 30)

      // Pasos del proceso
      const stepsTop = margin + 40
      const stepHeight = 30

      // Paso 1
      pdf.setFillColor(252, 245, 235) // Naranja claro
      pdf.roundedRect(margin, stepsTop, pageWidth - margin * 2, stepHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("1. Aceptación de la Propuesta", margin + 5, stepsTop + 12)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Confirma tu interés y realiza el primer abono para iniciar el proceso.", margin + 5, stepsTop + 22)

      // Paso 2
      pdf.setFillColor(240, 248, 255) // Azul claro
      pdf.roundedRect(margin, stepsTop + stepHeight + 5, pageWidth - margin * 2, stepHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(59, 130, 246)
      pdf.text("2. Instalación del Sistema", margin + 5, stepsTop + stepHeight + 5 + 12)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        "Instalamos tu sistema solar en 7-10 días hábiles después del primer abono.",
        margin + 5,
        stepsTop + stepHeight + 5 + 22,
      )

      // Paso 3
      pdf.setFillColor(240, 255, 240) // Verde claro
      pdf.roundedRect(margin, stepsTop + (stepHeight + 5) * 2, pageWidth - margin * 2, stepHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(16, 185, 129)
      pdf.text("3. Puesta en Marcha", margin + 5, stepsTop + (stepHeight + 5) * 2 + 12)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        "Configuramos el sistema con inyección cero para que comiences a ahorrar de inmediato.",
        margin + 5,
        stepsTop + (stepHeight + 5) * 2 + 22,
      )

      // Paso 4
      pdf.setFillColor(255, 245, 245) // Rojo claro
      pdf.roundedRect(margin, stepsTop + (stepHeight + 5) * 3, pageWidth - margin * 2, stepHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(239, 68, 68)
      pdf.text("4. Trámites con la Compañía Eléctrica", margin + 5, stepsTop + (stepHeight + 5) * 3 + 12)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        "Gestionamos todos los trámites para la interconexión y cambio de medidor.",
        margin + 5,
        stepsTop + (stepHeight + 5) * 3 + 22,
      )

      // Paso 5
      pdf.setFillColor(245, 240, 255) // Púrpura claro
      pdf.roundedRect(margin, stepsTop + (stepHeight + 5) * 4, pageWidth - margin * 2, stepHeight, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(139, 92, 246)
      pdf.text("5. Ahorro Total", margin + 5, stepsTop + (stepHeight + 5) * 4 + 12)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text(
        "Disfruta de un ahorro de hasta el 100% en tu factura eléctrica.",
        margin + 5,
        stepsTop + (stepHeight + 5) * 4 + 22,
      )

      // Información de contacto
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Información de Contacto", margin, stepsTop + (stepHeight + 5) * 5 + 10)

      // Tarjeta de contacto
      pdf.setFillColor(250, 250, 250)
      pdf.roundedRect(margin, stepsTop + (stepHeight + 5) * 5 + 15, pageWidth - margin * 2, 50, 3, 3, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(247, 127, 0)
      pdf.text("SolarMente.IA", margin + 5, stepsTop + (stepHeight + 5) * 5 + 25)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(80, 80, 80)
      pdf.text("Primera empresa solar en Panamá con IA", margin + 5, stepsTop + (stepHeight + 5) * 5 + 35)
      pdf.text("Teléfono: +507 6123-4567", margin + 5, stepsTop + (stepHeight + 5) * 5 + 45)
      pdf.text("Email: info@solarmente.ai", margin + 5, stepsTop + (stepHeight + 5) * 5 + 55)
      pdf.text("Web: www.solarmente.ai", margin + 5, stepsTop + (stepHeight + 5) * 5 + 65)

      // Guardar el PDF
      pdf.save(`Propuesta_Solar_${clienteNombre.replace(/\s+/g, "_")}.pdf`)

      // Mostrar mensaje de éxito
      toast({
        title: "PDF generado correctamente",
        description: "Tu propuesta ha sido descargada como PDF",
        variant: "success",
      })
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      toast({
        title: "Error al generar el PDF",
        description: "Hubo un problema al crear el documento PDF. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button onClick={generatePDF} disabled={generating} variant="outline" size="sm" className="gap-2">
      {generating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span className="hidden sm:inline">Generando PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Descargar PDF</span>
        </>
      )}
    </Button>
  )
}
