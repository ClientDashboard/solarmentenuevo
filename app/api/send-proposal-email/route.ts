import { NextResponse } from "next/server"
import { sendEmail, generateProposalEmailTemplate } from "@/lib/sendgrid"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientEmail, clientName, proposalId, systemSize, monthlySavings } = body

    if (!clientEmail || !clientName || !proposalId) {
      return NextResponse.json({ error: "Faltan datos requeridos para enviar el correo" }, { status: 400 })
    }

    // URL base del sitio
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solarmente.ai"

    // URL completa de la propuesta
    const proposalUrl = `${baseUrl}/propuesta/${proposalId}`

    // Generar la plantilla de correo
    const htmlContent = generateProposalEmailTemplate(clientName, proposalId, proposalUrl, systemSize, monthlySavings)

    // Enviar el correo
    const success = await sendEmail({
      to: clientEmail,
      subject: "Tu Propuesta Solar Personalizada - SolarMente.IA",
      html: htmlContent,
    })

    // Even if SendGrid is not initialized, the sendEmail function will return true in preview/development
    return NextResponse.json({
      success: true,
      message: success ? "Correo enviado exitosamente" : "Correo simulado en entorno de desarrollo",
    })
  } catch (error: any) {
    console.error("Error en la API de envío de correo:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error.message || "Error desconocido",
      },
      { status: 500 },
    )
  }
}
