// This is a debug endpoint to help diagnose Supabase connection issues
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Test basic connection
    const { data: pingData, error: pingError } = await supabaseAdmin
      .from("_pgsql_raw")
      .select("*")
      .execute("SELECT 1 as ping")

    // Try to list tables
    const { data: tablesData, error: tablesError } = await supabaseAdmin
      .from("_pgsql_raw")
      .select("*")
      .execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)

    // Try to create a test table
    const { error: createTableError } = await supabaseAdmin
      .from("_pgsql_raw")
      .select("*")
      .execute(`
        CREATE TABLE IF NOT EXISTS public.test_table (
          id SERIAL PRIMARY KEY,
          name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
      `)

    // Try to insert into the test table
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("_pgsql_raw")
      .select("*")
      .execute(`
        INSERT INTO public.test_table (name)
        VALUES ('test_${Date.now()}')
        RETURNING *
      `)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      connection: {
        ping: {
          success: !pingError,
          data: pingData,
          error: pingError,
        },
      },
      schema: {
        tables: {
          success: !tablesError,
          data: tablesData,
          error: tablesError,
        },
        createTable: {
          success: !createTableError,
          error: createTableError,
        },
      },
      testOperations: {
        insert: {
          success: !insertError,
          data: insertData,
          error: insertError,
        },
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Provided" : "Missing",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Provided" : "Missing",
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Provided" : "Missing",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Supabase connection",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
