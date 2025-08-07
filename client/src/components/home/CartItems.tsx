'use client';

import { useCart } from '@/context/CardContext';
import Image from 'next/image';
import { IoCloseOutline } from 'react-icons/io5';
import MercadoPagoButton from '../payment/MercadoPago';

export default function CartItems() {
  const { cart, removeFromCart, addToCart, decrementFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <>
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield; /* Firefox */
          }
        `}
      </style>
      <div className="h-screen bg-gray-100 pt-10">
        <h1 className="mb-10 text-center text-2xl font-bold">Carro de compras</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cart.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No hay productos en el carrito</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="mb-6 justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                >
                  <Image src={item.imagen} width={160} height={160} alt="img product" />

                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">{item.nombre}</h2>
                    </div>
                    <div className="mt-4 flex justify-between sm:mt-0 sm:block sm:space-x-6 sm:space-y-6">
                      <div className="flex items-center border-gray-100">
                        <span
                          className="cursor-pointer rounded-l bg-gray-100 px-3.5 py-1 duration-100 hover:bg-blue-500 hover:text-blue-50"
                          onClick={() => decrementFromCart(item.id)}
                        >
                          -
                        </span>
                        <input
                          className="h-8 w-8 border bg-white text-center text-xs outline-none"
                          type="number"
                          value={item.cantidad}
                          min={1}
                        />
                        <span
                          className="cursor-pointer rounded-r bg-gray-100 px-3 py-1 duration-100 hover:bg-blue-500 hover:text-blue-50"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-xl">${item.precio.toLocaleString('es-CL')} </p>

                        <button
                          className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <IoCloseOutline size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Subtotal Section */}
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">${total.toLocaleString('es-CL')}</p>
            </div>

            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div>
                <p className="mb-1 text-lg font-bold">${total.toLocaleString('es-CL')} CLP</p>
                <p className="text-sm text-gray-700">Incluido IVA</p>
              </div>
            </div>
            <MercadoPagoButton />
          </div>
        </div>
      </div>
    </>
  );
}
