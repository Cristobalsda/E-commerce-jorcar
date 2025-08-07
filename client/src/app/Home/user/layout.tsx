'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-full">
      <aside className="sticky w-64 bg-gray-800 p-4 text-white">
        <h2 className="mb-6 text-2xl font-bold">Mi Cuenta</h2>
        <nav className="grid gap-2">
          <Link href="/Home/user/profile">
            <p
              className={`block rounded px-4 py-2 ${
                isActive('/Home/user/profile') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Perfil del Usuario
            </p>
          </Link>
          <Link href="/Home/user/record">
            <p
              className={`block rounded px-4 py-2 ${
                isActive('/Home/user/record') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Historial de Compras
            </p>
          </Link>
          <Link href="/Home/user/address">
            <p
              className={`block rounded px-4 py-2 ${
                isActive('/Home/user/address') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Direcciones
            </p>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
