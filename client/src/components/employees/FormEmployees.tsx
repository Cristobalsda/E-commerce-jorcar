'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormProps = {
  onSuccess: () => void;
};
interface Branch {
  id: number;
  nombre: string;
  direccion: string;
}

export default function FormEmployees({ onSuccess }: FormProps) {
  const [name, setName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [salary, setSalary] = useState<number | string>('');
  const [dateContract, setDateContract] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleado/`,
        {
          nombre: name,
          puesto: position,
          sucursal: branch,
          salario: salary,
          fecha_contratacion: dateContract,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      onSuccess();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
    router.refresh();
  };
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/`);
        setBranches(res.data);
      } catch (error) {
        console.log('Error al obtener los datos de las sucursales:', error);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <h1 className="text-center text-xl font-bold">Agregar un empleado</h1>
        <form className="px-9 py-6" method="POST" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Nombre y apellido de la persona
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ingresa el nombre y apellido de la persona"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Puesto
            </label>
            <input
              type="text"
              name="puesto"
              id="puesto"
              placeholder="ej: puesto de mecanico"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="sucursal" className="mb-3 block text-base font-medium text-[#07074D]">
              Sucursal
            </label>
            <select
              name="sucursal"
              id="sucursal"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Selecciona una sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Salario
            </label>
            <input
              type="number"
              name="salario"
              id="salario"
              placeholder="$50.000"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Fecha de contratacion
            </label>
            <input
              type="date"
              name="fecha"
              id="fecha"
              placeholder="ej: puesto de mecanico"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setDateContract(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="hover:shadow-form w-full rounded-md bg-[#6A64F1] px-8 py-3 text-center text-base font-semibold text-white outline-none"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
