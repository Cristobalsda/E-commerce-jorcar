'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import ProductCard from '@/components/cards/ProductCard';

interface HomeCategoryProps {
  params: Promise<{ id: number }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children: Category[];
}

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: number;
  imagenes: string[];
}

export default function HomeCategories({ params }: HomeCategoryProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/${id}/`);
        setCategory(response.data);
      } catch (error) {
        setError('No se pudo obtener la categoría.');
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/`, {
          params: {
            categoria: category.id,
          },
        });
        setProducts(response.data);
      } catch (error) {
        setError('No se pudo obtener los productos.');
      }
    };

    fetchProducts();
  }, [category]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!category) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-b-8 border-t-8 border-gray-200"></div>
          <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-b-8 border-t-8 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-yellow-500 py-6 shadow-md">
        <h1 className="text-center text-3xl font-bold capitalize text-white">{category.name}</h1>
      </div>
      {category.children && category.children.length > 0 && (
        <div>
          <h2>Subcategorías:</h2>
          <ul>
            {category.children.map((child) => (
              <li key={child.id}>{child.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {products.length > 0 ? (
          <div className="mx-auto grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <p>No se encontraron productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
}
