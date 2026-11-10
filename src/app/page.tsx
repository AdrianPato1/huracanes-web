"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, correo, password);
      console.log("Acceso concedido");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no registrado.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f8]">
      {/* Barra superior guinda */}
      <div className="h-4 w-full bg-guinda"></div>

      {/* Contenedor principal */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">

          {/* Encabezado / Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src="/logoproteccion.png"
              alt="Logo de Protección Civil"
              className="mb-4 h-20 w-20"
            />
            
            <h1 className="text-xl font-bold text-guinda">
              Portal de Administración -<br />Protección Civil
            </h1>
            <p className="mt-2 text-xs font-medium text-gray-500">
              Dirección de Protección Civil · Benito Juárez
            </p>
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-alerta-rojo">
                {error}
              </div>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                placeholder="usuario@proteccioncivil.gob.mx"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                placeholder="••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-dorado px-4 py-3 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-dorado-dark focus:outline-none focus:ring-2 focus:ring-dorado focus:ring-offset-2 active:scale-[0.98]"
            >
              Ingresar al sistema
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-xs font-bold text-guinda transition-colors hover:text-guinda-dark hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="pb-6 text-center text-xs font-medium text-gray-500">
        © 2026 Dirección de Protección Civil de Benito Juárez · Acceso restringido a personal autorizado
      </div>
    </div>
  );
}
