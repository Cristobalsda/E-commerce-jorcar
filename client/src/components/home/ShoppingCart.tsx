'use client';

import { useCart } from '@/context/CardContext';
import Image from 'next/image';
import Link from 'next/link';
import { LuTrash2 } from 'react-icons/lu';

interface Props {
  onClose: () => void;
}

export default function ShoppingCart({ onClose }: Props) {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="flex h-64 justify-start">
      <div className="relative">
        <div className="z-10 w-full rounded-lg border bg-gray-200 shadow-lg">
          <div className="w-64">
            {cart.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No hay productos en el carrito</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-gray-200 bg-white p-4 transition hover:bg-gray-50"
                >
                  <div className="flex h-20 w-20 items-center overflow-hidden rounded-md">
                    <Image
                      src={item.imagen}
                      width={80}
                      height={80}
                      alt={`Imagen de ${item.nombre}`}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-auto text-sm">
                    <div className="max-w-[8rem] truncate font-semibold text-gray-800">{item.nombre}</div>
                    <div className="text-gray-500">Cantidad: {item.cantidad}</div>
                  </div>
                  <div className="w-20 text-right">
                    <button
                      className="mb-4 rounded-full p-1 transition hover:bg-red-100"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <LuTrash2 color="red" size={18} />
                    </button>
                    <div className="font-medium text-gray-700">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-center bg-yellow-50 p-4">
              <Link
                className="flex w-full items-center justify-center rounded-lg border border-yellow-500 bg-yellow-100 py-2 text-base font-bold text-yellow-700 transition hover:bg-yellow-500 hover:text-white"
                href="/Home/cart"
                onClick={onClose}
              >
                Ir a pagar: ${total.toLocaleString('es-CL')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-32"></div>
    </div>
  );
}
