// Funciones para realizar los cálculos del sistema solar

import type { ProposalData, ComponenteAdicional } from "./types"
import * as constants from "./constants"

/**
 * Calcula el número de paneles necesarios para un consumo específico
 */
export function calcularPaneles(consumo: number): number {
  const consumoDiario = consumo / 30
  const produccionRequerida = consumoDiario / constants.SYSTEM_EFFICIENCY
  const systemSizeNeeded = produccionRequerida / constants.SUN_PEAK_HOURS

  // Usamos Math.floor según la fórmula del Excel
  return Math.floor(systemSizeNeeded / constants.PANEL_SIZE_KW)
}

/**
 * Calcula el tamaño del sistema en kW
 */
export function calcularTamanoSistema(paneles: number): number {
  return paneles * constants.PANEL_SIZE_KW
}

/**
 * Calcula el espacio requerido en el techo
 */
export function calcularEspacioTecho(paneles: number): number {
  return Math.ceil(paneles * constants.PANEL_AREA)
}

/**
 * Calcula la producción energética anual y mensual
 */
export function calcularProduccion(tamanoSistema: number): {
  anual: number
  mensual: number
  dataMensual: number[]
} {
  // Calculamos la producción diaria promedio por mes basada en la irradiancia de cada mes
  const produccionesDiarias = constants.MONTHLY_IRRADIANCE.map(
    (irradiancia) => tamanoSistema * irradiancia * constants.SYSTEM_EFFICIENCY,
  )

  // Calculamos la producción mensual (días de cada mes * producción diaria)
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const produccionesMensuales = produccionesDiarias.map((prod, i) => Math.round(prod * diasPorMes[i]))

  // Calculamos la producción anual sumando los meses
  const produccionAnual = produccionesMensuales.reduce((sum, val) => sum + val, 0)

  // Producción mensual promedio
  const produccionMensual = Math.round(produccionAnual / 12)

  return {
    anual: produccionAnual,
    mensual: produccionMensual,
    dataMensual: produccionesMensuales,
  }
}

/**
 * Calcula los ahorros financieros
 */
export function calcularAhorros(
  produccionAnual: number,
  consumo: number,
  produccionMensual: number,
): {
  ahorroAnual: number
  ahorroMensual: number
  ahorro25Anos: number
  ahorro30Anos: number
  porcentajeAhorro: number
  excedente: number
} {
  const ahorroAnual = Math.round(produccionAnual * constants.ELECTRICITY_RATE)
  const ahorroMensual = Math.round(ahorroAnual / 12)
  const ahorro25Anos = ahorroAnual * 25
  const ahorro30Anos = ahorroAnual * 30

  const porcentajeAhorro = Math.round((produccionMensual / consumo) * 100)
  const excedente = Math.max(0, porcentajeAhorro - 100)

  return {
    ahorroAnual,
    ahorroMensual,
    ahorro25Anos,
    ahorro30Anos,
    porcentajeAhorro,
    excedente,
  }
}

/**
 * Calcula los precios del Plan 1 (Estándar)
 * Asegura que los porcentajes sean exactamente 70%, 25% y 5%
 */
export function calcularPlan1(tamanoSistemaWatts: number): {
  sistema: number
  instalacion: number
  tramites: number
  total: number
  precioWatt: number
  abono1: number
  abono2: number
  abono3: number
} {
  const baseCost = tamanoSistemaWatts * constants.SYSTEM_COST_PER_WATT
  const totalProfit = baseCost * constants.PLAN1_MARGIN
  const systemPrice = baseCost + totalProfit
  const installationCost = tamanoSistemaWatts * constants.INSTALLATION_COST_PER_WATT
  const plansCost = tamanoSistemaWatts * constants.PLANS_PERMITS_COST_PER_WATT
  const totalPrice = systemPrice + installationCost + plansCost
  const pricePerWatt = totalPrice / tamanoSistemaWatts

  // Pagos - Aseguramos que los porcentajes sean exactamente 70%, 25% y 5%
  const payment1 = totalPrice * constants.PLAN1_PAYMENT1_PERCENT // 70% del total
  const payment2 = totalPrice * constants.PLAN1_PAYMENT2_PERCENT // 25% del total
  const payment3 = totalPrice * constants.PLAN1_PAYMENT3_PERCENT // 5% del total

  // Verificación de que la suma de los pagos es igual al total
  // const sumPayments = payment1 + payment2 + payment3
  // console.assert(Math.abs(sumPayments - totalPrice) < 0.01, "La suma de los pagos debe ser igual al total")

  return {
    sistema: Math.round(systemPrice),
    instalacion: Math.round(installationCost),
    tramites: Math.round(plansCost),
    total: Math.round(totalPrice),
    precioWatt: Number(pricePerWatt.toFixed(2)),
    abono1: Math.round(payment1),
    abono2: Math.round(payment2),
    abono3: Math.round(payment3),
  }
}

/**
 * Calcula los precios del Plan 2 (Financiado)
 * Asegura que los porcentajes sean exactamente 60% y 40%
 */
export function calcularPlan2(tamanoSistemaWatts: number): {
  sistema: number
  instalacion: number
  tramites: number
  total: number
  precioWatt: number
  abonoInicial: number
  saldoPendiente: number
  cuotaMensual: number
} {
  const baseCost = tamanoSistemaWatts * constants.SYSTEM_COST_PER_WATT
  const totalProfit = baseCost * constants.PLAN2_MARGIN
  const systemPrice = baseCost + totalProfit
  const installationCost = tamanoSistemaWatts * constants.INSTALLATION_COST_PER_WATT
  const plansCost = tamanoSistemaWatts * constants.PLANS_PERMITS_COST_PER_WATT
  const totalPrice = systemPrice + installationCost + plansCost
  const pricePerWatt = totalPrice / tamanoSistemaWatts

  // Pagos - Aseguramos que los porcentajes sean exactamente 60% y 40%
  const initialPayment = totalPrice * constants.PLAN2_INITIAL_PERCENT // 60% del total
  const remainingBalance = totalPrice * constants.PLAN2_REMAINDER_PERCENT // 40% del total
  const monthlyPayment = remainingBalance / constants.PLAN2_PAYMENT_MONTHS // Dividido en 6 cuotas

  // Verificación de que la suma del pago inicial y el saldo pendiente es igual al total
  // const sumPayments = initialPayment + remainingBalance
  // console.assert(Math.abs(sumPayments - totalPrice) < 0.01, "La suma del pago inicial y el saldo pendiente debe ser igual al total")

  return {
    sistema: Math.round(systemPrice),
    instalacion: Math.round(installationCost),
    tramites: Math.round(plansCost),
    total: Math.round(totalPrice),
    precioWatt: Number(pricePerWatt.toFixed(2)),
    abonoInicial: Math.round(initialPayment),
    saldoPendiente: Math.round(remainingBalance),
    cuotaMensual: Math.round(monthlyPayment),
  }
}

/**
 * Calcula el impacto ambiental
 */
export function calcularImpactoAmbiental(tamanoSistema: number): {
  petroleoReducido: number
  co2Reducido: number
} {
  return {
    petroleoReducido: Math.round(tamanoSistema * constants.OIL_REDUCTION_PER_KW),
    co2Reducido: Math.round(tamanoSistema * constants.CO2_REDUCTION_PER_KW),
  }
}

/**
 * Calcula el ROI (Retorno de Inversión)
 */
export function calcularROI(totalPrecio: number, ahorroAnual: number): number {
  return Math.round((totalPrecio / ahorroAnual) * 100) / 100
}

/**
 * Obtiene información detallada sobre los paneles solares
 */
export function obtenerInfoPanel(): {
  marca: string
  modelo: string
  potencia: number
  eficiencia: number
  dimensiones: typeof constants.PANEL_DIMENSIONS
} {
  return {
    marca: constants.PANEL_BRAND,
    modelo: constants.PANEL_MODEL,
    potencia: constants.PANEL_SIZE_WATTS,
    eficiencia: constants.PANEL_EFFICIENCY,
    dimensiones: constants.PANEL_DIMENSIONS,
  }
}

/**
 * Calcula la cantidad de micro inversores AP Systems y componentes adicionales
 */
export function calcularMicroInversores(numeroTotalPaneles: number): {
  marca: string
  modelo: string
  cantidadMicroInversores: number
  eficiencia: number
  componentes: ComponenteAdicional[]
  precioTotalComponentes: number
} {
  // Calcular la cantidad de micro inversores necesarios
  const cantidadMicroInversores = Math.ceil(numeroTotalPaneles / constants.PANELS_PER_MICROINVERTER)

  // Inicializar array para componentes calculados
  const componentesCalculados: ComponenteAdicional[] = []
  let precioTotalComponentes = 0

  // Calcular cada componente según su ratio
  for (const componente of constants.AP_SYSTEMS_COMPONENTS) {
    let cantidad = 0

    // Determinar la cantidad según la regla específica
    if (componente.name === "AP / DS3D-MX (Micro inversor)") {
      cantidad = cantidadMicroInversores
    } else if (componente.name === "AP / SPLIT PHASE BUS CABLE") {
      cantidad = cantidadMicroInversores
    } else if (componente.name === "AP / BUS CABLE UNLOCK TOOL") {
      cantidad = 1 // 1 por sistema
    } else if (componente.name === "AP / 3/4-wire Bus Cable End Cap") {
      cantidad = Math.ceil(cantidadMicroInversores / 3) // 1 por cada 3 micro inversores
    } else if (componente.name === "AP / ECU-C-NA") {
      cantidad = 1 // 1 por sistema
    } else if (componente.name === "AP / CURRENT TRANSFORMER") {
      cantidad = 4 // 4 por sistema
    }

    // Calcular precio total del componente
    const precioTotal = cantidad * componente.unitPrice
    precioTotalComponentes += precioTotal

    // Añadir al array de componentes
    componentesCalculados.push({
      nombre: componente.name,
      descripcion: componente.description,
      cantidad: cantidad,
      precioUnitario: componente.unitPrice,
      precioTotal: precioTotal,
    })
  }

  return {
    marca: constants.MICROINVERTER_BRAND,
    modelo: constants.MICROINVERTER_MODEL,
    cantidadMicroInversores: cantidadMicroInversores,
    eficiencia: constants.MICROINVERTER_EFFICIENCY,
    componentes: componentesCalculados,
    precioTotalComponentes: precioTotalComponentes,
  }
}

/**
 * Función principal para calcular todos los datos de la propuesta
 */
export function calcularPropuesta(consumo: number, esMonofasico = true): ProposalData {
  // Cálculos del sistema
  const paneles = calcularPaneles(consumo)
  const tamanoSistema = calcularTamanoSistema(paneles)
  const espacioTecho = calcularEspacioTecho(paneles)

  // Cálculos de producción
  const { anual: produccionAnual, mensual: produccionMensual, dataMensual } = calcularProduccion(tamanoSistema)

  // Cálculos financieros
  const { ahorroAnual, ahorroMensual, ahorro25Anos, ahorro30Anos, porcentajeAhorro, excedente } = calcularAhorros(
    produccionAnual,
    consumo,
    produccionMensual,
  )

  // Tamaño del sistema en Watts
  const tamanoSistemaWatts = tamanoSistema * 1000

  // Planes de pago
  const plan1 = calcularPlan1(tamanoSistemaWatts)
  const plan2 = calcularPlan2(tamanoSistemaWatts)

  // Impacto ambiental
  const impactoAmbiental = calcularImpactoAmbiental(tamanoSistema)

  // ROI
  const roi = calcularROI(plan1.total, ahorroAnual)

  // Información sobre los equipos
  const infoPanel = obtenerInfoPanel()

  // Información sobre micro inversores
  const infoMicroInversores = calcularMicroInversores(paneles)

  return {
    sistema: {
      tamano: Number(tamanoSistema.toFixed(2)),
      paneles: paneles,
      espacioTecho: espacioTecho,
      tamanoPanel: constants.PANEL_SIZE_WATTS,
      inversores: infoMicroInversores.cantidadMicroInversores,
      detalle_inversores: `${infoMicroInversores.cantidadMicroInversores}x ${infoMicroInversores.marca} ${infoMicroInversores.modelo}`,
      roi: roi,
      marcaPanel: infoPanel.marca,
      modeloPanel: infoPanel.modelo,
      potenciaPanel: infoPanel.potencia,
      eficienciaPanel: infoPanel.eficiencia.toString(),
      marcaInversor: infoMicroInversores.marca,
      modeloInversor: infoMicroInversores.modelo,
      potenciaInversor: tamanoSistema / infoMicroInversores.cantidadMicroInversores,
      tipoInversor: "Micro Inversor",
      eficienciaInversor: infoMicroInversores.eficiencia.toString(),
      componentesAdicionales: infoMicroInversores.componentes,
      esMonofasico: false, // No aplica para micro inversores
    },
    financiero: {
      ahorro25Anos: ahorro25Anos,
      ahorro30Anos: ahorro30Anos,
      ahorroAnual: ahorroAnual,
      ahorroMensual: ahorroMensual,
      porcentajeAhorro: porcentajeAhorro,
      excedente: excedente,
    },
    ambiental: impactoAmbiental,
    produccion: {
      mensual: dataMensual,
      promedioMensual: produccionMensual,
      anual: produccionAnual,
    },
    precios: {
      plan1: plan1,
      plan2: plan2,
    },
    ahorro: {
      mensual: ahorroMensual,
      anual: ahorroAnual,
    },
    cliente: {
      nombre: "",
      direccion: "",
      email: "",
      telefono: "",
      consumo: consumo,
    },
  }
}
