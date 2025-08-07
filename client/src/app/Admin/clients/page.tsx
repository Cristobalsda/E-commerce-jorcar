'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rut: string;
  razon_social: string;
  notas: string;
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

async function loadClientes(): Promise<Cliente[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar los clientes:', error);
    throw error;
  }
}

async function deleteCliente(clienteId: number) {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${clienteId}/`);
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    throw error;
  }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchClientes() {
      try {
        const clienteData = await loadClientes();
        setClientes(clienteData);
        setFilteredClientes(clienteData); // Set filtered clientes initially to all clients
      } catch (err) {
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
  }, []);

  const openModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const closeModal = () => {
    setSelectedCliente(null);
  };

  const handleEdit = (clienteId: number) => {
    router.push(`/Admin/clients/${clienteId}`);
  };

  const handleDelete = async (clienteId: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (confirmDelete) {
      try {
        await deleteCliente(clienteId);
        setClientes(clientes.filter((cliente) => cliente.id !== clienteId));
        setFilteredClientes(filteredClientes.filter((cliente) => cliente.id !== clienteId));
      } catch (err) {
        setError('Error al eliminar el cliente');
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(query) || cliente.rut.toLowerCase().includes(query)
    );
    setFilteredClientes(filtered);
  };

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Lista de Clientes</h1>

      {/* Buscador */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar por nombre o RUT"
          className="px-4 py-2 border rounded-md w-64"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">RUT</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{cliente.nombre}</td>
                <td className="px-6 py-4">{cliente.rut}</td>
                <td className="px-6 py-4">{cliente.email}</td>
                <td className="px-6 py-4">{cliente.telefono || 'No disponible'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => openModal(cliente)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(cliente.id)}  
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90%] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Detalles del Cliente</h2>
            <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
            <p><strong>Email:</strong> {selectedCliente.email}</p>
            <p><strong>Teléfono:</strong> {selectedCliente.telefono || 'No disponible'}</p>
            <p><strong>RUT:</strong> {selectedCliente.rut}</p>
            <p><strong>Razón Social:</strong> {selectedCliente.razon_social}</p>
            <p><strong>Notas:</strong> {selectedCliente.notas}</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Direcciones</h3>
              {selectedCliente.direcciones.map((direccion, index) => (
                <details key={direccion.id} className="mb-4 bg-gray-50 p-4 rounded-lg shadow-md">
                  <summary className="cursor-pointer text-blue-600">
                    {direccion.tipo} - {direccion.ciudad}, {direccion.pais}
                  </summary>
                  <p><strong>Dirección:</strong> {direccion.direccion}</p>
                  <p><strong>Ciudad:</strong> {direccion.ciudad}</p>
                  <p><strong>Estado:</strong> {direccion.estado}</p>
                  <p><strong>Código Postal:</strong> {direccion.codigo_postal}</p>
                  <p><strong>País:</strong> {direccion.pais}</p>
                </details>
              ))}
            </div>

            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              <IoMdClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
