"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Users, Bell, LogOut } from "lucide-react";
import { auth } from "../../lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Función para cerrar sesión
  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Refugios", href: "/dashboard/refugios", icon: Shield },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
    { name: "Alertas", href: "/dashboard/alertas", icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-guinda">
      {/* Sidebar Lateral */}
      <aside className="flex w-[16.5rem] flex-col text-white">
        
        {/* Logo y Encabezado */}
        <div className="flex items-center gap-3.5 p-7">
          <img
            src="/logoproteccion.png"
            alt="Logo de Protección Civil"
            className="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full bg-white object-cover p-1 shadow-sm"
          />
          <div>
            <h2 className="text-[0.95rem] font-bold leading-tight tracking-wide">Protección Civil</h2>
            <p className="mt-0.5 text-[0.8rem] font-medium text-dorado">Benito Juárez</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 space-y-1.5 px-5 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 rounded-r-xl rounded-l-sm px-4 py-3.5 text-[0.95rem] font-semibold transition-colors ${
                  isActive
                    ? "bg-[#883d50] border-l-[5px] border-dorado"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-300"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Perfil del Usuario / Botón Salir */}
        <div className="flex items-center justify-between border-t border-white/10 p-7">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5D5B5] text-sm font-bold text-guinda-dark shadow-sm">
              AD
            </div>
            <div>
              <p className="text-[0.9rem] font-bold leading-tight">Administrador</p>
              <p className="text-[0.75rem] text-gray-300 mt-0.5">Protección Civil</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors" title="Cerrar Sesión">
            <LogOut className="h-[1.15rem] w-[1.15rem]" />
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
