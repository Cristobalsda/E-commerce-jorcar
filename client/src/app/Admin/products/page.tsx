import ListProducts from '@/components/products/ListProducts';

export const dynamic = 'auto';

export default function Products() {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Título principal */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Repuestos</h1>
          <p className="text-gray-600 mt-2">Administra tus repuestos de manera eficiente</p>
        </header>

        {/* Componente de lista de productos */}
        <section>
          <ListProducts />
        </section>
      </div>
    </div>
  );
}
