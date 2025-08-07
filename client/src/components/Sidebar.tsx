'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  function handleLogout() {
    localStorage.removeItem('authToken');

    localStorage.removeItem('userData');

    router.push('/');
  }

  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-screen w-64 overflow-y-auto bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <div className="flex flex-shrink-0 flex-row items-center justify-between px-8 py-4">
          <a
            href="#"
            className="focus:shadow-outline rounded-lg text-lg font-semibold uppercase tracking-widest text-gray-900 focus:outline-none dark:text-white"
          >
            Admin
          </a>
          <button
            className="focus:shadow-outline rounded-lg focus:outline-none md:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d={
                  open
                    ? 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    : 'M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'
                }
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className={`flex-grow px-4 pb-4 md:block md:overflow-y-auto md:pb-0 ${open ? 'block' : 'hidden'}`}>
          <div className="flex h-full flex-col justify-between">
            <div className="">
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin"
              >
                Dashboard
              </Link>
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/categories"
              >
                Categorias
              </Link>
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/products"
              >
                Productos
              </Link>

              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/products/stock_product"
              >
                Stock Productos
              </Link>

              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/clients"
              >
                Clientes
              </Link>
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/branches"
              >
                Sucursales
              </Link>
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/Admin/employees"
              >
                Empleados
              </Link>
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="#"
              >
                Contacto
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="focus:shadow-outline mt-2 flex w-full flex-row items-center rounded-lg bg-transparent px-4 py-2 text-left text-sm font-semibold hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:block dark:bg-transparent dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
                >
                  <span>Dropdown</span>

                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className={`ml-1 mt-1 inline h-4 w-4 transform transition-transform duration-200 md:-mt-1 ${dropdownOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full origin-top-right rounded-md shadow-lg">
                    <div className="rounded-md bg-white px-2 py-2 shadow dark:bg-gray-800">
                      <Link
                        className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:mt-0 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                        href="#"
                      >
                        Link #1
                      </Link>
                      <Link
                        className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:mt-0 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                        href="#"
                      >
                        Link #2
                      </Link>
                      <Link
                        className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:mt-0 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                        href="#"
                      >
                        Link #3
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-5">
              <Link
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                href="/"
              >
                Pagina de inicio
              </Link>
              <button
                className="focus:shadow-outline mt-2 block rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                onClick={handleLogout}
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
