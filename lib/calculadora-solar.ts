// Constantes para los cálculos solares
const EFICIENCIA_PANEL = 0.21 // 21% de eficiencia para paneles modernos
const POTENCIA_PANEL = 400 // 400W por panel
const AREA_PANEL = 2 // 2m² por panel aproximadamente
const PRECIO_KW = 1000 // $1000 por kW instalado (aproximado)
const PRECIO_KWH = 0.15 // $0.15 por kWh (ajustar según la región)
const HORAS_SOL_PICO = 5.2 // Horas de sol pico promedio en Panamá
const FACTOR_EMISION_CO2 = 0.5 // kg de CO2 por kWh

// Interfaz para los resultados del cálculo
export interface ResultadoSolar {
  potenciaSistemaKW: number
  numeroPaneles: number
  areaRequerida: number
  costoEstimado: number
  ahorroMensual: number
  ahorroAnual: number
  retornoInversion: number
  reduccionCO2: number
}

/**
 * Calcula el sistema solar basado en el consumo mensual en kWh
 * @param consumoKWh Consumo mensual en kWh
 * @param facturaPromedio Factura promedio mensual en $
 * @param ubicacion Ubicación para ajustar factores regionales
 * @returns Resultados del cálculo del sistema solar
 */
export function calcularSistemaSolar(
  consumoKWh: number,
  facturaPromedio: number,
  ubicacion = "Panama",
): ResultadoSolar {
  // Ajustar horas de sol pico según la ubicación
  let horasSolPico = HORAS_SOL_PICO
  if (ubicacion.toLowerCase().includes("david") || ubicacion.toLowerCase().includes("chiriqui")) {
    horasSolPico = 5.5 // Más sol en el oeste
  } else if (ubicacion.toLowerCase().includes("colon")) {
    horasSolPico = 4.9 // Menos sol en la costa atlántica
  }

  // Calcular la potencia del sistema necesaria
  // Fórmula: Consumo mensual / (días del mes * horas sol pico * factor de rendimiento)
  const factorRendimiento = 0.8 // Factor que considera pérdidas del sistema
  const potenciaSistemaKW = consumoKWh / (30 * horasSolPico * factorRendimiento)

  // Calcular número de paneles
  const numeroPaneles = Math.ceil((potenciaSistemaKW * 1000) / POTENCIA_PANEL)

  // Calcular área requerida
  const areaRequerida = numeroPaneles * AREA_PANEL

  // Calcular costo estimado
  const costoEstimado = potenciaSistemaKW * PRECIO_KW

  // Calcular ahorro mensual
  // Si tenemos la factura promedio, usamos ese valor para un cálculo más preciso
  const ahorroMensual =
    facturaPromedio > 0
      ? facturaPromedio * 0.95 // Asumimos 95% de ahorro con la factura real
      : consumoKWh * PRECIO_KWH // Cálculo basado en consumo si no tenemos factura

  // Calcular ahorro anual
  const ahorroAnual = ahorroMensual * 12

  // Calcular retorno de inversión en años
  const retornoInversion = costoEstimado / ahorroAnual

  // Calcular reducción de CO2 en toneladas por año
  const reduccionCO2 = (consumoKWh * FACTOR_EMISION_CO2 * 12) / 1000

  return {
    potenciaSistemaKW: Number(potenciaSistemaKW.toFixed(2)),
    numeroPaneles,
    areaRequerida: Number(areaRequerida.toFixed(2)),
    costoEstimado: Number(costoEstimado.toFixed(2)),
    ahorroMensual: Number(ahorroMensual.toFixed(2)),
    ahorroAnual: Number(ahorroAnual.toFixed(2)),
    retornoInversion: Number(retornoInversion.toFixed(1)),
    reduccionCO2: Number(reduccionCO2.toFixed(2)),
  }
}

/**
 * Calcula el ahorro a lo largo del tiempo
 * @param resultados Resultados del cálculo solar
 * @param años Número de años para proyectar
 * @returns Proyección de ahorro por año
 */
export function calcularProyeccionAhorro(
  resultados: ResultadoSolar,
  años = 25,
): { año: number; ahorro: number; ahorroAcumulado: number }[] {
  const proyeccion = []
  let ahorroAcumulado = 0

  for (let i = 1; i <= años; i++) {
    // Consideramos un aumento anual del 3% en el costo de la electricidad
    const factorAumento = Math.pow(1.03, i - 1)
    const ahorroAnual = resultados.ahorroAnual * factorAumento
    ahorroAcumulado += ahorroAnual

    proyeccion.push({
      año: i,
      ahorro: Number(ahorroAnual.toFixed(2)),
      ahorroAcumulado: Number(ahorroAcumulado.toFixed(2)),
    })
  }

  return proyeccion
}
