// This file can be used to create the necessary tables in Supabase if they don't exist
// You can run this file manually or add it to your project setup

import { supabaseAdmin } from "./supabase"

export async function createTables() {
  console.log("Checking and creating necessary tables in Supabase...")

  try {
    // Check if clientes table exists
    const { data: clientesExists, error: clientesCheckError } = await supabaseAdmin.rpc("check_table_exists", {
      table_name: "clientes",
    })

    if (clientesCheckError) {
      console.error("Error checking if clientes table exists:", clientesCheckError)
    }

    if (!clientesExists) {
      console.log("Creating clientes table...")
      const { error: createClientesError } = await supabaseAdmin.rpc("create_table_clientes")

      if (createClientesError) {
        console.error("Error creating clientes table:", createClientesError)
      } else {
        console.log("clientes table created successfully")
      }
    } else {
      console.log("clientes table already exists")
    }

    // Check if cotizaciones table exists
    const { data: cotizacionesExists, error: cotizacionesCheckError } = await supabaseAdmin.rpc("check_table_exists", {
      table_name: "cotizaciones",
    })

    if (cotizacionesCheckError) {
      console.error("Error checking if cotizaciones table exists:", cotizacionesCheckError)
    }

    if (!cotizacionesExists) {
      console.log("Creating cotizaciones table...")
      const { error: createCotizacionesError } = await supabaseAdmin.rpc("create_table_cotizaciones")

      if (createCotizacionesError) {
        console.error("Error creating cotizaciones table:", createCotizacionesError)
      } else {
        console.log("cotizaciones table created successfully")
      }
    } else {
      console.log("cotizaciones table already exists")
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating tables:", error)
    return { success: false, error }
  }
}

// SQL functions to create in Supabase SQL Editor:
/*
-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Function to create clientes table
CREATE OR REPLACE FUNCTION create_table_clientes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.clientes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre text NOT NULL,
    email text NOT NULL,
    telefono text NOT NULL,
    ubicacion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
  );
  
  -- Add indexes
  CREATE INDEX IF NOT EXISTS clientes_email_idx ON public.clientes (email);
END;
$$;

-- Function to create cotizaciones table
CREATE OR REPLACE FUNCTION create_table_cotizaciones()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id uuid REFERENCES public.clientes(id),
    tipo_propiedad text NOT NULL,
    fase_electrica text,
    consumo_kwh numeric NOT NULL,
    propuesta_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
  );
  
  -- Add indexes
  CREATE INDEX IF NOT EXISTS cotizaciones_cliente_id_idx ON public.cotizaciones (cliente_id);
END;
$$;
*/
