import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // This endpoint provides the SQL needed to create the tables
  const createTablesSql = `
-- Create the clientes table
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  ubicacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the cotizaciones table
CREATE TABLE IF NOT EXISTS public.cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id),
  tipo_propiedad TEXT NOT NULL,
  fase_electrica TEXT,
  consumo_kwh NUMERIC NOT NULL,
  propuesta_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
  `

  return NextResponse.json({
    message: "Copy and run this SQL in your Supabase SQL Editor to create the necessary tables",
    sql: createTablesSql,
    instructions: [
      "1. Go to your Supabase dashboard",
      "2. Click on 'SQL Editor' in the left sidebar",
      "3. Create a new query",
      "4. Paste the SQL code provided above",
      "5. Click 'Run' to execute the SQL and create the tables",
    ],
  })
}
