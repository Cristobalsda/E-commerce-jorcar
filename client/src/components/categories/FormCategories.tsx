'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children: Category[];
};

const ListCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [parentId, setParentId] = useState<number | null>(null);
  const [subCategoryName, setSubCategoryName] = useState<string>('');
  const [subCategorySlug, setSubCategorySlug] = useState<string>('');
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editCategorySlug, setEditCategorySlug] = useState<string>('');

  useEffect(() => {
    // Obtener las categorías desde el backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`);
        const categoriesWithChildren = response.data.map((category: Category) => ({
          ...category,
          children: category.children || [],
        }));
        setCategories(categoriesWithChildren);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  // Función para organizar las categorías en un árbol por padres
  const organizeCategories = (categories: Category[]) => {
    const categoryMap: Record<number, Category> = {};
    const roots: Category[] = [];

    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    categories.forEach((category) => {
      if (category.parent === null) {
        roots.push(categoryMap[category.id]);
      } else {
        categoryMap[category.parent].children.push(categoryMap[category.id]);
      }
    });

    return roots;
  };

  // Función para manejar la creación de subcategorías
  const handleCreateSubCategory = async () => {
    console.log('Enviando datos:', {
      name: subCategoryName,
      slug: subCategorySlug,
      parent: parentId,
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`, {
        name: subCategoryName,
        slug: subCategorySlug,
        parent: parentId,
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setSubCategoryName('');
      setSubCategorySlug('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error al crear subcategoría:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }
    }
  };

  // Función para manejar la eliminación de categorías
  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/${id}/`);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }
    }
  };

  // Función para manejar la edición de una categoría
  const handleEditCategory = async () => {
    if (editCategoryId === null) return;

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/${editCategoryId}/`, {
        name: editCategoryName,
        slug: editCategorySlug,
      });
      const updatedCategory = response.data;

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === editCategoryId
            ? { ...category, name: updatedCategory.name, slug: updatedCategory.slug }
            : category,
        ),
      );

      setShowEditForm(false);
      setEditCategoryId(null);
      setEditCategoryName('');
      setEditCategorySlug('');
    } catch (error) {
      console.error('Error al editar categoría:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }
    }
  };

  // Función para renderizar las categorías y subcategorías
  const renderCategories = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div
        key={category.id}
        className={`mb-4 flex flex-col rounded-lg border bg-white p-4 shadow-md ${level > 0 ? 'ml-6' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
            <p className="text-sm text-gray-500">{category.slug}</p>
          </div>
          <div className="flex space-x-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                setEditCategoryId(category.id);
                setEditCategoryName(category.name);
                setEditCategorySlug(category.slug);
                setShowEditForm(true);
              }}
            >
              Editar
            </button>
            <button className="text-red-500 hover:underline" onClick={() => handleDeleteCategory(category.id)}>
              Eliminar
            </button>

            {/* Botón para agregar subcategoría */}
            <button
              className="text-green-500 hover:underline"
              onClick={() => {
                setParentId(category.id);
                setShowAddForm(true);
              }}
            >
              Agregar subcategoría
            </button>
          </div>
        </div>

        {/* Si tiene hijos, mostrarlos */}
        {category.children.length > 0 && <div className="ml-4">{renderCategories(category.children, level + 1)}</div>}
      </div>
    ));
  };

  // Organizar las categorías antes de renderizarlas
  const organizedCategories = organizeCategories(categories);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Lista de Categorías</h1>

      {/* Formulario para crear subcategoría */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-96 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Agregar Subcategoría</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                value={subCategorySlug}
                onChange={(e) => setSubCategorySlug(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:underline">
                Cancelar
              </button>
              <button onClick={handleCreateSubCategory} className="rounded-md bg-blue-500 px-4 py-2 text-white">
                Crear Subcategoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para editar categoría */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-96 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Editar Categoría</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                value={editCategorySlug}
                onChange={(e) => setEditCategorySlug(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:underline">
                Cancelar
              </button>
              <button onClick={handleEditCategory} className="rounded-md bg-blue-500 px-4 py-2 text-white">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renderizar las categorías */}
      <div className="space-y-4">{renderCategories(organizedCategories)}</div>
    </div>
  );
};

export default ListCategories;
