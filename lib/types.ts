// Tipos para los cálculos y propuestas solares

export interface ComponenteAdicional {
  nombre: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  precioTotal: number
}

export interface SistemaInfo {
  tamano: number
  paneles: number
  espacioTecho: number
  tamanoPanel: number
  inversores: number
  detalle_inversores: string
  roi: number
  marcaPanel: string
  modeloPanel: string
  potenciaPanel: number
  eficienciaPanel: string
  marcaInversor: string
  modeloInversor: string
  potenciaInversor: number
  tipoInversor: string
  eficienciaInversor: string
  componentesAdicionales: ComponenteAdicional[]
  esMonofasico: boolean
}

export interface FinancieroInfo {
  ahorro25Anos: number
  ahorro30Anos: number
  ahorroAnual: number
  ahorroMensual: number
  porcentajeAhorro: number
  excedente: number
}

export interface AmbientalInfo {
  petroleoReducido: number
  co2Reducido: number
}

export interface ProduccionInfo {
  mensual: number[]
  promedioMensual: number
  anual: number
}

export interface Plan1Info {
  sistema: number
  instalacion: number
  tramites: number
  total: number
  precioWatt: number
  abono1: number
  abono2: number
  abono3: number
}

export interface Plan2Info {
  sistema: number
  instalacion: number
  tramites: number
  total: number
  precioWatt: number
  abonoInicial: number
  saldoPendiente: number
  cuotaMensual: number
}

export interface PreciosInfo {
  plan1: Plan1Info
  plan2: Plan2Info
}

export interface AhorroInfo {
  mensual: number
  anual: number
}

// Update the ClienteInfo interface to include faseElectrica
export interface ClienteInfo {
  nombre: string
  direccion: string
  email: string
  telefono: string
  consumo: number
  faseElectrica?: string // Add this field
}

// Add the ID field to the ProposalData interface
export interface ProposalData {
  id?: string
  sistema: {
    tamano: number
    paneles: number
    espacioTecho: number
    tamanoPanel: number
    inversores: number
    detalle_inversores: string
    roi: number
    marcaPanel: string
    modeloPanel: string
    potenciaPanel: number
    eficienciaPanel: string
    marcaInversor: string
    modeloInversor: string
    potenciaInversor: number
    tipoInversor: string
    eficienciaInversor: string
    componentesAdicionales: ComponenteAdicional[]
    esMonofasico: boolean
  }
  financiero: {
    ahorro25Anos: number
    ahorro30Anos: number
    ahorroAnual: number
    ahorroMensual: number
    porcentajeAhorro: number
    excedente: number
    incentivos?: number
  }
  ambiental: {
    petroleoReducido: number
    co2Reducido: number
  }
  produccion: {
    mensual: number[]
    promedioMensual: number
    anual: number
  }
  precios: {
    plan1: {
      sistema: number
      instalacion: number
      tramites: number
      total: number
      precioWatt: number
      abono1: number
      abono2: number
      abono3: number
    }
    plan2: {
      sistema: number
      instalacion: number
      tramites: number
      total: number
      precioWatt: number
      abonoInicial: number
      saldoPendiente: number
      cuotaMensual: number
    }
  }
  ahorro: {
    mensual: number
    anual: number
  }
  cliente: {
    nombre: string
    direccion: string
    email: string
    telefono: string
    consumo: number
    faseElectrica?: string
  }
}

export interface FormData {
  nombre: string
  email: string
  telefono: string
  ubicacion: string
  tipoPropiedad: string
  faseElectrica: string
  consumo: number
}

// Update the Cotizacion type to remove fase_electrica
export type Cotizacion = {
  id?: string
  cliente_id: string
  tipo_propiedad: string
  // Remove fase_electrica field
  consumo_kwh: number
  propuesta_data: ProposalData
  created_at?: string
}

// Add the id field to the Propuesta interface if it doesn't already exist

// Make sure the Propuesta interface includes an id field
export interface Propuesta {
  id?: string
  sistema: {
    tamano: number
    paneles: number
    espacioTecho: number
    tamanoPanel: number
    inversores: number
    detalle_inversores: string
    roi: number
    marcaPanel: string
    modeloPanel: string
    potenciaPanel: number
    eficienciaPanel: string
    marcaInversor: string
    modeloInversor: string
    potenciaInversor: number
    tipoInversor: string
    eficienciaInversor: string
    componentesAdicionales: ComponenteAdicional[]
    esMonofasico: boolean
    inversor?: string // Add this field for compatibility with the page
  }
  financiero: {
    ahorro25Anos: number
    ahorro30Anos: number
    ahorroAnual: number
    ahorroMensual: number
    porcentajeAhorro: number
    excedente: number
    incentivos?: number // Add this field for compatibility with the page
  }
  ambiental: {
    petroleoReducido: number
    co2Reducido: number
  }
  produccion: {
    mensual: number[]
    promedioMensual: number
    anual: number
  }
  precios: {
    plan1: {
      sistema: number
      instalacion: number
      tramites: number
      total: number
      precioWatt: number
      abono1: number
      abono2: number
      abono3: number
    }
    plan2: {
      sistema: number
      instalacion: number
      tramites: number
      total: number
      precioWatt: number
      abonoInicial: number
      saldoPendiente: number
      cuotaMensual: number
    }
  }
  ahorro: {
    mensual: number
    anual: number
  }
  cliente: {
    nombre: string
    direccion: string
    email: string
    telefono: string
    consumo: number
    fase_electrica?: string // Add this field for the electrical phase
  }
}
