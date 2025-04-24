import { NextResponse } from "next/server"
import { guardarCliente, guardarCotizacion, type Cliente, type Cotizacion } from "@/lib/supabase"
import { calcularSistemaSolar } from "@/lib/calculadora-solar"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extraer datos del cliente y la cotización
    const clienteData: Cliente = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono,
      ubicacion: body.ubicacion,
    }

    // Guardar cliente en Supabase
    const { data: cliente, error: clienteError } = await guardarCliente(clienteData)

    if (clienteError) {
      return NextResponse.json(
        { error: "Error al guardar los datos del cliente", details: clienteError },
        { status: 500 },
      )
    }

    // Calcular sistema solar
    const consumoKWh = Number(body.consumoKWh)
    const facturaPromedio = Number(body.facturaPromedio)
    const resultados = calcularSistemaSolar(consumoKWh, facturaPromedio, body.ubicacion)

    // Preparar datos de cotización
    const cotizacionData: Cotizacion = {
      cliente_id: cliente!.id!,
      tipo_propiedad: body.tipoPropiedad,
      consumo_kwh: consumoKWh,
      factura_promedio: facturaPromedio,
      potencia_sistema_kw: resultados.potenciaSistemaKW,
      numero_paneles: resultados.numeroPaneles,
      area_requerida: resultados.areaRequerida,
      costo_estimado: resultados.costoEstimado,
      ahorro_mensual: resultados.ahorroMensual,
      ahorro_anual: resultados.ahorroAnual,
      retorno_inversion: resultados.retornoInversion,
      reduccion_co2: resultados.reduccionCO2,
    }

    // Guardar cotización en Supabase
    const { data: cotizacion, error: cotizacionError } = await guardarCotizacion(cotizacionData)

    if (cotizacionError) {
      return NextResponse.json({ error: "Error al guardar la cotización", details: cotizacionError }, { status: 500 })
    }

    // Devolver ID de la cotización para redireccionar a la página de bienvenida
    return NextResponse.json({
      success: true,
      cotizacionId: cotizacion!.id,
      resultados,
    })
  } catch (error) {
    console.error("Error en la API de cotización:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud", details: error }, { status: 500 })
  }
}
