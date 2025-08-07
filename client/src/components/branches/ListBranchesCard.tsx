'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface BranchProps {
  branch: {
    id: number;
    nombre: string;
    direccion: string;
    disponible: boolean;
  };
  onDelete: (id: number) => Promise<void>; // Cambiamos a `Promise` para reflejar la naturaleza asincrónica
  onUpdate: (id: number, nombre: string, direccion: string) => Promise<void>;
  onToggleAvailability: (id: number) => Promise<void>;
}

export default function ListBranchesCard({ branch, onDelete, onUpdate, onToggleAvailability }: BranchProps) {
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(branch.nombre);
  const [newDirection, setNewDirection] = useState(branch.direccion);

  // Estado de los modales
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  // Estado para manejar el montaje en el cliente
  const [isMounted, setIsMounted] = useState(false);

  // Configuración del Modal en Next.js
  useEffect(() => {
    const appElement = document.getElementById('__next');
    if (appElement) {
      Modal.setAppElement('#__next');
      setIsMounted(true);
    }
  }, []);

  const handleDelete = async () => {
    if (selectedBranchId !== null) {
      try {
        await onDelete(selectedBranchId);
        setIsDeleteModalOpen(false); // Cerrar modal después de eliminar
      } catch (error) {
        console.error('Error al eliminar la sucursal:', error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await onUpdate(branch.id, newName, newDirection);
      setIsEditModalOpen(false);
      setEdit(false);
    } catch (error) {
      console.error('Error al actualizar la sucursal:', error);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    setSelectedBranchId(id);
    setIsAvailabilityModalOpen(true);
  };

  const confirmAvailabilityChange = async () => {
    if (selectedBranchId !== null) {
      try {
        await onToggleAvailability(selectedBranchId);
        setIsAvailabilityModalOpen(false);
      } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);
      }
    }
  };

  return (
    <>
      <tr>
        <td className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            {!edit ? (
              <p className="font-bold">{newName}</p>
            ) : (
              <input
                type="text"
                value={newName}
                className="border-none bg-slate-500 p-2 text-green-500 outline-none"
                onChange={(e) => setNewName(e.target.value)}
              />
            )}
          </div>
        </td>
        <td className="border-b border-slate-200 p-4">
          {!edit ? (
            <p className="font-bold">{newDirection}</p>
          ) : (
            <input
              type="text"
              value={newDirection}
              className="border-none bg-slate-500 p-2 text-green-500 outline-none"
              onChange={(e) => setNewDirection(e.target.value)}
            />
          )}
        </td>
        <td className="border-b border-slate-200 p-4">
          <div
            className={`rounded-md px-2 py-1 text-xs font-bold uppercase ${
              branch.disponible ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {branch.disponible ? 'Abierta' : 'Cerrada'}
          </div>
        </td>
        <td>
          {edit ? (
            <button className="bg-indigo-500 p-2 text-white" onClick={handleUpdate}>
              Guardar cambios
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                className="bg-red-500 p-2 text-white"
                onClick={() => {
                  setSelectedBranchId(branch.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                Eliminar
              </button>
              <button className="bg-indigo-500 p-2 text-white" onClick={() => setEdit(!edit)}>
                Editar
              </button>
              <button
                className={`p-2 text-white ${branch.disponible ? 'bg-yellow-500' : 'bg-green-500'}`}
                onClick={() => handleToggleAvailability(branch.id)}
              >
                {branch.disponible ? 'Cerrar' : 'Abrir'}
              </button>
            </div>
          )}
        </td>
      </tr>

      {/* Modal de eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirmación de eliminación"
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById('__next') || document.body} // Pasamos el appElement directamente
      >
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg">
            <span className="font-bold">ADVERTENCIA: Al eliminar esta sucursal eliminaras todos los datos. </span>
            ¿Seguro que quieres eliminar esta sucursal?
          </h2>
          <div className="mt-4 flex gap-4">
            <button className="rounded-md bg-red-500 p-2 text-white" onClick={handleDelete}>
              Eliminar
            </button>
            <button className="rounded-md bg-gray-500 p-2 text-white" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de disponibilidad */}
      <Modal
        isOpen={isAvailabilityModalOpen}
        onRequestClose={() => setIsAvailabilityModalOpen(false)}
        contentLabel="Confirmación de disponibilidad"
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById('__next') || document.body} // Pasamos el appElement directamente
      >
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">
            ¿Estás seguro de que quieres {branch.disponible ? 'cerrar' : 'abrir'} esta sucursal?
          </h2>
          <div className="mt-4 flex gap-4">
            <button className="rounded-md bg-green-500 p-2 text-white" onClick={confirmAvailabilityChange}>
              Confirmar
            </button>
            <button className="rounded-md bg-gray-500 p-2 text-white" onClick={() => setIsAvailabilityModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
