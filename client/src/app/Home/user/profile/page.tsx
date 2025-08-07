'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  razon_social: string;
}

export default function EditUserProfile() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    telefono: '',
    rut: '',
    razon_social: '',
  });
  const [alert, setAlert] = useState<string | null>(null); // Manejo de alertas

  useEffect(() => {
    const fetchCliente = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get<Cliente>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setCliente(response.data);
        setFormData({
          telefono: response.data.telefono || '',
          rut: response.data.rut || '',
          razon_social: response.data.razon_social || '',
        });
      } catch (error) {
        console.error('Error fetching cliente:', error);
      }
    };
    fetchCliente();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/me/`, formData, {
        headers: { Authorization: `Token ${token}` },
      });
      setAlert('Tu información ha sido actualizada exitosamente.');
      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      console.error('Error updating cliente:', error);
      setAlert('Hubo un error al actualizar tu información.');
      setTimeout(() => setAlert(null), 5000);
    }
  };

  if (!cliente) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-b-8 border-t-8 border-gray-200"></div>
          <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-b-8 border-t-8 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Perfil del Usuario</h1>

      {/* Mostrar alerta */}
      {alert && (
        <div
          className={`fixed right-5 top-5 z-50 flex items-center rounded-md px-6 py-4 text-lg shadow-lg ${alert.includes('exitosamente') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`${alert.includes('exitosamente') ? 'text-green-600' : 'text-red-600'} mr-3 h-5 w-5 sm:h-5 sm:w-5`}
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <span>{alert}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-700">Nombre</label>
          <input
            type="text"
            value={cliente.nombre}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-700 shadow-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Correo</label>
          <input
            type="email"
            value={cliente.email}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-700 shadow-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ingrese su teléfono"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">RUT</label>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="Ingrese su RUT"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Razón Social</label>
          <input
            type="text"
            name="razon_social"
            value={formData.razon_social}
            onChange={handleChange}
            placeholder="Ingrese su razón social"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
