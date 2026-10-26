"use client";

import { AlertTriangle, Shield, Users, PieChart } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col bg-guinda">
      {/* Encabezado Principal */}
      <header className="flex h-[100px] shrink-0 items-center justify-between px-10 text-white">
        <h1 className="text-[1.75rem] font-bold tracking-tight">Panel de Control</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm">
            <AlertTriangle className="mr-2 h-5 w-5 fill-current" />
            Alerta Naranja
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6d5b8] text-sm font-bold text-guinda-dark shadow-sm">
            AD
          </div>
        </div>
      </header>

      {/* Contenido (Fondo Claro con Borde Redondeado) */}
      <div className="flex flex-1 flex-col overflow-y-auto rounded-tl-[2.5rem] bg-[#f4f6f8] p-10 shadow-inner">

        {/* Tarjetas de Métricas (KPIs) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Tarjeta 1 */}
          <div className="rounded-[1.25rem] bg-white p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-5">
              <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#f5ebed] text-guinda-dark">
                <Shield className="h-6 w-6 fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">Refugios Activos</p>
                <h3 className="text-[2.5rem] leading-none font-extrabold text-gray-900 mt-1">12</h3>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">de 15 registrados</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="rounded-[1.25rem] bg-white p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-5">
              <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#f5ebed] text-guinda-dark">
                <Users className="h-6 w-6 fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">Capacidad Total</p>
                <h3 className="text-[2.5rem] leading-none font-extrabold text-gray-900 mt-1">4,500</h3>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">personas</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="rounded-[1.25rem] bg-white p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-5">
              <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#f5ebed] text-guinda-dark">
                <PieChart className="h-6 w-6 fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">Ocupación Actual</p>
                <h3 className="text-[2.5rem] leading-none font-extrabold text-gray-900 mt-1">68%</h3>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">3,060 de 4,500 personas</p>
          </div>

        </div>

        {/* Gráfica */}
        <div className="mt-8 flex flex-1 flex-col rounded-[1.25rem] bg-white p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] min-h-[450px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[1.35rem] font-bold text-gray-900">Ocupación de refugios por zona municipal</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Porcentaje de capacidad utilizada · actualizado 9:30 h</p>
            </div>
            <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-[3px] bg-[#662A39]"></span> Normal</div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-[3px] bg-[#C89B3C]"></span> Crítica (&gt;85%)</div>
            </div>
          </div>

          <div className="flex-1 mt-16 border-b border-gray-200 flex items-end justify-around pb-0 text-gray-400 font-bold relative px-4">
            {/* Líneas de fondo */}
            <div className="absolute inset-0 flex flex-col justify-between border-l border-gray-200 pointer-events-none pb-0">
              <div className="w-full border-t border-gray-100 flex-1 relative"><span className="absolute -left-12 -top-2.5 text-xs font-medium">100%</span></div>
              <div className="w-full border-t border-gray-100 flex-1 relative"><span className="absolute -left-11 -top-2.5 text-xs font-medium">75%</span></div>
              <div className="w-full border-t border-gray-100 flex-1 relative"><span className="absolute -left-11 -top-2.5 text-xs font-medium">50%</span></div>
              <div className="w-full border-t border-gray-100 flex-1 relative"><span className="absolute -left-11 -top-2.5 text-xs font-medium">25%</span></div>
              <div className="w-full relative"><span className="absolute -left-9 -top-2.5 text-xs font-medium">0%</span></div>
            </div>

            {/* Barras placeholder basadas en la imagen */}
            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[82%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">82%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">Zona Centro</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[54%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">54%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">Zona Hotelera</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[71%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">71%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">Puerto Juárez</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[91%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">91%</span>
              <div className="w-full h-full bg-[#C89B3C] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">SM 200</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[63%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">63%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">SM 94</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[47%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">47%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">Alfredo V. Bonfil</span>
            </div>

            <div className="relative flex flex-col items-center justify-end w-[4.5rem] h-[38%] z-10 group">
              <span className="mb-3 text-[1rem] font-extrabold text-gray-900">38%</span>
              <div className="w-full h-full bg-[#662A39] rounded-t-lg transition-transform group-hover:scale-y-[1.02] origin-bottom"></div>
              <span className="absolute -bottom-10 text-[0.8rem] font-semibold text-gray-600 whitespace-nowrap">Isla Blanca</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
