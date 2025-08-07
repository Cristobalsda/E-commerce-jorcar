'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Toolbar from '../tiptap/Toolbar';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

interface Category {
  id: number;
  name: string;
  parent: number | null;
}

interface EditProductFormProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes: string[];
    categoria: number;
    calidad: string;
  };
  onSave: (updatedProduct: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    nuevasImagenes: File[];
    imagenesAEliminar: number[];
    categoria: number;
    calidad: string;
  }) => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSave, onCancel }: EditProductFormProps) {
  const [newName, setNewName] = useState(product.nombre);
  const [newDescription, setNewDescription] = useState(product.descripcion);
  const [newPrice, setNewPrice] = useState(product.precio);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [allImages, setAllImages] = useState(product.imagenes);
  const [newQuality, setNewQuality] = useState(product.calidad || 'alternativo');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Estados de categorías
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([product.categoria]);

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-3',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-3',
        },
      }),
      Underline,
    ],
    content: newDescription,
    onUpdate: ({ editor }) => {
      setNewDescription(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && editorContainerRef.current) {
      // Si editor está listo, montar el editor en el contenedor
      editorContainerRef.current.appendChild(editor.view.dom);
    }
  }, [editor]);

  // Obtener categorías del servidor
  useEffect(() => {
    // Cargar las categorías desde el backend
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`);
        setCategories(res.data);

        // Inicializar las categorías seleccionadas basadas en el producto actual
        const selected = [];
        let currentCategory = product.categoria;
        while (currentCategory) {
          selected.unshift(currentCategory); // Insertar al inicio para mantener el orden
          const parentCategory = res.data.find((cat: Category) => cat.id === currentCategory)?.parent;
          currentCategory = parentCategory ?? null; // Avanzar al padre
        }
        setSelectedCategories(selected);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategories();
  }, [product.categoria]);

  // Función recursiva para obtener subcategorías
  const getSubcategories = (parentId: number | null): Category[] => {
    return categories.filter((cat) => cat.parent === parentId);
  };

  // Manejar cambios en categorías
  const handleCategoryChange = (index: number, categoryId: number | null) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = categoryId!; // Actualizar la categoría en el índice actual
    setSelectedCategories(newSelectedCategories);

    // Si no hay más subcategorías para esta selección, cortar las siguientes categorías seleccionadas
    if (getSubcategories(categoryId!).length === 0) {
      setSelectedCategories((prev) => prev.slice(0, index + 1));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesToDelete((prev) => [...prev, index]);
  };

  const handleSave = () => {
    console.log('Calidad seleccionada:', newQuality); // Verifica que esté correctamente asignado
    const lastCategoryId = selectedCategories[selectedCategories.length - 1];
    if (!newQuality) {
      console.error('El campo calidad está vacío');
    } else {
      console.log('El valor de calidad es:', newQuality);
    }
    if (lastCategoryId) {
      onSave({
        id: product.id,
        nombre: newName,
        descripcion: newDescription,
        precio: newPrice,
        calidad: newQuality,
        nuevasImagenes: newImages,
        imagenesAEliminar: imagesToDelete,
        categoria: lastCategoryId,
      });
    } else {
      console.error('No se ha seleccionado una categoría válida');
    }
  };

  const generarDescripcionConIA = async () => {
    setIsLoading(true); // Activar el estado de carga
    setMessage(null); // Limpiar mensaje anterior
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/procesar-descripcion-ia/`,
        {
          nombre: newName,
          categorias: selectedCategories,
          calidad: newQuality,
        },
      );

      if (response.data.descripcion) {
        const generatedDescription = response.data.descripcion;
        setNewDescription(generatedDescription); // Actualizar el estado con la descripción generada por la IA

        if (editor) {
          // Si el editor está disponible, actualizamos su contenido para reflejar la nueva descripción
          editor.commands.setContent(generatedDescription);
        }

        setMessage('Descripción generada exitosamente.'); // Establecer mensaje de éxito
      } else {
        setMessage('No se pudo generar la descripción con IA'); // Mensaje de error
      }
    } catch (error) {
      console.error('Error al generar la descripción con IA', error);
      setMessage('Hubo un error al generar la descripción');
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="grid max-h-screen gap-4 overflow-y-auto p-4">
        <div>
          <label htmlFor="">Nombre</label>
          <input
            type="text"
            value={newName}
            className="w-full rounded-md border border-slate-600 bg-slate-600 p-2 text-green-400 outline-none focus:border-green-500"
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <Toolbar editor={editor} />
        <div>
          <label htmlFor="">Descripcion</label>
          <div
            className="w-full rounded-md border border-slate-600 bg-slate-600 p-2 text-green-400 outline-none focus:border-green-500"
            ref={editorContainerRef}
          />
        </div>
        <div>
          <label htmlFor="calidad">Calidad</label>
          <select
            id="calidad"
            value={newQuality}
            onChange={(e) => setNewQuality(e.target.value)} // Actualiza el estado de calidad cuando el usuario selecciona una opción
            className="w-full rounded-md border border-slate-600 bg-slate-600 p-2 text-gray-300 outline-none"
          >
            <option value="alternativo">Alternativo</option>
            <option value="original">Original</option>
            <option value="otras">Otras Referencias</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Precio</label>
          <input
            type="number"
            value={String(newPrice)}
            className="w-full rounded-md border border-slate-600 bg-slate-600 p-2 text-green-400 outline-none focus:border-green-500"
            onChange={(e) => setNewPrice(Number(e.target.value))}
          />
        </div>

        {selectedCategories.map((selectedCategoryId, index) => {
          const parentId = index === 0 ? null : selectedCategories[index - 1];
          const subcategories = getSubcategories(parentId);

          if (subcategories.length === 0) return null;

          return (
            <div key={`category-${parentId}-${index}`}>
              <label className="block text-gray-300">{index === 0 ? 'Categoría' : `Subcategoría ${index}`}</label>
              <select
                value={selectedCategoryId}
                className="w-full rounded-md border border-slate-600 bg-slate-600 p-2 text-gray-300 outline-none"
                onChange={(e) => handleCategoryChange(index, parseInt(e.target.value))}
              >
                <option value="">Selecciona una opción</option>
                {subcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <div>
          <label htmlFor="">Imagen</label>
          <div className="mt-4 flex flex-wrap gap-3">
            {allImages.map((image, index) => (
              <div key={index} className="relative h-20 w-20 overflow-hidden rounded border border-slate-600 shadow-md">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full transform object-cover transition-transform hover:scale-110"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-xs text-white shadow-md hover:bg-red-700"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 w-full">
          <input
            type="file"
            multiple
            className="w-full cursor-pointer rounded-md border border-slate-600 bg-slate-600 p-2 text-gray-300"
            onChange={handleFileChange}
          />
        </div>

        {/* Botones de acción */}
        {message && <div className="mt-4 rounded-md bg-green-600 p-2 text-center text-white">{message}</div>}

        <button
          className={`flex-1 rounded-md p-2 text-white transition-colors ${
            isLoading ? 'cursor-wait bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={generarDescripcionConIA}
          disabled={isLoading} // Deshabilitar el botón mientras se procesa
        >
          {isLoading ? 'Generando...' : 'Generar descripción con IA'}
        </button>
        <div className="mb-8 mt-4 flex w-full gap-2">
          <button
            className="flex-1 rounded-md bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
            onClick={handleSave}
          >
            Guardar cambios
          </button>
          <button
            className="flex-1 rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
