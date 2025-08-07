'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { FaCar } from 'react-icons/fa';

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  categoria: number;
  calidad: string;
};

async function loadProduct(): Promise<Product[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/`);
    return res.data; // `axios` devuelve los datos directamente en `res.data`
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    throw error; // Opcional: vuelve a lanzar el error si necesitas manejarlo en otro lugar
  }
}

export default function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar el producto?')) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/${id}/`, { method: 'DELETE' });
      if (res.status === 204) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      }
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product)),
    );
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productData = await loadProduct();
        setProducts(productData);
      } catch (err) {
        setError('Error al cargar los productos');
      }
    }

    fetchProducts();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col items-center justify-between sm:flex-row">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Repuestos</h1>
        <Link
          className="mt-3 flex items-center gap-2 rounded bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-900 sm:mt-0"
          href="/Admin/products/add_product"
        >
          <FaCar size={15} />
          Agregar un repuesto
        </Link>
      </div>

      {/* Lista de productos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            onDelete={handleDeleteProduct}
            onUpdate={handleUpdateProduct} // Pasar la función de actualización
          />
        ))}
      </div>

      {/* Mensaje si no hay productos */}
      {products.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-500">No hay repuestos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}
