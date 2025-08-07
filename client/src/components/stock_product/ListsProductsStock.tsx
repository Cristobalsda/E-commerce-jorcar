'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  nombre: string;
  precio: number;
  categoria: number;
};

type Stock = {
  id: number; // ID del inventario
  sucursal: string;
  cantidad: number;
  disponibilidad: boolean;
  producto_id: number;
};

async function loadProduct(): Promise<Product[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    throw error;
  }
}

async function loadProductStock(productId: number): Promise<Stock[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stock_producto/${productId}/stocks/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar el stock:', error);
    throw error;
  }
}

export default function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productStock, setProductStock] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStock, setEditStock] = useState<Stock | null>(null);

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

  // Dentro de `handleViewStock` después de cargar los datos del stock
  const handleViewStock = async (productId: number) => {
    try {
      const stockData = await loadProductStock(productId);
      // Ordena el stock de menor a mayor cantidad
      const sortedStock = stockData.sort((a, b) => a.cantidad - b.cantidad);
      setProductStock(sortedStock);
      setIsModalOpen(true);
    } catch (err) {
      setError('Error al cargar el stock');
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductStock([]);
  };

  const handleEditStock = (stock: Stock) => {
    setEditStock({ ...stock }); // Guarda el stock seleccionado para edición
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditStock(null);
  };

  const handleSaveEdit = async () => {
    if (editStock && editStock.id && editStock.producto_id) { // Verifica que `id` y `producto_id` estén definidos
      try {
        // Solicitud PUT para actualizar el stock
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stock_producto/${editStock.producto_id}/stock/${editStock.id}/`,
          {
            cantidad: editStock.cantidad,
            disponibilidad: editStock.disponibilidad
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );


        setIsEditModalOpen(false);

        // Recargar el stock actualizado
        const updatedStock = await loadProductStock(editStock.producto_id);
        setProductStock(updatedStock);
      } catch (error) {
        console.error('Error al guardar el stock editado:', error);
      }
    } else {
      console.error('producto_id o id no están definidos:', editStock);
    }
  };


  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Repuestos</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Producto</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2 px-4 text-sm text-gray-700">{product.nombre}</td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleViewStock(product.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Ver Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Stock del Producto</h2>
            <div>
              {productStock.map((stock, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-semibold">Sucursal: {stock.sucursal}</label>
                  <div className="mt-2 text-sm">
                    Stock disponible: {stock.cantidad}
                  </div>
                  <div className="mt-2 text-sm">
                    Disponibilidad: {stock.disponibilidad ? 'Disponible' : 'No disponible'}
                  </div>
                  <button
                    onClick={() => handleEditStock(stock)}
                    className="text-blue-500 hover:text-blue-700 mt-2"
                  >
                    Editar Stock
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && editStock && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Editar Stock</h2>
            <div>
              <label className="block text-sm font-semibold">Sucursal: {editStock.sucursal}</label>
              <div className="flex items-center mt-2">
                <label className="text-sm">Cantidad:</label>
                <input
                  type="number"
                  value={editStock.cantidad || ''}  // Usar '' para que el campo quede vacío si no hay valor
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Asegúrate de que el valor ingresado sea un número entero positivo
                    if (/^\d*$/.test(newValue)) { // Solo permite caracteres numéricos (enteros positivos)
                      setEditStock({ ...editStock, cantidad: newValue ? parseInt(newValue) : 0 });
                    }
                  }}
                  className="ml-2 border rounded px-2 py-1 text-sm"
                  min="0"
                  step="1"
                />
              </div>
              <div className="flex items-center mt-2">
                <label className="text-sm">Disponibilidad:</label>
                <input
                  type="checkbox"
                  checked={editStock.disponibilidad}
                  onChange={() =>
                    setEditStock({ ...editStock, disponibilidad: !editStock.disponibilidad })
                  }
                  className="ml-2 form-checkbox"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
