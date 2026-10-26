"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { AlertTriangle, Radio, ShieldAlert } from "lucide-react";

export default function AlertasPage() {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nivel, setNivel] = useState("naranja");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const niveles = [
    { id: "verde",    nombre: "Verde - Peligro Bajo",     color: "bg-green-500",  ring: "ring-green-400",  text: "text-green-700",  bg: "bg-green-50",  border: "border-green-300" },
    { id: "amarillo", nombre: "Amarillo - Moderado",       color: "bg-yellow-400", ring: "ring-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" },
    { id: "naranja",  nombre: "Naranja - Peligro Alto",    color: "bg-orange-500", ring: "ring-orange-400", text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300" },
    { id: "rojo",     nombre: "Rojo - Peligro Máximo",     color: "bg-red-600",    ring: "ring-red-500",    text: "text-red-700",   bg: "bg-red-50",    border: "border-red-400" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`¿Estás seguro de emitir una Alerta ${nivel.toUpperCase()} a la ciudadanía?`)) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "alertas"), {
        titulo,
        mensaje,
        nivel,
        fechaEmision: new Date(),
        activa: true,
      });
      alert("¡Alerta emitida exitosamente!");
      setTitulo("");
      setMensaje("");
      setNivel("naranja");
    } catch (error) {
      console.error("Error al emitir alerta:", error);
      alert("Hubo un error al emitir la alerta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nivelActual = niveles.find((n) => n.id === nivel)!;

  return (
    <div className="flex h-full flex-col bg-guinda">
      {/* Encabezado */}
      <header className="flex h-[100px] shrink-0 items-center gap-4 px-10 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <ShieldAlert className="h-6 w-6 text-dorado" />
        </div>
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight leading-tight">Emisión de Alerta Masiva</h1>
          <p className="text-sm text-white/60 font-medium mt-0.5">Sistema de Notificación Ciudadana — SIAT-CT</p>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex flex-1 flex-col overflow-y-auto rounded-tl-[2.5rem] bg-[#f4f6f8] p-10 shadow-inner">
        <div className="mx-auto w-full max-w-2xl">

          {/* Banner informativo */}
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <Radio className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-bold text-amber-800">Canal de emisión activo</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Utiliza este formulario para notificar a la población sobre cambios en el semáforo meteorológico.
                La alerta será recibida en tiempo real por todos los dispositivos móviles registrados.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Título */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]">
              <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Título de la Alerta
              </label>
              <input
                type="text"
                value={titulo}
                required
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Evacuación preventiva zona costera"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 placeholder-gray-400 focus:border-guinda focus:bg-white focus:outline-none focus:ring-2 focus:ring-guinda/20 transition-all"
              />
            </div>

            {/* Mensaje */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]">
              <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Mensaje a la Ciudadanía
              </label>
              <textarea
                value={mensaje}
                required
                maxLength={240}
                rows={5}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe aquí el mensaje que recibirán los ciudadanos en sus dispositivos..."
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-guinda focus:bg-white focus:outline-none focus:ring-2 focus:ring-guinda/20 transition-all"
              />
              <div className="mt-2 flex items-center justify-end gap-1">
                <div className={`h-1.5 rounded-full transition-all ${mensaje.length > 200 ? 'bg-red-400' : 'bg-guinda/30'}`} style={{ width: `${(mensaje.length / 240) * 60}px` }} />
                <span className={`text-xs font-medium ${mensaje.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                  {mensaje.length} / 240 caracteres
                </span>
              </div>
            </div>

            {/* Selector de Nivel */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]">
              <label className="mb-4 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Nivel de Peligro (Semáforo SIAT-CT)
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {niveles.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNivel(n.id)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                      nivel === n.id
                        ? `${n.border} ${n.bg} shadow-sm scale-[1.03]`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-full shadow-md ${n.color} ${nivel === n.id ? `ring-4 ${n.ring}/40` : ''}`} />
                    <span className={`text-[0.7rem] font-black uppercase tracking-widest ${nivel === n.id ? n.text : 'text-gray-500'}`}>
                      {n.id}
                    </span>
                  </button>
                ))}
              </div>
              {/* Descripción del nivel seleccionado */}
              <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-2.5 ${nivelActual.bg} border ${nivelActual.border}`}>
                <div className={`h-2.5 w-2.5 rounded-full ${nivelActual.color}`} />
                <span className={`text-sm font-semibold ${nivelActual.text}`}>{nivelActual.nombre}</span>
              </div>
            </div>

            {/* Botón de Emisión */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-red-600 px-6 py-5 text-xl font-black text-white shadow-lg transition-all hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                <AlertTriangle size={26} className={isSubmitting ? "animate-bounce" : ""} />
                {isSubmitting ? "EMITIENDO ALERTA..." : "EMITIR ALERTA A LA POBLACIÓN"}
              </button>
              <p className="mt-4 text-center text-xs font-medium text-gray-400">
                Esta acción generará un registro inmediato y permanente en la base de datos de Protección Civil.<br />
                Verifica la información antes de proceder.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
