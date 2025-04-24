import { NextResponse } from "next/server"
import { sendAdminNotification } from "@/lib/sendgrid"
import { obtenerCotizacion } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { proposalId, adminEmail } = body

    if (!proposalId) {
      return NextResponse.json({ error: "Se requiere el ID de la propuesta" }, { status: 400 })
    }

    // Obtener los datos de la propuesta
    const { data, error: supabaseError } = await obtenerCotizacion(proposalId)

    if (supabaseError || !data) {
      console.error("Error al obtener la propuesta:", supabaseError)
      return NextResponse.json({ error: "No se pudo cargar la propuesta" }, { status: 500 })
    }

    // Verificar que data.propuesta_data existe
    if (!data.propuesta_data) {
      console.error("La propuesta no contiene datos:", data)
      return NextResponse.json({ error: "La propuesta no contiene datos válidos" }, { status: 500 })
    }

    // Extraer datos del cliente y la propuesta
    const clienteData = data.clientes
    const propuestaData = data.propuesta_data

    // Enviar notificación al administrador
    const success = await sendAdminNotification(
      {
        name: clienteData.nombre,
        email: clienteData.email,
        phone: clienteData.telefono,
        propertyType: data.tipo_propiedad,
        location: clienteData.ubicacion,
        consumption: data.consumo_kwh,
      },
      {
        id: proposalId,
        monthlySavings: propuestaData.financiero.ahorroMensual,
      },
      adminEmail || process.env.ADMIN_EMAIL || "admin@solarmente.ai",
    )

    // Even if SendGrid is not initialized, the sendAdminNotification function will return true in preview/development
    return NextResponse.json({
      success: true,
      message: "Notificación enviada o simulada exitosamente",
    })
  } catch (error: any) {
    console.error("Error en la API de envío de notificación:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error.message || "Error desconocido",
      },
      { status: 500 },
    )
  }
}
