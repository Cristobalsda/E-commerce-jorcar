'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { RiExpandUpDownLine } from 'react-icons/ri';
import { useCart } from '@/context/CardContext';

interface ProductId {
  id: number;
}

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
};

async function loadProduct(id: number): Promise<Product> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/${id}/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    throw error;
  }
}

export default function DetailProduct({ id }: ProductId) {
  const { addToCart, decrementFromCart } = useCart();
  const [image, setImage] = useState<number>(1);
  const [products, setProducts] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Estado para saber si el producto fue añadido al carrito
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad

  const handleAddToCart = () => {
    if (products) {
      addToCart({
        id: products.id,
        nombre: products.nombre,
        precio: products.precio,
        cantidad: quantity,
        imagen: products.imagenes[0],
      });
      setIsAddedToCart(true); // Marcar que el producto fue añadido al carrito
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productData = await loadProduct(id);
        setProducts(productData);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-6">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <a href="#" className="hover:text-gray-600 hover:underline">
            Inicio
          </a>
          <span>
            <FaChevronRight color="#d1d5db" size={16} />
          </span>
          <a href="#" className="hover:text-gray-600 hover:underline">
            Electronica
          </a>
          <span>
            <FaChevronRight color="#d1d5db" size={16} />
          </span>
          <span>Baterias</span>
        </div>
      </div>
      {/* ./ Breadcrumbs */}

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 flex flex-col md:flex-row">
          <div className="px-4 md:flex-1">
            <div>
              <div className="mb-4 rounded-lg bg-white md:h-80">
                {products && products.imagenes && (
                  <Image
                    src={products.imagenes[image - 1]}
                    alt={`Producto imagen ${image}`}
                    width={500}
                    height={500}
                    className="mb-4 h-64 w-full rounded-lg object-contain md:h-80"
                  />
                )}
              </div>

              <div className="-mx-2 mb-4 flex gap-5">
                {products &&
                  products.imagenes &&
                  products.imagenes.map((img, i) => (
                    <div className="flex-1 rounded-xl px-2 outline outline-offset-2 outline-gray-100" key={i}>
                      <button
                        onClick={() => setImage(i + 1)}
                        className={`flex w-full items-center justify-center rounded-lg bg-gray-100 focus:outline-none md:h-32 ${
                          image === i + 1 ? 'ring-2 ring-inset ring-indigo-300' : ''
                        }`}
                      >
                        <Image
                          src={img}
                          width={100}
                          height={100}
                          alt={`Miniatura ${i + 1}`}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="px-4 md:flex-1">
            <h2 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-800 md:text-3xl">
              {products?.nombre}
            </h2>

            <div className="my-4 flex items-center space-x-4">
              <div>
                <div className="flex rounded-lg bg-gray-100 px-3 py-2">
                  <span className="mr-1 mt-1 stroke-black text-xl text-black">$</span>
                  <span className="text-3xl font-bold text-black">{products?.precio.toLocaleString('es-CL')}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-green-500">Descuento 12%</p>
                <p className="text-sm text-gray-400">Disponible en tienda</p>
              </div>
            </div>

            <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: products?.descripcion || '' }}></p>

            <div className="flex items-center space-x-4 py-4">
              {/* Mostrar controles de cantidad solo si el producto está en el carrito */}
              {isAddedToCart ? (
                <>
                  <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Cantidad</div>
                    <div className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                      <button
                        type="button"
                        onClick={() => {
                          if (products) {
                            decrementFromCart(products.id);
                          }
                          if (quantity > 1) {
                            setQuantity(quantity - 1);
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-600 hover:bg-gray-200 focus:outline-none"
                      >
                        -
                      </button>

                      <span className="text-lg font-medium text-gray-800">{quantity}</span>

                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(quantity + 1);
                          handleAddToCart();
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-600 hover:bg-gray-200 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-6 flex h-14 items-center justify-center rounded-xl bg-yellow-400 px-6 py-2 font-semibold text-black hover:bg-yellow-300"
                >
                  Añadir al carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
