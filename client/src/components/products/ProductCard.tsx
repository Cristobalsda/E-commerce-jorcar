'use client';

import axios from 'axios';
import { useState } from 'react';
import EditProductForm from './EditProductForm';

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  categoria: number;
  calidad: string;
};
interface ProductProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes: string[];
    categoria: number;
    calidad: string;
  };
  onDelete: (id: number) => void;
  onUpdate: (updatedProduct: Product) => void; // Nueva función
}

export default function ProductCard({ product, onDelete, onUpdate }: ProductProps) {
  const [edit, setEdit] = useState(false);

  const handleUpdateProduct = async (updatedProduct: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    nuevasImagenes: File[];
    imagenesAEliminar: number[];
    categoria: number;
    calidad: string;
  }) => {
    const formData = new FormData();
    formData.append('nombre', updatedProduct.nombre);
    formData.append('descripcion', updatedProduct.descripcion);
    formData.append('precio', String(updatedProduct.precio));
    updatedProduct.nuevasImagenes.forEach((image) => formData.append('imagenes', image));
    formData.append('imagenes_a_eliminar', JSON.stringify(updatedProduct.imagenesAEliminar));
    formData.append('categoria', String(updatedProduct.categoria));
    formData.append('calidad', updatedProduct.calidad);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/${updatedProduct.id}/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      onUpdate(res.data); // Llamar a la función de actualización con el producto actualizado
      setEdit(false);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <>
      {/* Tarjeta de producto */}
      <div className="mb-4 flex flex-col items-center rounded-lg bg-slate-700 p-4 text-slate-200 shadow-lg">
        <h2 className="text-center text-xl font-bold text-white">{product.nombre}</h2>
        <p
          className="w-full truncate text-sm text-gray-300"
          dangerouslySetInnerHTML={{ __html: product.descripcion || '' }}
        ></p>
        <p className="text-lg font-semibold text-green-400">${product.precio.toLocaleString('es-CL')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {product.imagenes.map((image, index) => (
            <div key={index} className="h-20 w-20 overflow-hidden rounded border border-slate-600 shadow-md">
              <img src={image} alt={`Imagen ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex w-full gap-2">
          <button
            className="flex-1 rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
            onClick={() => onDelete(product.id)}
          >
            Eliminar producto
          </button>
          <button
            className="flex-1 rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
            onClick={() => setEdit(true)}
          >
            Editar
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {edit && (
        <div className="fixed left-0 top-0 flex h-screen w-full items-start justify-end bg-black bg-opacity-50">
          <div className="absolute inset-0" onClick={() => setEdit(false)}></div>
          <div className="h-screen max-w-screen-sm rounded-lg bg-white p-4 shadow-lg">
            <EditProductForm product={product} onSave={handleUpdateProduct} onCancel={() => setEdit(false)} />
          </div>
        </div>
      )}
    </>
  );
}
