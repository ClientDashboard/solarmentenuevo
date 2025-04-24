"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calcularPlan1, calcularPlan2 } from "@/lib/calculators"

/**
 * Componente para probar los cálculos de los planes de pago
 * y verificar que los porcentajes y montos sean correctos
 */
export default function TestCalculator() {
  const [systemSize, setSystemSize] = useState(10000) // 10kW en watts
  const [results, setResults] = useState<any>(null)

  const handleCalculate = () => {
    // Calcular los planes
    const plan1 = calcularPlan1(systemSize)
    const plan2 = calcularPlan2(systemSize)

    // Verificar que los porcentajes sean correctos
    const plan1Total = plan1.total
    const plan1Abono1Percent = ((plan1.abono1 / plan1Total) * 100).toFixed(2)
    const plan1Abono2Percent = ((plan1.abono2 / plan1Total) * 100).toFixed(2)
    const plan1Abono3Percent = ((plan1.abono3 / plan1Total) * 100).toFixed(2)
    const plan1Sum = plan1.abono1 + plan1.abono2 + plan1.abono3
    const plan1Diff = plan1Total - plan1Sum

    const plan2Total = plan2.total
    const plan2AbonoInicialPercent = ((plan2.abonoInicial / plan2Total) * 100).toFixed(2)
    const plan2SaldoPendientePercent = ((plan2.saldoPendiente / plan2Total) * 100).toFixed(2)
    const plan2Sum = plan2.abonoInicial + plan2.saldoPendiente
    const plan2Diff = plan2Total - plan2Sum

    setResults({
      plan1,
      plan2,
      verification: {
        plan1: {
          abono1Percent: plan1Abono1Percent,
          abono2Percent: plan1Abono2Percent,
          abono3Percent: plan1Abono3Percent,
          sum: plan1Sum,
          diff: plan1Diff,
          isCorrect: Math.abs(plan1Diff) < 1, // Diferencia menor a 1 por redondeo
        },
        plan2: {
          abonoInicialPercent: plan2AbonoInicialPercent,
          saldoPendientePercent: plan2SaldoPendientePercent,
          sum: plan2Sum,
          diff: plan2Diff,
          isCorrect: Math.abs(plan2Diff) < 1, // Diferencia menor a 1 por redondeo
        },
      },
    })
  }

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Verificador de Cálculos de Planes de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tamaño del Sistema (Watts)</label>
            <div className="flex gap-4">
              <Input
                type="number"
                value={systemSize}
                onChange={(e) => setSystemSize(Number(e.target.value))}
                className="max-w-xs"
              />
              <Button onClick={handleCalculate}>Calcular</Button>
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4">Plan Estándar</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold">${formatNumber(results.plan1.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio por Watt</p>
                    <p className="font-bold">${results.plan1.precioWatt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abono 1 (70%)</p>
                    <p className="font-bold">${formatNumber(results.plan1.abono1)}</p>
                    <p className="text-xs text-gray-500">{results.verification.plan1.abono1Percent}% del total</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abono 2 (25%)</p>
                    <p className="font-bold">${formatNumber(results.plan1.abono2)}</p>
                    <p className="text-xs text-gray-500">{results.verification.plan1.abono2Percent}% del total</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abono 3 (5%)</p>
                    <p className="font-bold">${formatNumber(results.plan1.abono3)}</p>
                    <p className="text-xs text-gray-500">{results.verification.plan1.abono3Percent}% del total</p>
                  </div>
                </div>
                <div className="mt-4 p-2 rounded bg-gray-50">
                  <p className="text-sm">Suma de abonos: ${formatNumber(results.verification.plan1.sum)}</p>
                  <p className="text-sm">Diferencia con el total: ${formatNumber(results.verification.plan1.diff)}</p>
                  <p
                    className={`text-sm font-bold ${results.verification.plan1.isCorrect ? "text-green-600" : "text-red-600"}`}
                  >
                    {results.verification.plan1.isCorrect ? "✓ Cálculo correcto" : "✗ Error en el cálculo"}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4">Plan Financiado</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold">${formatNumber(results.plan2.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio por Watt</p>
                    <p className="font-bold">${results.plan2.precioWatt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abono Inicial (60%)</p>
                    <p className="font-bold">${formatNumber(results.plan2.abonoInicial)}</p>
                    <p className="text-xs text-gray-500">{results.verification.plan2.abonoInicialPercent}% del total</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Saldo Pendiente (40%)</p>
                    <p className="font-bold">${formatNumber(results.plan2.saldoPendiente)}</p>
                    <p className="text-xs text-gray-500">
                      {results.verification.plan2.saldoPendientePercent}% del total
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cuota Mensual (x6)</p>
                    <p className="font-bold">${formatNumber(results.plan2.cuotaMensual)}</p>
                  </div>
                </div>
                <div className="mt-4 p-2 rounded bg-gray-50">
                  <p className="text-sm">
                    Suma de abono inicial y saldo: ${formatNumber(results.verification.plan2.sum)}
                  </p>
                  <p className="text-sm">Diferencia con el total: ${formatNumber(results.verification.plan2.diff)}</p>
                  <p
                    className={`text-sm font-bold ${results.verification.plan2.isCorrect ? "text-green-600" : "text-red-600"}`}
                  >
                    {results.verification.plan2.isCorrect ? "✓ Cálculo correcto" : "✗ Error en el cálculo"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
