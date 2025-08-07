'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormProps = {
  onSuccess: () => void;
};

export default function FormBranches({ onSuccess }: FormProps) {
  const [name, setName] = useState<string>('');
  const [direction, setDirection] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sucursal/`,
        {
          nombre: name,
          direccion: direction,
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

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <h1 className="text-center text-xl font-bold">Agregar una sucursal</h1>
        <form className="px-9 py-6" method="POST" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Nombre de la sucursal
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ingresa el nombre de la sucursal"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Direccion
            </label>
            <input
              type="text"
              name="direction"
              id="direction"
              placeholder="Direccion de la sucursal"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setDirection(e.target.value)}
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
