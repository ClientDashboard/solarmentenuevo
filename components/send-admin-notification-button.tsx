"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SendAdminNotificationButtonProps {
  proposalId: string
}

export default function SendAdminNotificationButton({ proposalId }: SendAdminNotificationButtonProps) {
  const [sending, setSending] = useState(false)

  const handleSendNotification = async () => {
    if (sending) return
    setSending(true)

    try {
      const response = await fetch("/api/send-admin-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposalId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Notificación enviada",
          description: "Se ha enviado la notificación al administrador",
          variant: "success",
        })
      } else {
        throw new Error(data.error || "Error al enviar la notificación")
      }
    } catch (error: any) {
      console.error("Error al enviar notificación:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la notificación",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Button onClick={handleSendNotification} disabled={sending} variant="outline" size="sm" className="gap-2">
      {sending ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span className="hidden sm:inline">Enviando...</span>
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notificar admin</span>
        </>
      )}
    </Button>
  )
}
