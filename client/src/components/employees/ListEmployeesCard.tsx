'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface EmployeeProps {
  employee: {
    id: number;
    nombre: string;
    puesto: string;
    sucursal: string;
    salario: number;
    fecha_contratacion: string;
  };
  onDelete: (id: number) => void; // Callback para eliminar
  onUpdate: (
    id: number,
    nombre: string,
    puesto: string,
    sucursal: string,
    salario: number,
    fecha_contratacion: string,
  ) => void; // Callback para actualizar
}
interface Branch {
  id: number; // O el tipo que tenga tu `id`
  nombre: string;
  direccion: string; // Si no necesitas `direccion`, puedes omitirla
}

export default function ListEmployeesCard({ employee, onDelete, onUpdate }: EmployeeProps) {
  const [edit, setEdit] = useState(false);

  const [newName, setNewName] = useState(employee.nombre);
  const [newPosition, setNewPosition] = useState(employee.puesto);
  const [newBranch, setNewBranch] = useState(employee.sucursal);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newSalary, setNewSalary] = useState<number>(employee.salario);
  const [newContractDate, setNewContractDate] = useState(employee.fecha_contratacion);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/`);
        setBranches(res.data); // Ajusta "branch.nombre" según el formato de tu API
      } catch (error) {
        console.log('Error al obtener los datos de las sucursales:', error);
      }
    };
    fetchBranches();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Quieres eliminar esta sucursal?')) {
      await onDelete(id); // Llamamos al callback en el componente principal
    }
  };

  const handleUpdate = async () => {
    await onUpdate(employee.id, newName, newPosition, newBranch, newSalary, newContractDate); // Llamamos al callback en el componente principal
    setEdit(false); // Finalizamos la edición
  };

  return (
    <tr>
      <td className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
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
        </div>
      </td>
      <td className="border-b border-slate-200 p-4">
        {!edit ? (
          <p className="font-bold">{newPosition}</p>
        ) : (
          <input
            type="text"
            value={newPosition}
            className="border-none bg-slate-500 p-2 text-green-500 outline-none"
            onChange={(e) => setNewPosition(e.target.value)}
          />
        )}
      </td>
      <td className="border-b border-slate-200 p-4">
        {!edit ? (
          <p className="font-bold">
            {branches.find((branch) => branch.id === Number(newBranch))?.nombre || 'Sucursal no encontrada'}
          </p>
        ) : (
          <select
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            className="border-none bg-slate-500 p-2 text-green-500 outline-none"
          >
            <option value="">Selecciona una sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="border-b border-slate-200 p-4">
        {!edit ? (
          <p className="font-bold">{newSalary}</p>
        ) : (
          <input
            type="number"
            value={newSalary}
            className="border-none bg-slate-500 p-2 text-green-500 outline-none"
            onChange={(e) => setNewSalary(parseFloat(e.target.value))}
          />
        )}
      </td>
      <td className="border-b border-slate-200 p-4">
        {!edit ? (
          <p className="font-bold">{newContractDate}</p>
        ) : (
          <input
            type="date"
            value={newContractDate}
            className="border-none bg-slate-500 p-2 text-green-500 outline-none"
            onChange={(e) => setNewContractDate(e.target.value)}
          />
        )}
      </td>
      <td className="border-b border-slate-200 p-4">
        {edit ? (
          <button className="rounded-md bg-indigo-500 p-2 text-white" onClick={handleUpdate}>
            Guardar cambios
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-x-5">
            <button className="rounded-md bg-red-500 p-2 text-white" onClick={() => handleDelete(employee.id)}>
              Eliminar
            </button>
            <button className="rounded-md bg-indigo-500 p-2 text-white" onClick={() => setEdit(!edit)}>
              Editar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
