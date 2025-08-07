'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import { HiUserPlus } from 'react-icons/hi2';
import { IoIosArrowDown } from 'react-icons/io';

type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children: Category[];
};

export default function ListCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [subCategoryName, setSubCategoryName] = useState<string>('');
  const [subCategorySlug, setSubCategorySlug] = useState<string>('');
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editCategorySlug, setEditCategorySlug] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategorySlug, setNewCategorySlug] = useState<string>('');
  const [showNewCategoryForm, setShowNewCategoryForm] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
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

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`, {
        name: newCategoryName,
        slug: newCategorySlug,
        parent: null,
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setNewCategoryName('');
      setNewCategorySlug('');
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleCreateSubCategory = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`, {
        name: subCategoryName,
        slug: subCategorySlug,
        parent: parentId,
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setSubCategoryName('');
      setSubCategorySlug('');
      setParentId(null);
    } catch (error) {
      console.error('Error al crear subcategoría:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/${id}/`);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

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
    }
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories((prevExpandedCategories) => {
      const newExpandedCategories = new Set(prevExpandedCategories);
      if (newExpandedCategories.has(categoryId)) {
        newExpandedCategories.delete(categoryId);
      } else {
        newExpandedCategories.add(categoryId);
      }
      return newExpandedCategories;
    });
  };

  const renderCategories = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`flex flex-col bg-gray-100 ${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center justify-between border-b px-4 hover:bg-gray-200">
          <div>
            {showEditForm && editCategoryId === category.id ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <input
                  type="text"
                  value={editCategorySlug}
                  onChange={(e) => setEditCategorySlug(e.target.value)}
                  placeholder="Slug de la categoría"
                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <div className="flex justify-end space-x-4">
                  <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:underline">
                    Cancelar
                  </button>
                  <button onClick={handleEditCategory} className="rounded-md bg-blue-500 px-4 py-2 text-white">
                    Guardar cambios
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex">
                <button className="flex items-center p-2" onClick={() => toggleCategoryExpansion(category.id)}>
                  <IoIosArrowDown
                    size={18}
                    className={`transition-transform duration-200 ${expandedCategories.has(category.id) ? 'rotate-0' : 'rotate-180'}`}
                  />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              className="text-blue-500 hover:text-blue-700 hover:shadow-2xl hover:shadow-blue-700"
              onClick={() => {
                setEditCategoryId(category.id);
                setEditCategoryName(category.name);
                setEditCategorySlug(category.slug);
                setShowEditForm(true);
              }}
            >
              <FiEdit2 />
            </button>
            <button className="text-red-500 hover:underline" onClick={() => handleDeleteCategory(category.id)}>
              <FaRegTrashCan />
            </button>

            <button
              className="text-green-500 hover:underline"
              onClick={() => {
                setParentId(category.id);
              }}
            >
              <IoAddCircleOutline />
            </button>
          </div>
        </div>

        {/* Mostrar formulario de subcategoría si es la categoría seleccionada */}
        {parentId === category.id && (
          <div className="mt-4">
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Nombre de la subcategoría"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <div className="mt-2 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setParentId(null);
                  setSubCategoryName('');
                  setSubCategorySlug('');
                }}
                className="text-gray-500 hover:underline"
              >
                Cancelar
              </button>
              <button onClick={handleCreateSubCategory} className="rounded-md bg-blue-500 px-4 py-2 text-white">
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Subcategorías */}
        {expandedCategories.has(category.id) && category.children.length > 0 && (
          <div className="ml-4">{renderCategories(category.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="m-auto mt-8 max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lista de Categorías</h1>
        <button
          className="flex select-none items-center gap-2 rounded bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
        >
          <HiUserPlus />
          Agregar Categoria
        </button>
      </div>

      {showNewCategoryForm && (
        <div className="mb-4 rounded-md bg-gray-100 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Nueva Categoría</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <div className="flex justify-end space-x-4">
            <button onClick={() => setShowNewCategoryForm(false)} className="text-gray-500 hover:underline">
              Cancelar
            </button>
            <button onClick={handleCreateCategory} className="rounded-md bg-blue-500 px-4 py-2 text-white">
              Guardar
            </button>
          </div>
        </div>
      )}

      {renderCategories(organizeCategories(categories))}
    </div>
  );
}
