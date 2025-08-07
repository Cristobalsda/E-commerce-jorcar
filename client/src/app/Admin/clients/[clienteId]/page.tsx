// /client/src/app/Admin/clients/[clienteId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaSave } from "react-icons/fa";


type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rut: string;
  razon_social: string;
  notas: string;
  activo: boolean;
  direcciones: {
    id: number;
    tipo: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigo_postal: string;
    pais: string;
  }[];
};

async function loadCliente(clienteId: number): Promise<Cliente> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${clienteId}/`
    );
    return res.data;
  } catch (error) {
    console.error('Error al cargar el cliente:', error);
    throw error;
  }
}

async function updateCliente(clienteId: number, data: Cliente) {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${clienteId}/`,
      data
    );
    return res.data;
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    throw error;
  }
}

export default function EditClientePage() {
  const { clienteId } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCliente() {
      try {
        if (clienteId) {
          const clienteData = await loadCliente(Number(clienteId));
          setCliente(clienteData);
        }
      } catch (err) {
        setError('Error al cargar los datos del cliente');
      } finally {
        setLoading(false);
      }
    }

    if (clienteId) fetchCliente();
  }, [clienteId]);

  const handleSaveEdit = async () => {
    if (cliente) {
      try {
        await updateCliente(cliente.id, cliente);
        router.push('/Admin/clients');
      } catch (err) {
        setError('Error al guardar los cambios');
      }
    }
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    if (!cliente) return;
    const updatedDirecciones = [...cliente.direcciones];
    updatedDirecciones[index] = {
      ...updatedDirecciones[index],
      [field]: value,
    };
    setCliente({ ...cliente, direcciones: updatedDirecciones });
  };

  const handleAddAddress = () => {
    if (!cliente) return;
    setCliente({
      ...cliente,
      direcciones: [
        ...cliente.direcciones,
        { id: Date.now(), tipo: 'Facturación', direccion: '', ciudad: '', estado: '', codigo_postal: '', pais: '' },
      ],
    });
  };

  const handleRemoveAddress = (index: number) => {
    if (!cliente) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta dirección?');
    if (confirmDelete) {
      const updatedDirecciones = cliente.direcciones.filter((_, i) => i !== index);
      setCliente({ ...cliente, direcciones: updatedDirecciones });
    }
  };

  if (loading) return <p>Cargando cliente...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Editar Cliente</h1>
      <div className="bg-white shadow-md p-6 rounded">
        <input
          type="text"
          value={cliente?.nombre || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, nombre: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="Nombre"
        />
        <input
          type="email"
          value={cliente?.email || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, email: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="Email"
        />
        <input
          type="text"
          value={cliente?.telefono || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, telefono: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="Teléfono"
        />
        <input
          type="text"
          value={cliente?.rut || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, rut: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="RUT"
        />
        <input
          type="text"
          value={cliente?.razon_social || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, razon_social: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="Razón Social"
        />
        <textarea
          value={cliente?.notas || ''}
          onChange={(e) => cliente && setCliente({ ...cliente, notas: e.target.value })}
          className="border p-2 mb-4 w-full"
          placeholder="Notas"
        />

        {/* Direcciones */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Direcciones</h2>
          {cliente?.direcciones.map((direccion, index) => (
            <div key={direccion.id} className="bg-gray-50 p-4 rounded-lg mb-4 shadow-md">
              <select
                value={direccion.tipo}
                onChange={(e) => handleAddressChange(index, 'tipo', e.target.value)}
                className="border p-2 mb-4 w-full"
              >
                <option value="Facturación">Facturación</option>
                <option value="Envío">Envío</option>
              </select>
              <input
                type="text"
                value={direccion.direccion}
                onChange={(e) => handleAddressChange(index, 'direccion', e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="Dirección"
              />
              <input
                type="text"
                value={direccion.ciudad}
                onChange={(e) => handleAddressChange(index, 'ciudad', e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="Ciudad"
              />
              <input
                type="text"
                value={direccion.estado}
                onChange={(e) => handleAddressChange(index, 'estado', e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="Estado"
              />
              <input
                type="text"
                value={direccion.codigo_postal}
                onChange={(e) => handleAddressChange(index, 'codigo_postal', e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="Código Postal"
              />
              <input
                type="text"
                value={direccion.pais}
                onChange={(e) => handleAddressChange(index, 'pais', e.target.value)}
                className="border p-2 mb-4 w-full"
                placeholder="País"
              />
              <button
                onClick={() => handleRemoveAddress(index)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                <FaTrash/>
              </button>
            </div>
          ))}
          <button
            onClick={handleAddAddress}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            <IoMdAdd/>
          </button>
        </div>

        <button
          onClick={handleSaveEdit}
          className="bg-green-500 text-white px-4 py-2 rounded mt-6"
        >
          <FaSave/>
        </button>
      </div>
    </div>
  );
}
