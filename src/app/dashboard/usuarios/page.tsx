"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { UserPlus, Edit2, Trash2, Shield, User } from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  cargo: string;
  activo: boolean;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "operador",
    cargo: "",
    activo: true,
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Usuario[];
      setUsuarios(data);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenNew = () => {
    setFormData({ nombre: "", correo: "", rol: "operador", cargo: "", activo: true });
    setIsEditing(false);
    setEditingId("");
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      cargo: usuario.cargo,
      activo: usuario.activo,
    });
    setIsEditing(true);
    setEditingId(usuario.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const datosUsuario = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        cargo: formData.cargo,
        activo: formData.activo,
        fechaCreacion: new Date(),
      };

      if (isEditing) {
        await updateDoc(doc(db, "usuarios", editingId), datosUsuario);
      } else {
        await addDoc(collection(db, "usuarios"), datosUsuario);
      }

      setIsModalOpen(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el usuario");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de revocar el acceso y eliminar a este usuario?")) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-guinda">
      {/* Encabezado Principal */}
      <header className="flex h-[100px] shrink-0 items-center justify-between px-10 text-white">
        <h1 className="text-[1.75rem] font-bold tracking-tight">Gestión de Usuarios</h1>
        <button
          onClick={handleOpenNew}
          className="flex items-center rounded-lg bg-dorado px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Nuevo Usuario
        </button>
      </header>

      {/* Contenido */}
      <div className="flex flex-1 flex-col overflow-y-auto rounded-tl-[2.5rem] bg-[#f4f6f8] p-10 shadow-inner">
        <div className="flex-1 rounded-[1.25rem] bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-[#fcf2f4] text-[0.7rem] font-bold text-[#8A3F52] uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Nombre</th>
                  <th className="px-6 py-5">Correo Institucional</th>
                  <th className="px-6 py-5">Cargo</th>
                  <th className="px-6 py-5">Nivel de Acceso</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-8 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                      Cargando personal autorizado...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-900">{usuario.nombre}</td>
                      <td className="px-6 py-5 text-gray-500">{usuario.correo}</td>
                      <td className="px-6 py-5 text-gray-700">{usuario.cargo}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {usuario.rol === "administrador" ? (
                            <Shield className="h-4 w-4 text-guinda" />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="capitalize text-gray-700 font-medium">{usuario.rol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {usuario.activo ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1.5 text-[0.7rem] font-bold text-green-700 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1.5 text-[0.7rem] font-bold text-red-700 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            Suspendido
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                            title="Editar usuario"
                          >
                            <Edit2 className="h-[1.15rem] w-[1.15rem]" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-[1.15rem] w-[1.15rem]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 bg-white px-8 py-5 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-xl font-bold text-guinda">
              {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="usuario@proteccioncivil.gob.mx"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Cargo</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="Ej. Coordinador"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Rol en el Sistema</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda bg-white"
                >
                  <option value="operador">Operador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-guinda focus:ring-guinda"
                />
                <label htmlFor="activo" className="text-sm font-semibold text-gray-700">
                  Cuenta Activa (Permite el acceso al sistema)
                </label>
              </div>
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-guinda px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#662A39] transition-colors"
                >
                  {isEditing ? "Guardar Cambios" : "Guardar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
