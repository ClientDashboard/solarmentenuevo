import { createClient } from "@supabase/supabase-js"
import type { FormData, ProposalData } from "./types"

// Update the Supabase client initialization with the provided values

// Client-side Supabase instance (limited permissions)
export const supabase = createClient(
  "https://kfvspbcsoasszgfijsel.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdnNwYmNzb2Fzc3pnZmlqc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODYzNDksImV4cCI6MjA1ODA2MjM0OX0.t7k5P_o3PYFrCWH6jdG31OHTEyhHfZZOXNjEUckNsKA",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

// Server-side Supabase instance with admin privileges
// Only use this in server components or API routes
export const supabaseAdmin = createClient(
  "https://kfvspbcsoasszgfijsel.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdnNwYmNzb2Fzc3pnZmlqc2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjQ4NjM0OSwiZXhwIjoyMDU4MDYyMzQ5fQ.pcsGgBDQaqfhC_Tw64vyoxhfpRSfFHLykbNZmGrp-NE",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Tipos para las tablas de Supabase
export type Cliente = {
  id?: string
  nombre: string
  email: string
  telefono: string
  ubicacion: string
  created_at?: string
}

export type Cotizacion = {
  id?: string
  cliente_id: string
  tipo_propiedad: string
  fase_electrica?: string
  consumo_kwh: number
  propuesta_data: ProposalData
  created_at?: string
}

// Replace the createTablesIfNotExist function with this updated version
export async function createTablesIfNotExist() {
  console.log("Tables need to be created manually in Supabase SQL Editor")

  // Since we can't create tables programmatically without the execute_sql function,
  // we'll check if the tables exist and return appropriate guidance
  try {
    // Check if clientes table exists by attempting to query it
    const { data: clientesData, error: clientesError } = await supabaseAdmin.from("clientes").select("count").limit(1)

    if (clientesError && clientesError.message.includes("does not exist")) {
      console.error("The 'clientes' table does not exist. Please create it manually.")
      return {
        success: false,
        error: "Tables don't exist. Please create them manually using the SQL provided in the documentation.",
      }
    }

    // Check if cotizaciones table exists
    const { data: cotizacionesData, error: cotizacionesError } = await supabaseAdmin
      .from("cotizaciones")
      .select("count")
      .limit(1)

    if (cotizacionesError && cotizacionesError.message.includes("does not exist")) {
      console.error("The 'cotizaciones' table does not exist. Please create it manually.")
      return {
        success: false,
        error: "Tables don't exist. Please create them manually using the SQL provided in the documentation.",
      }
    }

    // If we got here without errors about tables not existing, then the tables exist
    if (!clientesError && !cotizacionesError) {
      console.log("Tables already exist")
      return { success: true }
    }

    return {
      success: false,
      error: "Could not verify if tables exist. Please check your Supabase configuration.",
    }
  } catch (error) {
    console.error("Error checking tables:", error)
    return { success: false, error }
  }
}

// Funciones para interactuar con Supabase
export async function guardarCliente(cliente: Cliente): Promise<{ data: Cliente | null; error: any }> {
  const { data, error } = await supabaseAdmin.from("clientes").insert([cliente]).select().single()
  return { data, error }
}

export async function guardarCotizacion(cotizacion: Cotizacion): Promise<{ data: Cotizacion | null; error: any }> {
  const { data, error } = await supabaseAdmin.from("cotizaciones").insert([cotizacion]).select().single()
  return { data, error }
}

// Add better error handling for the obtenerCotizacion function
export async function obtenerCotizacion(id: string): Promise<{ data: Cotizacion | null; error: any }> {
  try {
    console.log("Fetching proposal with ID:", id)

    if (!id) {
      console.error("No ID provided to obtenerCotizacion")
      return { data: null, error: "No ID provided" }
    }

    const { data, error } = await supabaseAdmin.from("cotizaciones").select("*, clientes(*)").eq("id", id).single()

    if (error) {
      console.error("Supabase error in obtenerCotizacion:", error)
      return { data: null, error }
    }

    if (!data) {
      console.error("No data found for ID:", id)
      return { data: null, error: "No data found" }
    }

    console.log("Successfully fetched proposal data:", data)
    return { data, error: null }
  } catch (error) {
    console.error("Exception in obtenerCotizacion:", error)
    return { data: null, error }
  }
}

// Modificar la función procesarSolicitud para que devuelva los datos de la propuesta
export async function procesarSolicitud(
  formData: FormData,
): Promise<{ solicitudId: string; propuestaData?: ProposalData; error: any }> {
  try {
    console.log("Starting procesarSolicitud with data:", formData)

    // First, ensure tables exist
    const { success: tablesCreated, error: tablesError } = await createTablesIfNotExist()

    if (!tablesCreated) {
      console.error("Failed to create necessary tables:", tablesError)
      throw new Error(`Error al crear tablas necesarias: ${tablesError}`)
    }

    // 1. Save client data with better error handling
    const clienteData: Cliente = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      ubicacion: formData.ubicacion,
    }

    console.log("Attempting to save client data:", clienteData)

    // Insert new client with explicit error handling
    const { data: newClient, error: insertError } = await supabaseAdmin
      .from("clientes")
      .insert([clienteData])
      .select()
      .single()

    if (insertError) {
      console.error("Supabase client insertion error details:", insertError)
      throw new Error(`Error al guardar cliente: ${insertError.message || JSON.stringify(insertError)}`)
    }

    if (!newClient) {
      console.error("No client data returned after insertion")
      throw new Error("Error al guardar cliente: No se devolvieron datos del cliente")
    }

    const clientId = newClient.id
    console.log("New client saved successfully with ID:", clientId)

    // 2. Calculate proposal
    const esMonofasico = formData.faseElectrica === "monofasico"
    const propuestaData = calcularPropuesta(formData.consumo, esMonofasico)

    // 3. Update client data in the proposal
    propuestaData.cliente = {
      nombre: formData.nombre,
      direccion: formData.ubicacion,
      email: formData.email,
      telefono: formData.telefono,
      consumo: formData.consumo,
    }

    // 4. Save quotation with better error handling
    const cotizacionData: Cotizacion = {
      cliente_id: clientId,
      tipo_propiedad: formData.tipoPropiedad,
      // Remove fase_electrica from direct insertion
      consumo_kwh: formData.consumo,
      propuesta_data: propuestaData,
    }

    // Make sure fase_electrica is included in the propuesta_data
    propuestaData.cliente.faseElectrica = formData.faseElectrica

    console.log("Attempting to save quotation data with client_id:", clientId)

    const { data: cotizacion, error: cotizacionError } = await supabaseAdmin
      .from("cotizaciones")
      .insert([cotizacionData])
      .select()
      .single()

    if (cotizacionError) {
      console.error("Supabase quotation insertion error details:", cotizacionError)
      throw new Error(`Error al guardar cotización: ${cotizacionError.message || JSON.stringify(cotizacionError)}`)
    }

    if (!cotizacion) {
      console.error("No quotation data returned after insertion")
      throw new Error("Error al guardar cotización: No se devolvieron datos de la cotización")
    }

    console.log("Quotation saved successfully with ID:", cotizacion.id)

    return { solicitudId: cotizacion.id, propuestaData, error: null }
  } catch (error: any) {
    console.error("Error al procesar solicitud:", error)
    return {
      solicitudId: "",
      propuestaData: undefined,
      error: error.message || "Error desconocido al procesar la solicitud",
    }
  }
}

// Importar la función de cálculo
import { calcularPropuesta } from "./calculators"

// Add a function to test the Supabase connection
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: any }> {
  try {
    // Try a simple query to test the connection
    const { data, error } = await supabaseAdmin.from("_pgsql_raw").select("*").execute("SELECT 1 as test")

    if (error) {
      console.error("Supabase connection test error:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Supabase connection test exception:", error)
    return { success: false, error }
  }
}
