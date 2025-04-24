// Archivo con todas las constantes del sistema solar

// Constantes del panel y sistema
export const PANEL_SIZE_WATTS = 585 // Actualizado a 585W
export const PANEL_SIZE_KW = PANEL_SIZE_WATTS / 1000
export const PANEL_AREA = 2.2
export const SUN_PEAK_HOURS = 4.2 // Horas pico de sol
export const SYSTEM_EFFICIENCY = 0.85
export const ELECTRICITY_RATE = 0.26
export const DAYS_YEAR = 364

// Costos del sistema
export const SYSTEM_COST_PER_WATT = 0.5
export const INSTALLATION_COST_PER_WATT = 0.08
export const PLANS_PERMITS_COST_PER_WATT = 0.04

// Márgenes de ganancia por plan
export const PLAN1_MARGIN = 0.7 // 70% para Plan 1
export const PLAN2_MARGIN = 1.0 // 100% para Plan 2

// Porcentajes de pago - Actualizados para Plan Estándar
export const PLAN1_PAYMENT1_PERCENT = 0.7 // 70% para el primer abono
export const PLAN1_PAYMENT2_PERCENT = 0.25 // 25% para el segundo abono
export const PLAN1_PAYMENT3_PERCENT = 0.05 // 5% para el tercer abono

// Porcentajes de pago - Plan Financiado
export const PLAN2_INITIAL_PERCENT = 0.6 // 60% para el abono inicial
export const PLAN2_REMAINDER_PERCENT = 0.4 // 40% para el saldo pendiente
export const PLAN2_PAYMENT_MONTHS = 6 // 6 meses para pagar el saldo pendiente

// Irradiancia promedio mensual para cálculo de producción (kWh/m²/día)
export const MONTHLY_IRRADIANCE = [
  5.37, // Enero
  5.85, // Febrero
  6.22, // Marzo
  5.8, // Abril
  4.71, // Mayo
  4.4, // Junio
  4.24, // Julio
  4.43, // Agosto
  4.62, // Septiembre
  4.31, // Octubre
  3.95, // Noviembre
  4.39, // Diciembre
]

// Constantes para cálculos ambientales
export const OIL_REDUCTION_PER_KW = 63 // galones por kW
export const CO2_REDUCTION_PER_KW = 0.9 // toneladas por kW

// Información del panel solar
export const PANEL_BRAND = "LONGi Solar"
export const PANEL_MODEL = "Hi-MO X6"
export const PANEL_EFFICIENCY = 22.6
export const PANEL_DIMENSIONS = {
  length: 2.278, // metros
  width: 1.134, // metros
  area: 2.583, // metros cuadrados
}

// Constantes para AP Systems (micro inversores)
export const PANELS_PER_MICROINVERTER = 3.44 // Número de paneles por micro inversor
export const MICROINVERTER_BRAND = "AP Systems"
export const MICROINVERTER_MODEL = "DS3D-MX"
export const MICROINVERTER_EFFICIENCY = 97.8
export const MICROINVERTER_WARRANTY_YEARS = 12

// Para mantener compatibilidad con el código existente
export const INVERTER_EFFICIENCY = MICROINVERTER_EFFICIENCY
export const INVERTER_EFFICIENCY_MONO = MICROINVERTER_EFFICIENCY
export const INVERTER_EFFICIENCY_TRI = MICROINVERTER_EFFICIENCY

// Componentes adicionales AP Systems
export interface APSystemsComponent {
  name: string
  ratio: string
  description: string
  unitPrice: number
}

// Lista de componentes AP Systems
export const AP_SYSTEMS_COMPONENTS: APSystemsComponent[] = [
  {
    name: "AP / DS3D-MX (Micro inversor)",
    ratio: "1 por cada 3.44 paneles",
    description: "Micro inversor principal",
    unitPrice: 285,
  },
  {
    name: "AP / SPLIT PHASE BUS CABLE",
    ratio: "1 por micro inversor",
    description: "Cable de conexión para el micro inversor",
    unitPrice: 30.45,
  },
  {
    name: "AP / BUS CABLE UNLOCK TOOL",
    ratio: "1 por sistema",
    description: "Herramienta para instalación",
    unitPrice: 2.18,
  },
  {
    name: "AP / 3/4-wire Bus Cable End Cap",
    ratio: "1 por cada 3 micro inversores",
    description: "Tapas para cables",
    unitPrice: 7.25,
  },
  {
    name: "AP / ECU-C-NA",
    ratio: "1 por sistema",
    description: "Unidad de comunicación de energía",
    unitPrice: 290,
  },
  {
    name: "AP / CURRENT TRANSFORMER",
    ratio: "4 por sistema",
    description: "Transformador de corriente",
    unitPrice: 21.75,
  },
]
