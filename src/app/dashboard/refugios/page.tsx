"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, GeoPoint, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, Edit2, Trash2, Check, X, Search } from "lucide-react";

interface Refugio {
  id: string;
  nombre: string;
  direccion: string;
  capacidadMaxima: number;
  personasAlbergadas: number;
  estado: string;
  aceptaMascotas: boolean;
  ubicacion?: any;
}

export default function RefugiosPage() {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal y Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    latitud: "",
    longitud: "",
    capacidadMaxima: "",
    aceptaMascotas: false,
  });

  const fetchRefugios = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "refugios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Refugio[];
      
      setRefugios(data);
    } catch (error) {
      console.error("Error obteniendo refugios:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect se ejecuta al cargar la página para jalar los datos
  useEffect(() => {
    fetchRefugios();
  }, []);

  const handleOpenNew = () => {
    setFormData({ nombre: "", direccion: "", latitud: "", longitud: "", capacidadMaxima: "", aceptaMascotas: false });
    setIsEditing(false);
    setEditingId("");
    setIsModalOpen(true);
  };

  const handleEdit = (refugio: Refugio) => {
    setFormData({
      nombre: refugio.nombre,
      direccion: refugio.direccion,
      latitud: refugio.ubicacion ? refugio.ubicacion.latitude.toString() : "",
      longitud: refugio.ubicacion ? refugio.ubicacion.longitude.toString() : "",
      capacidadMaxima: refugio.capacidadMaxima.toString(),
      aceptaMascotas: refugio.aceptaMascotas,
    });
    setIsEditing(true);
    setEditingId(refugio.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const datosRefugio = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        ubicacion: new GeoPoint(parseFloat(formData.latitud), parseFloat(formData.longitud)),
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        aceptaMascotas: formData.aceptaMascotas,
      };

      if (isEditing) {
        await updateDoc(doc(db, "refugios", editingId), datosRefugio);
      } else {
        await addDoc(collection(db, "refugios"), {
          ...datosRefugio,
          personasAlbergadas: 0,
          estado: "disponible",
        });
      }
      
      setIsModalOpen(false);
      fetchRefugios();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el refugio");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este refugio? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, "refugios", id));
        fetchRefugios();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al eliminar el registro.");
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-guinda">
      {/* Encabezado Principal */}
      <header className="flex h-[100px] shrink-0 items-center justify-between px-10 text-white">
        <h1 className="text-[1.75rem] font-bold tracking-tight">Catálogo de Refugios</h1>
        <button 
          onClick={handleOpenNew}
          className="flex items-center rounded-lg bg-dorado px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Refugio
        </button>
      </header>

      {/* Contenido (Fondo Claro con Borde Redondeado) */}
      <div className="flex flex-1 flex-col overflow-y-auto rounded-tl-[2.5rem] bg-[#f4f6f8] p-10 shadow-inner">
        
        {/* Controles de búsqueda y filtros */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar refugio..." 
              className="w-full rounded-full border border-gray-300 py-3.5 pl-12 pr-4 text-sm text-gray-900 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-[#662A39] px-6 py-3 text-sm font-bold text-white shadow-sm">Todos</button>
            <button className="rounded-full bg-white border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">Disponible</button>
            <button className="rounded-full bg-white border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">Lleno</button>
          </div>
        </div>

        {/* Tabla */}
        <div className="flex-1 rounded-[1.25rem] bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-[#fcf2f4] text-[0.7rem] font-bold text-[#8A3F52] uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Nombre</th>
                  <th className="px-6 py-5">Dirección</th>
                  <th className="px-6 py-5">Capacidad</th>
                  <th className="px-6 py-5 text-center">Mascotas</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-8 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">Cargando datos desde Firebase...</td>
                  </tr>
                ) : refugios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">No hay refugios registrados actualmente.</td>
                  </tr>
                ) : (
                  refugios.map((refugio) => {
                    const ocupacionPorcentaje = Math.min(100, Math.round((refugio.personasAlbergadas / refugio.capacidadMaxima) * 100)) || 0;
                    return (
                      <tr key={refugio.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 font-bold text-gray-900">{refugio.nombre}</td>
                        <td className="px-6 py-5 text-gray-500">{refugio.direccion}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2 w-28">
                            <span className="font-bold text-gray-900">{refugio.personasAlbergadas}<span className="text-gray-400 font-semibold">/{refugio.capacidadMaxima}</span></span>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${ocupacionPorcentaje > 85 ? 'bg-[#662A39]' : 'bg-guinda'}`} 
                                style={{ width: `${ocupacionPorcentaje}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            {refugio.aceptaMascotas ? (
                              <div className="flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600">
                                <Check className="h-3 w-3" strokeWidth={4} />
                              </div>
                            ) : (
                              <div className="flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full bg-red-50 border border-red-200 text-red-500">
                                <X className="h-3 w-3" strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {refugio.estado?.toLowerCase() === 'lleno' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1.5 text-[0.7rem] font-bold text-red-700 uppercase tracking-wide">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                              Lleno
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1.5 text-[0.7rem] font-bold text-green-700 uppercase tracking-wide">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                              Disponible
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleEdit(refugio)}
                              className="text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <Edit2 className="h-[1.15rem] w-[1.15rem]" />
                            </button>
                            <button 
                              onClick={() => handleDelete(refugio.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-[1.15rem] w-[1.15rem]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer de Paginación */}
          <div className="border-t border-gray-100 bg-white px-8 py-5 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">Mostrando 1-{refugios.length || 0} de {refugios.length || 0} refugios</p>
            <div className="flex items-center gap-2">
              <button className="h-8 w-8 rounded-lg bg-[#662A39] text-sm font-bold text-white shadow-sm flex items-center justify-center">1</button>
              <button className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-50">2</button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-xl font-bold text-guinda">{isEditing ? "Editar Refugio" : "Registrar Nuevo Refugio"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Nombre del Albergue</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="Ej. Primaria Leona Vicario"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="Ej. SM 100, Calle 12"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitud}
                    onChange={(e) => setFormData({...formData, latitud: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                    placeholder="21.1619"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitud}
                    onChange={(e) => setFormData({...formData, longitud: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                    placeholder="-86.8515"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Capacidad Máxima</label>
                <input
                  type="number"
                  value={formData.capacidadMaxima}
                  onChange={(e) => setFormData({...formData, capacidadMaxima: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda"
                  placeholder="300"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mascotas"
                  checked={formData.aceptaMascotas}
                  onChange={(e) => setFormData({...formData, aceptaMascotas: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-guinda focus:ring-guinda"
                />
                <label htmlFor="mascotas" className="text-sm font-semibold text-gray-700">Acepta Mascotas</label>
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
                  className="rounded-lg bg-guinda px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-guinda-dark transition-colors"
                >
                  {isEditing ? "Guardar Cambios" : "Guardar Refugio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
