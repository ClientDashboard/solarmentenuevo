import { NextResponse } from "next/server"
import { createTablesIfNotExist } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { success, error } = await createTablesIfNotExist()

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create tables",
          error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tables created or already exist",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating tables",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
