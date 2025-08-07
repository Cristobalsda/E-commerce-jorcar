import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-screen w-64 bg-white">
        <Sidebar />
      </div>
      <main className="ml-64 flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
