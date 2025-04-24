import { NextResponse } from "next/server"
import { procesarSolicitud, createTablesIfNotExist } from "@/lib/supabase"
import type { FormData } from "@/lib/types"
import { sendEmail, generateProposalEmailTemplate, sendAdminNotification } from "@/lib/sendgrid"

// Make sure this is a server-side only route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("API route received request body:", body)

    // First, check if tables exist
    const { success: tablesExist, error: tablesError } = await createTablesIfNotExist()

    if (!tablesExist) {
      console.error("Tables don't exist:", tablesError)
      return NextResponse.json(
        {
          error: "Las tablas necesarias no existen en la base de datos",
          message: "Por favor, crea las tablas manualmente usando el SQL proporcionado",
          details: "Visita /api/sql-setup para obtener el SQL necesario",
          sqlSetupUrl: "/api/sql-setup",
        },
        { status: 500 },
      )
    }

    // Validate required data
    if (!body.nombre || !body.email || !body.telefono || !body.consumo) {
      console.error("Missing required fields:", {
        nombre: !!body.nombre,
        email: !!body.email,
        telefono: !!body.telefono,
        consumo: !!body.consumo,
      })
      return NextResponse.json({ error: "Faltan datos requeridos para procesar la solicitud" }, { status: 400 })
    }

    // Prepare form data
    const formData: FormData = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono,
      ubicacion: body.provincia || body.ubicacion || "Panamá",
      consumo: Number(body.consumo),
      tipoPropiedad: body.tipoPropiedad || "residencial",
      faseElectrica: body.faseElectrica || "monofasico",
    }

    console.log("Processed form data:", formData)

    // Process the request
    const { solicitudId, propuestaData, error } = await procesarSolicitud(formData)

    if (error) {
      console.error("Error processing proposal:", error)
      return NextResponse.json(
        {
          error,
          message: "Error al procesar la solicitud",
          details: "Revise los logs del servidor para más información",
        },
        { status: 500 },
      )
    }

    // Enviar correo electrónico con la propuesta
    if (solicitudId && propuestaData) {
      try {
        // URL base del sitio
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solarmente.ai"

        // URL completa de la propuesta
        const proposalUrl = `${baseUrl}/propuesta/${solicitudId}`

        // Formatear el número de teléfono para WhatsApp
        const clienteTelefonoDigits = formData.telefono.replace(/\D/g, "")

        // Generar la plantilla de correo
        const htmlContent = generateProposalEmailTemplate(
          formData.nombre,
          solicitudId,
          proposalUrl,
          propuestaData.sistema.tamano,
          propuestaData.financiero.ahorroMensual,
        )

        // Enviar el correo
        const emailSent = await sendEmail({
          to: formData.email,
          subject: "Tu Propuesta Solar Personalizada - SolarMente.IA",
          html: htmlContent,
        })

        if (emailSent) {
          console.log("Email sent successfully to:", formData.email)
        } else {
          console.log("Email sending skipped or failed for:", formData.email)
        }

        // Enviar notificación al administrador
        const adminEmail = process.env.ADMIN_EMAIL || "admin@solarmente.ai"

        const adminNotificationSent = await sendAdminNotification(
          {
            name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            propertyType: formData.tipoPropiedad,
            location: formData.ubicacion,
            consumption: formData.consumo,
          },
          {
            id: solicitudId,
            monthlySavings: propuestaData.financiero.ahorroMensual,
          },
          adminEmail,
        )

        if (adminNotificationSent) {
          console.log("Admin notification sent successfully to:", adminEmail)
        } else {
          console.log("Admin notification skipped or failed for:", adminEmail)
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // No interrumpimos el flujo si falla el envío del correo
      }
    }

    // Return the request ID for redirecting to the welcome page instead of results page
    return NextResponse.json({
      success: true,
      solicitudId,
      message: "Propuesta generada exitosamente",
    })
  } catch (error: any) {
    console.error("Error in proposal API:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error.message || "Error desconocido",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
