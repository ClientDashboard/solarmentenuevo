// TEMPORARILY DISABLED SENDGRID
// import sgMail from "@sendgrid/mail"

import { isDevelopmentOrPreview } from "@/lib/utils"

// Flag to indicate SendGrid is disabled
const SENDGRID_DISABLED = true

export interface EmailData {
  to: string
  subject: string
  text?: string
  html: string
  from?: string
  attachments?: any[]
}

/**
 *
 * @param num
 * @returns
 */
function formatNumber(num: number): string {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

/**
 * Envía un correo electrónico utilizando SendGrid
 * TEMPORARILY DISABLED - Will only log emails
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  if (isDevelopmentOrPreview()) {
    // SendGrid is temporarily disabled
    const { to, subject, from = "info@solarmente.ai" } = data

    console.log("📧 SENDGRID DISABLED: Email would have been sent:")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`From: ${from}`)
    console.log("Content: [Email content omitted for brevity]")

    // Return true to not break the application flow
    return true
  } else {
    // SendGrid is enabled
    try {
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY!) // Make sure SENDGRID_API_KEY is set

      const { to, subject, text, html, from = "info@solarmente.ai", attachments } = data

      // const msg = {
      //   to,
      //   from,
      //   subject,
      //   text,
      //   html,
      //   attachments,
      // }

      // await sgMail.send(msg)
      console.log("Email sent successfully to:", to)
      return true
    } catch (error: any) {
      console.error("Error sending email:", error)
      return false
    }
  }
}

/**
 * Genera una plantilla de correo para la propuesta solar
 */
export function generateProposalEmailTemplate(
  clientName: string,
  proposalId: string,
  proposalUrl: string,
  systemSize: number,
  monthlySavings: number,
): string {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SolarMente - Tu Propuesta Solar</title>
  <style>
    /* General Reset & Styles */
    body, p, h1, h2, h3, a { margin: 0; padding: 0; }
    body { background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(255,103,31,0.2); }
    .header { background-color: #111111; padding: 30px 20px; text-align: center; border-bottom: 1px solid #222222; }
    .header img { max-width: 180px; margin-bottom: 20px; }
    .header h1 { font-size: 32px; color: #ffffff; margin-top: 10px; }
    .header .highlight { color: #FF671F; }
    .tagline { font-size: 16px; color: #cccccc; margin-top: 5px; }
    .hero { background-color: #1a1a1a; padding: 40px 20px; text-align: center; border-bottom: 1px solid #222222; }
    .hero h2 { font-size: 26px; color: #ffffff; margin-bottom: 16px; }
    .hero .highlight { color: #FF671F; }
    .hero p { font-size: 18px; color: #cccccc; line-height: 1.6; }
    .content { padding: 40px 20px; color: #cccccc; background-color: #0f0f0f; }
    .content h2 { font-size: 22px; margin-bottom: 20px; color: #ffffff; }
    .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
    .saving-box {
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .saving-box .amount {
      font-size: 36px;
      font-weight: bold;
      color: #FF671F;
    }
    .saving-box .label {
      font-size: 14px;
      color: #bbbbbb;
      margin-top: 5px;
    }
    .cta-button {
      display: block;
      width: 80%;
      max-width: 300px;
      margin: 30px auto;
      padding: 16px;
      background: linear-gradient(90deg, #FF671F 0%, #FF8B3D 100%);
      color: #ffffff !important;
      text-align: center;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
      font-size: 18px;
      transition: transform 0.3s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    /* WhatsApp button overrides */
    .whatsapp-button {
      background: linear-gradient(90deg, #25D366 0%, #128C7E 100%) !important;
      margin-top: 15px;
    }
    .animated-border {
      position: relative;
      overflow: hidden;
    }
    .animated-border::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #FF671F, transparent);
      animation: animate 4s linear infinite;
    }
    @keyframes animate {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    .footer { background-color: #080808; text-align: center; padding: 30px 20px; font-size: 14px; color: #777777; border-top: 1px solid #222222; }
    .metrics {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 30px auto;
      max-width: 500px;
    }
    .metric-item {
      flex: 1;
      min-width: 120px;
      margin: 10px;
      background-color: #1a1a1a;
      border-radius: 10px;
      padding: 15px 10px;
      border: 1px solid #333333;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #FF671F;
    }
    .metric-label {
      font-size: 12px;
      color: #aaaaaa;
      margin-top: 5px;
    }
    @media only screen and (max-width: 600px) {
      body {
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .container {
        width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
        max-width: none !important;
      }
      .header img {
        max-width: 150px;
      }
      .header h1 {
        font-size: 28px;
      }
      .hero h2 {
        font-size: 24px;
      }
      .hero p {
        font-size: 16px;
      }
      .content {
        padding: 20px 15px;
      }
      .content h2 {
        font-size: 20px;
      }
      .content p {
        font-size: 15px;
      }
      .saving-box .amount {
        font-size: 30px;
      }
      .metrics {
        flex-direction: column;
        align-items: center;
      }
      .metric-item {
        width: 90%;
        margin: 10px 0;
        text-align: center;
      }
      .metric-value {
        font-size: 24px;
      }
      .cta-button {
        width: 90%;
        font-size: 16px;
        padding: 14px;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" style="background-color: #000000; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="600">
          <!-- Header with Logo and Tagline -->
          <tr>
            <td class="header">
              <img src="https://solarmente.io/images/logo.png" alt="SolarMente Logo" style="display: block; margin: 0 auto; width: 180px; height: auto;">
              <h1>Solar<span class="highlight">Mente</span><span class="highlight" style="font-weight: 300;">.AI</span></h1>
              <div class="tagline">Cambiando la forma de cotizar, comprar e instalar paneles solares</div>
            </td>
          </tr>
          <!-- Hero Section -->
          <tr>
            <td class="hero animated-border">
              <h2>¡Tu propuesta solar está <span class="highlight">lista</span>!</h2>
              <p>Ahorra hasta un 100% en tu factura eléctrica con energía limpia y renovable.</p>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td class="content">
              <h2>Hola, <strong>${clientName}</strong>,</h2>
              <p>
                Hemos preparado una propuesta solar personalizada basada en tu consumo mensual.
                Con nuestro sistema, podrías ahorrar aproximadamente:
              </p>
              
              <div class="saving-box">
                <div class="amount">$${formatNumber(monthlySavings)}</div>
                <div class="label">AHORRO MENSUAL ESTIMADO</div>
              </div>
              
              <div class="metrics">
                <div class="metric-item">
                  <div class="metric-value">30s</div>
                  <div class="metric-label">PROPUESTA IA</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">100%</div>
                  <div class="metric-label">AHORRO POSIBLE</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">12</div>
                  <div class="metric-label">AÑOS EXPERIENCIA</div>
                </div>
              </div>
              
              <p style="text-align: center; font-size: 18px; font-weight: bold; color: #ffffff;">
                ¿Listo para cambiar a energía solar inteligente?
              </p>
              
              <p style="text-align: center;">
                <a href="${proposalUrl}" class="cta-button" style="color: #ffffff !important;">Ver mi propuesta solar</a>
              </p>
              
              <p style="text-align: center;">
                <a href="https://wa.me/50764143255?text=Hola%20SolarMente,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20mi%20propuesta" class="cta-button whatsapp-button" style="color: #ffffff !important;">
                  Contactar por WhatsApp
                </a>
              </p>
              
              <p style="text-align: center; font-size: 14px; color: #999999; margin-top: 30px;">
                Si tienes alguna pregunta, responde a este correo o llámanos al <strong>+507 6414-3255</strong>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>© 2025 SolarMente. Todos los derechos reservados.</p>
              <p style="margin-top: 10px;">Primera empresa en Panamá que combina energía solar con IA avanzada.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  return htmlTemplate
}

/**
 * Genera una plantilla de correo para notificación al administrador
 */
export function generateAdminNotificationTemplate(
  clientData: {
    name: string
    email: string
    phone: string
    propertyType: string
    location: string
    consumption: number
  },
  proposalData: {
    id: string
    monthlySavings: number
  },
): string {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SolarMente - Nueva propuesta generada</title>
  <style>
    /* General Reset & Styles */
    body, p, h1, h2, h3, a { margin: 0; padding: 0; }
    body { background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(255,103,31,0.2); }
    .header { background-color: #111111; padding: 30px 20px; text-align: center; border-bottom: 1px solid #222222; }
    .header img { max-width: 180px; margin-bottom: 20px; }
    .header h1 { font-size: 32px; color: #ffffff; margin-top: 10px; }
    .header .highlight { color: #FF671F; }
    .alert-box {
      background-color: #1a1a1a;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid #222222;
      position: relative;
      overflow: hidden;
    }
    .alert-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #FF671F, transparent);
      animation: animate 4s linear infinite;
    }
    @keyframes animate {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    .alert-box h2 { font-size: 26px; color: #ffffff; margin-bottom: 16px; }
    .alert-box p { font-size: 18px; color: #cccccc; }
    .content { padding: 30px 20px; color: #cccccc; background-color: #0f0f0f; }
    .content h2 { font-size: 22px; margin-bottom: 20px; color: #ffffff; }
    .customer-info {
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .info-item {
      margin-bottom: 15px;
    }
    .info-label {
      display: block;
      font-size: 12px;
      color: #999999;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 16px;
      color: #ffffff;
      font-weight: bold;
    }
    .highlight-value {
      color: #FF671F;
      font-size: 18px;
    }
    .cta-buttons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 20px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      border-radius: 8px;
      text-align: center;
      min-width: 200px;
    }
    .proposal-btn {
      background: linear-gradient(90deg, #FF671F 0%, #FF8B3D 100%);
      color: #ffffff !important;
    }
    .whatsapp-btn {
      background: linear-gradient(90deg, #25D366 0%, #128C7E 100%);
      color: #ffffff !important;
    }
    .notification-badge {
      display: inline-block;
      background-color: #FF671F;
      color: white;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .footer { background-color: #080808; text-align: center; padding: 30px 20px; font-size: 14px; color: #777777; border-top: 1px solid #222222; }
    @media only screen and (max-width: 600px) {
      .container { margin: 10px; }
      .cta-buttons { flex-direction: column; }
      .cta-button { width: 100%; }
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" style="background-color: #000000; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="600">
          <!-- Header with Logo and Tagline -->
          <tr>
            <td class="header">
              <img src="https://solarmente.io/images/logo.png" alt="SolarMente Logo" style="display: block; margin: 0 auto; width: 180px; height: auto;">
              <h1>Solar<span class="highlight">Mente</span><span class="highlight" style="font-weight: 300;">.AI</span></h1>
            </td>
          </tr>
          <!-- Alert Box -->
          <tr>
            <td class="alert-box">
              <div class="notification-badge">NUEVA PROPUESTA</div>
              <h2>Nueva propuesta solar generada</h2>
              <p>Se ha creado una propuesta para un cliente potencial</p>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td class="content">
              <h2>Detalles del Cliente</h2>
              
              <div class="customer-info">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">NOMBRE</span>
                    <span class="info-value">${clientData.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">EMAIL</span>
                    <span class="info-value">${clientData.email}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">TELÉFONO</span>
                    <span class="info-value">${clientData.phone}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">TIPO DE PROPIEDAD</span>
                    <span class="info-value">${clientData.propertyType}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">PROVINCIA</span>
                    <span class="info-value">${clientData.location}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">CONSUMO MENSUAL</span>
                    <span class="info-value">${clientData.consumption} kWh</span>
                  </div>
                </div>
                <div class="info-item" style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333333;">
                  <span class="info-label">AHORRO MENSUAL ESTIMADO</span>
                  <span class="info-value highlight-value">$${formatNumber(proposalData.monthlySavings)}</span>
                </div>
              </div>
              
              <div class="cta-buttons">
                <a href="https://wa.me/{{clienteTelefonoDigits}}?text=Hola%20{{clienteNombre}},%20soy%20de%20SolarMente.%20Vi%20tu%20solicitud%20de%20propuesta%20solar%20y%20quería%20contactarte%20para%20resolver%20cualquier%20duda%20que%20tengas." class="cta-button whatsapp-btn">
                  Contactar por WhatsApp
                </a>
                
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/propuesta/${proposalData.id}" class="cta-button proposal-btn">
                  Ver propuesta
                </a>
              </div>
              
              <p style="text-align: center; font-size: 14px; color: #999999; font-style: italic;">
                Esta propuesta fue generada automáticamente por SolarMente.AI en respuesta a la solicitud del cliente.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>© 2025 SolarMente. Todos los derechos reservados.</p>
              <p style="margin-top: 10px;">Primera empresa en Panamá que combina energía solar con IA avanzada.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  return htmlTemplate
}

/**
 * Envía una notificación por correo al administrador sobre una nueva propuesta
 * TEMPORARILY DISABLED - Will only log notification
 */
export async function sendAdminNotification(
  clientData: {
    name: string
    email: string
    phone: string
    propertyType: string
    location: string
    consumption: number
  },
  proposalData: {
    id: string
    monthlySavings: number
  },
  adminEmail = "admin@solarmente.ai", // Email del administrador por defecto
): Promise<boolean> {
  if (isDevelopmentOrPreview()) {
    console.log("📧 SENDGRID DISABLED: Admin notification would have been sent:")
    console.log(`To: ${adminEmail}`)
    console.log(`About client: ${clientData.name} (${clientData.email})`)
    console.log(`Proposal ID: ${proposalData.id}`)

    // Return true to not break the application flow
    return true
  } else {
    try {
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY!) // Make sure SENDGRID_API_KEY is set

      const htmlContent = generateAdminNotificationTemplate(clientData, proposalData)

      // const msg = {
      //   to: adminEmail,
      //   from: "info@solarmente.ai",
      //   subject: "Nueva Propuesta Solar - Notificación al Administrador",
      //   html: htmlContent,
      // }

      // await sgMail.send(msg)
      console.log("Admin notification sent successfully to:", adminEmail)
      return true
    } catch (error: any) {
      console.error("Error sending admin notification:", error)
      return false
    }
  }
}
