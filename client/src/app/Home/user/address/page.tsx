'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

interface Direccion {
  id?: number; // id opcional
  tipo: string;
  direccion: string;
  ciudad?: string;
  estado?: string;
  codigo_postal?: string;
  pais?: string;
}

export default function Address() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  // Cargar las direcciones del usuario al montar el componente
  useEffect(() => {
    const fetchDirecciones = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/direcciones/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setDirecciones(response.data); // Ajusta si la respuesta tiene una estructura diferente
      } catch (error) {
        console.error('Error al obtener las direcciones:', error);
        setAlert('Hubo un error al obtener las direcciones.');
        setTimeout(() => setAlert(null), 5000);
      }
    };

    fetchDirecciones();
  }, []);

  // Manejar cambios en los campos de las direcciones
  const handleChange = (index: number, field: keyof Direccion, value: string) => {
    const updatedDirecciones = [...direcciones];

    // Actualiza el campo correspondiente sin sobrescribir el id
    updatedDirecciones[index] = {
      ...updatedDirecciones[index],
      [field]: value,
    };

    setDirecciones(updatedDirecciones);
  };

  // Agregar una nueva dirección
  const addDireccion = () => {
    setDirecciones([
      ...direcciones,
      {
        id: undefined, // Inicia con un id vacío o undefined
        tipo: 'Envío',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: '',
      },
    ]);
  };

  // Eliminar una dirección
  const removeDireccion = async (index: number) => {
    const direccionId = direcciones[index].id;

    if (!direccionId) {
      // Si no tiene un ID, es una dirección que no se ha guardado en el backend.
      const updatedDirecciones = direcciones.filter((_, i) => i !== index);
      setDirecciones(updatedDirecciones);
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/direcciones/${direccionId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const updatedDirecciones = direcciones.filter((_, i) => i !== index);
      setDirecciones(updatedDirecciones);
      setAlert('Dirección eliminada exitosamente.');
      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      setAlert('Hubo un error al eliminar la dirección.');
      setTimeout(() => setAlert(null), 5000);
    }
  };

  // Enviar las direcciones al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const updatedDirecciones = await Promise.all(
        direcciones.map(async (direccion) => {
          if (direccion.id) {
            // Si ya tiene id, lo actualizamos
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/direcciones/${direccion.id}/`, direccion, {
              headers: { Authorization: `Token ${token}` },
            });
          } else {
            // Si no tiene id, lo creamos
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/direcciones/`, direccion, {
              headers: { Authorization: `Token ${token}` },
            });
          }
          return direccion; // Devuelve la dirección después de la actualización o creación
        }),
      );

      setDirecciones(updatedDirecciones); // Actualiza las direcciones en el estado
      setAlert('Direcciones actualizadas exitosamente');
      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      console.error('Error al guardar direcciones:', error);
      setAlert('Hubo un error al guardar las direcciones.');
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {alert && (
        <div
          className={`fixed right-4 top-4 rounded-md p-4 text-white ${alert.includes('error') ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {alert}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Agregar Direcciones</h2>

        {direcciones.map((direccion, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Dirección {index + 1}</h3>
              {direcciones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDireccion(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm">Tipo de dirección</label>
              <select
                value={direccion.tipo}
                onChange={(e) => handleChange(index, 'tipo', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="Facturación">Facturación</option>
                <option value="Envío">Envío</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm">Dirección</label>
              <input
                type="text"
                value={direccion.direccion}
                onChange={(e) => handleChange(index, 'direccion', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Dirección"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Ciudad</label>
                <input
                  type="text"
                  value={direccion.ciudad}
                  onChange={(e) => handleChange(index, 'ciudad', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm">Estado</label>
                <input
                  type="text"
                  value={direccion.estado}
                  onChange={(e) => handleChange(index, 'estado', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Código Postal</label>
                <input
                  type="text"
                  value={direccion.codigo_postal}
                  onChange={(e) => handleChange(index, 'codigo_postal', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm">País</label>
                <input
                  type="text"
                  value={direccion.pais}
                  onChange={(e) => handleChange(index, 'pais', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mb-4">
          <button
            type="button"
            onClick={addDireccion}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Agregar Otra Dirección
          </button>
        </div>

        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Guardar Direcciones
        </button>
      </form>
    </div>
  );
}
