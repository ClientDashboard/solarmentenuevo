// Add a new API route to test the Supabase connection

import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force_dynamic"

export async function GET() {
  try {
    // First test the basic connection
    const { success, error } = await testSupabaseConnection()

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Supabase",
          error,
        },
        { status: 500 },
      )
    }

    // Now test table access
    const tables = ["clientes", "cotizaciones"]
    const tableResults = {}

    for (const table of tables) {
      try {
        const { data, error: tableError } = await supabaseAdmin.from(table).select("count").limit(1)

        tableResults[table] = {
          success: !tableError,
          error: tableError ? tableError.message : null,
        }
      } catch (e) {
        tableResults[table] = {
          success: false,
          error: e.message,
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      tableAccess: tableResults,
      supabaseUrl: supabaseAdmin.supabaseUrl,
      // Don't include the actual key for security reasons
      keyProvided: !!supabaseAdmin.supabaseKey,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Supabase connection",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
