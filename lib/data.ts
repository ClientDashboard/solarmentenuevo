import { supabaseAdmin } from "@/lib/supabase"
import type { ProposalData } from "@/lib/types"

/**
 * Fetches a proposal by its ID from the database
 */
export async function getPropuesta(id: string): Promise<ProposalData | null> {
  try {
    console.log("Fetching proposal with ID:", id)

    const { data, error } = await supabaseAdmin.from("cotizaciones").select("*, clientes(*)").eq("id", id).single()

    if (error) {
      console.error("Error fetching proposal:", error)
      return null
    }

    if (!data) {
      console.error("No data found for proposal ID:", id)
      return null
    }

    // Extract the proposal data from the response
    const propuestaData = data.propuesta_data as ProposalData

    // Add the ID to the proposal data for reference
    propuestaData.id = data.id

    console.log("Successfully fetched proposal data")
    return propuestaData
  } catch (error) {
    console.error("Exception in getPropuesta:", error)
    return null
  }
}

/**
 * Fetches all proposals from the database
 */
export async function getAllPropuestas(): Promise<ProposalData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("cotizaciones")
      .select("*, clientes(*)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching proposals:", error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Parse the JSON data for each proposal
    return data.map((item) => {
      const propuesta = item.propuesta_data as ProposalData
      propuesta.id = item.id
      return propuesta
    })
  } catch (error) {
    console.error("Exception in getAllPropuestas:", error)
    return []
  }
}
