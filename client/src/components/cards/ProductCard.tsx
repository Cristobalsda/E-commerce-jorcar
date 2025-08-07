import Image from 'next/image';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { GoEye } from 'react-icons/go';
import { useCart } from '@/context/CardContext';
import Link from 'next/link';

interface ProductProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes: string[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: 1,
      imagen: product.imagenes[0],
    });
  };
  return (
    <div className="mx-auto my-5 min-h-[24rem] w-72 rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
      <Link href={`/Home/product/${product.id}`}>
        <div className="relative h-56 w-full overflow-hidden rounded-t-lg bg-gray-100">
          {product.imagenes.length > 0 ? (
            <Image
              src={product.imagenes[0]}
              width={300}
              height={300}
              alt={`Imagen de ${product.nombre}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="flex h-full items-center justify-center text-gray-500">Imagen no disponible</p>
          )}
        </div>
      </Link>
      <div className="flex flex-col justify-between px-5 pb-5">
        <Link href={`/Home/product/${product.id}`}>
          <h3 className="truncate text-lg font-bold tracking-tight text-gray-900 hover:underline dark:text-white">
            {product.nombre}
          </h3>
        </Link>
        <div className="mt-3">
          <span className="text-3xl font-bold text-amber-500 dark:text-amber-400">
            ${product.precio.toLocaleString('es-CL')}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-300 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
          >
            <HiOutlineShoppingCart size={20} className="mr-2" />
            Añadir al carrito
          </button>
          <Link
            href={`/Home/product/${product.id}`}
            className="flex items-center rounded-lg border border-amber-500 px-4 py-2 text-sm font-medium text-amber-500 transition-all hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-300 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-600 dark:hover:text-white dark:focus:ring-amber-800"
          >
            <GoEye size={20} className="mr-2" />
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
