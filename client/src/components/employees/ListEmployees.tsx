// ListBranches.tsx
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiUserPlus } from 'react-icons/hi2';
import { RiExpandUpDownLine } from 'react-icons/ri';
import FormEmployees from './FormEmployees';
import ListEmployeesCard from './ListEmployeesCard';

type Employees = {
  id: number;
  nombre: string;
  puesto: string;
  sucursal: string;
  salario: number;
  fecha_contratacion: string;
};

async function loadEmployee(): Promise<Employees[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleado/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar la sucursal:', error);
    throw error;
  }
}

export default function ListEmployees() {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false); // Estado para mostrar el alert

  // Cargar las sucursales al montar el componente
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeeData = await loadEmployee();
        setEmployees(employeeData);
      } catch (err) {
        setError('Error al cargar la sucursal:');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const handleNewEmployee = () => {
    loadEmployee().then((data) => setEmployees(data));
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleado/${id}/`, { method: 'DELETE' });
      if (res.status === 204) {
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
    }
  };

  // Función para actualizar datos del empleado
  const handleUpdateEmployee = async (
    id: number,
    newName: string,
    newPosition: string,
    newBranch: string,
    newSalary: number,
    newContractDate: string,
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleado/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: newName,
          puesto: newPosition,
          sucursal: newBranch,
          salario: newSalary,
          fecha_contratacion: newContractDate,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedEmployee = await res.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === id
            ? {
                ...employee,
                nombre: updatedEmployee.nombre,
                puesto: updatedEmployee.puesto,
                sucursal: updatedEmployee.sucursal,
                salario: updatedEmployee.salario,
                fecha_contratacion: updatedEmployee.fecha_controtacion,
              }
            : employee,
        ),
      );
    } catch (error) {
      console.error('Error al actualizar la sucursal:', error);
    }
  };

  // Función para manejar el cierre del modal y mostrar la alerta estilizada
  const handleFormSuccess = () => {
    setOpen(false); // Cierra el modal
    setAlertVisible(true); // Muestra el alert
    handleNewEmployee(); // Recarga los empleados para reflejar el nuevo

    // Desaparece el alert después de 3 segundos
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto max-w-fit">
      {/* Alert estilizado */}
      {alertVisible && (
        <div className="fixed right-5 top-5 z-50 rounded-md bg-green-500 px-4 py-2 text-white shadow-lg">
          <p>Empleado agregado correctamente</p>
        </div>
      )}

      <div className="relative flex h-full w-full flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
        <div className="relative mx-4 mt-4 overflow-hidden rounded-none bg-white bg-clip-border text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Lista de Empleados</h3>
            </div>
            <div className="relative ml-2 flex shrink-0 flex-col gap-2 sm:flex-row lg:ml-4">
              <button
                className="flex select-none items-center gap-2 rounded bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setOpen(!open)}
              >
                <HiUserPlus size={15} />
                Agregar empleado
              </button>

              {open && (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setOpen(false)} />
                  <div className="relative mx-auto w-full max-w-lg rounded-lg bg-white p-4">
                    <FormEmployees onSuccess={handleFormSuccess} />
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
                    Puesto
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Sucursal
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Salario
                    <RiExpandUpDownLine />
                  </p>
                </th>
                <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Fecha Contratacion
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
              {employees.map((employee) => (
                <ListEmployeesCard
                  employee={employee}
                  key={employee.id}
                  onDelete={handleDeleteEmployee}
                  onUpdate={handleUpdateEmployee}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
