import Image from "next/image"

interface EquipmentSummaryProps {
  propuesta: any
  formatNumber: (num: number) => string
}

export default function EquipmentSummary({ propuesta, formatNumber }: EquipmentSummaryProps) {
  // Determinar la marca del panel según la propuesta o usar una opción predeterminada

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Panel Solar */}
      <div className="border rounded-lg overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <div className="bg-amber-100 p-3">
          <h3 className="font-semibold text-gray-800">Paneles Solares</h3>
        </div>
        <div className="p-4 flex justify-center">
          <div className="relative w-32 h-40">
            <Image src="/images/solar-panel-front.png" alt="Panel Solar" fill className="object-contain" />
          </div>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <div>
            <p className="text-sm text-gray-500">Marca</p>
            <p className="font-medium">LONGi Solar o ERA Solar</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Potencia</p>
            <p className="font-medium">{propuesta.sistema.potenciaPanel} W</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cantidad</p>
            <p className="text-xl font-bold text-orange-600">{propuesta.sistema.paneles} unidades</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Garantía</p>
            <p className="text-xl font-bold text-gray-600">30 años</p>
          </div>
        </div>
      </div>

      {/* Inversores */}
      <div className="border rounded-lg overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-blue-100 p-3">
          <h3 className="font-semibold text-gray-800">Inversores</h3>
        </div>
        <div className="p-4 flex justify-center">
          <div className="relative w-32 h-40">
            <Image src="/images/APsystems_DS3-2022-BC.png" alt="Inversor" fill className="object-contain" />
          </div>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <div>
            <p className="text-sm text-gray-500">Marca</p>
            <p className="font-medium">{propuesta.sistema.marcaInversor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Modelo</p>
            <p className="font-medium">{propuesta.sistema.modeloInversor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="font-medium">{propuesta.sistema.tipoInversor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cantidad</p>
            <p className="text-xl font-bold text-blue-600">{propuesta.sistema.inversores} unidades</p>
          </div>
        </div>
      </div>

      {/* Estructura */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="bg-gray-100 p-3">
          <h3 className="font-semibold text-gray-800">Estructura</h3>
        </div>
        <div className="p-4 flex justify-center bg-white">
          <div className="relative w-32 h-40">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Uranus-Solar-Tin-Roof-2kW-Main-Image-Rail.jpg-xE1lXE6lKVai6U7rmLmzRLkOWko0mx.jpeg"
              alt="Estructura"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="font-medium">Estructura de Aluminio</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Compatibilidad</p>
            <p className="font-medium">Techo plano o inclinado</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Material</p>
            <p className="font-medium">Aluminio anodizado</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Garantía</p>
            <p className="text-xl font-bold text-gray-600">25 años</p>
          </div>
        </div>
      </div>

      {/* Componentes Adicionales */}
      <div className="border rounded-lg overflow-hidden bg-gradient-to-b from-green-50 to-white ">
        <div className="bg-green-100 p-3">
          <h3 className="font-semibold text-gray-800">Componentes Adicionales</h3>
        </div>
        <div className="p-4 flex justify-center bg-white">
          <div className="relative w-32 h-40">
            <Image src="/images/cable-negro-ok-02.webp" alt="Cableado" fill className="object-contain" />
          </div>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <div>
            <p className="text-sm text-gray-500">Conectores MC4</p>
            <p className="font-medium">Incluidos</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cableado</p>
            <p className="font-medium">Cable solar 10 AWG</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tuberías eléctricas</p>
            <p className="font-medium">Incluidas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
