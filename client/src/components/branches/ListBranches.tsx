'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiUserPlus } from 'react-icons/hi2';
import { RiExpandUpDownLine } from 'react-icons/ri';
import FormBranches from './FormBranches';
import ListBranchesCard from './ListBranchesCard';

type Branch = {
  id: number;
  nombre: string;
  direccion: string;
  disponible: boolean; // Añadir propiedad de disponibilidad
};

async function loadBranch(): Promise<Branch[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar la sucursal:', error);
    throw error;
  }
}

export default function ListBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const productData = await loadBranch();
        setBranches(productData);
      } catch (err) {
        setError('Error al cargar la sucursal:');
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, []);

  const handleNewBranch = async () => {
    try {
      const data = await loadBranch();
      setBranches(data);
      setOpen(false);
      setSuccessMessage('¡Sucursal guardada exitosamente!'); // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error al guardar la sucursal:', error);
    }
  };

  const handleDeleteBranch = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/${id}/`, { method: 'DELETE' });
      if (res.status === 204) {
        setBranches((prevBranches) => prevBranches.filter((branch) => branch.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
    }
  };

  const handleUpdateBranch = async (id: number, newName: string, newDirection: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ nombre: newName, direccion: newDirection }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedBranch = await res.json();
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.id === id ? { ...branch, nombre: updatedBranch.nombre, direccion: updatedBranch.direccion } : branch,
        ),
      );
    } catch (error) {
      console.error('Error al actualizar la sucursal:', error);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/${id}/toggle-disponibilidad/`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updatedBranch = await res.json();
        setBranches((prevBranches) =>
          prevBranches.map((branch) => (branch.id === id ? { ...branch, disponible: !branch.disponible } : branch)),
        );
      }
    } catch (error) {
      console.error('Error al cambiar el estado de disponibilidad:', error);
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto max-w-[720px]">
      {successMessage && (
        <div className="mb-4 rounded bg-green-500 p-4 text-white">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage(null)} className="float-right text-white">
            ✕
          </button>
        </div>
      )}

      <div className="relative flex h-full w-full flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
        <div className="relative mx-4 mt-4 overflow-hidden rounded-none bg-white bg-clip-border text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Lista de sucursales</h3>
            </div>
            <div className="relative ml-2 flex shrink-0 flex-col gap-2 sm:flex-row lg:ml-4">
              <button
                className="flex select-none items-center gap-2 rounded bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setOpen(!open)}
              >
                <HiUserPlus size={15} />
                Agregar una sucursal
              </button>

              {open && (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setOpen(false)} />
                  <div className="relative mx-auto w-full max-w-lg rounded-lg bg-white p-4">
                    <FormBranches onSuccess={handleNewBranch} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-scroll p-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Nombre
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Dirección
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Estado
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"></th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <ListBranchesCard
                  branch={branch}
                  key={branch.id}
                  onDelete={handleDeleteBranch}
                  onUpdate={handleUpdateBranch}
                  onToggleAvailability={handleToggleAvailability} // Pasamos la función aquí
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
