"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SendEmailButtonProps {
  proposalId: string
  clientEmail: string
  clientName: string
  systemSize: number
  monthlySavings: number
}

export default function SendEmailButton({
  proposalId,
  clientEmail,
  clientName,
  systemSize,
  monthlySavings,
}: SendEmailButtonProps) {
  const [sending, setSending] = useState(false)

  const handleSendEmail = async () => {
    if (sending) return
    setSending(true)

    try {
      const response = await fetch("/api/send-proposal-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail,
          clientName,
          proposalId,
          systemSize,
          monthlySavings,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Correo enviado",
          description: `Se ha enviado la propuesta a ${clientEmail}`,
          variant: "success",
        })
      } else {
        throw new Error(data.error || "Error al enviar el correo")
      }
    } catch (error: any) {
      console.error("Error al enviar correo:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el correo",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Button onClick={handleSendEmail} disabled={sending} variant="outline" size="sm" className="gap-2">
      {sending ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span className="hidden sm:inline">Enviando...</span>
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Enviar por correo</span>
        </>
      )}
    </Button>
  )
}
