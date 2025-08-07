'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
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

export default function FormProducts() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string | number>('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [calidad, setCalidad] = useState<string>('original');
  const [processMessage, setProcessMessage] = useState<string | null>(null);
  const [loadingProcessDescription, setLoadingProcessDescription] = useState<boolean>(false);
  const [marca, setMarca] = useState<string>('');
  const router = useRouter();

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
    content: description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && editorContainerRef.current) {
      // Si editor está listo, montar el editor en el contenedor
      editorContainerRef.current.appendChild(editor.view.dom);
    }
  }, [editor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages((prevImages) => {
        const newImages = selectedImages.filter(
          (image) => !prevImages.some((prevImage) => prevImage.name === image.name),
        );
        return [...prevImages, ...newImages];
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Función recursiva para obtener subcategorías dinámicamente
  const getSubcategories = (parentId: number | null): Category[] => {
    return categories.filter((cat) => cat.parent === parentId);
  };

  // Función para manejar el cambio de categoría seleccionada
  const handleCategoryChange = (index: number, parentId: number | null) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = parentId!;
    setSelectedCategories(newSelectedCategories);

    // Si seleccionamos una categoría sin subcategorías, eliminamos los selects posteriores
    if (getSubcategories(parentId!).length === 0) {
      setSelectedCategories((prevSelected) => prevSelected.slice(0, index + 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);



    const formData = new FormData();
    formData.append('nombre', name);
    formData.append('descripcion', description);
    formData.append('precio', price.toString());
    formData.append('calidad', calidad);
    formData.append('marca', marca);
    images.forEach((image) => {
      formData.append('imagenes', image);
    });
    console.log([formData]);
    const lastCategoryId = selectedCategories[selectedCategories.length - 1];
    formData.append('categoria', lastCategoryId.toString());

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/Admin/products');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`);
        setCategories(res.data);
      } catch (error) {
        console.log('Error al obtener las categorias', error);
      }
    };
    fetchCategories();
  }, []);

  const handleProcessDescription = async () => {
    if (loadingProcessDescription) return;  // Evitar si ya está procesando
    setLoadingProcessDescription(true);  // Activar carga para procesar descripción
    setProcessMessage(null); // Limpiar el mensaje previo

    try {
      if (!name || !selectedCategories.length) {
        setProcessMessage('Por favor, ingresa el nombre y selecciona una categoría.');
        return;
      }

      const selectedCategoriesIds = selectedCategories;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/procesar-descripcion-ia/`,
        {
          nombre: name,
          categorias: selectedCategoriesIds,
          calidad: calidad
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Respuesta completa desde la API:", response.data);

      const processedDescription = response.data.descripcion || "Descripción no disponible";
      setDescription(processedDescription);

      if (editor) {
        editor.commands.setContent(processedDescription);
      }

      setProcessMessage('Descripción procesada con éxito');
    } catch (error) {
      console.error('Error al procesar la descripción:', error);
      setProcessMessage('Error al procesar la descripción. Intenta nuevamente.');
    } finally {
      setLoadingProcessDescription(false);  // Desactivar carga después de procesar
    }
  };



  return (
    <div className="flex items-center justify-center p-4">
      <div className="mx-auto w-full max-w-[550px] bg-gray-100">
        <h1 className="text-center text-2xl font-bold text-[#07074D]">Ingresa un nuevo producto</h1>
        <form className="px-9 py-6" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
              Nombre del producto
            </label>
            <input
              type="text"
              id="name"
              placeholder="Producto"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="marca" className="mb-3 block text-base font-medium text-[#07074D]">
              Marca del producto
            </label>
            <input
              type="text"
              id="marca"
              placeholder="Marca"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setMarca(e.target.value)}
            />
          </div>
          <Toolbar editor={editor} />
          <div className="mb-5">
            <label htmlFor="description" className="mb-3 block text-base font-medium text-[#07074D]">
              Descripción
            </label>

            <div
              className="prose w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              ref={editorContainerRef}
            >
              {/* Aquí se monta el editor de Tiptap */}
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="calidad" className="mb-3 block text-base font-medium text-[#07074D]">
              Calidad del producto
            </label>
            <select
              id="calidad"
              value={calidad}
              onChange={(e) => setCalidad(e.target.value)}
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              <option value="original">Original</option>
              <option value="alternativo">Alternativo</option>
              <option value="otras">Otras Referencias</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="price" className="mb-3 block text-base font-medium text-[#07074D]">
              Precio
            </label>
            <input
              type="number"
              id="price"
              placeholder="Precio"
              className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {Array.from({ length: selectedCategories.length + 1 }).map((_, index) => {
            const parentId = index === 0 ? null : selectedCategories[index - 1];
            const subcategories = getSubcategories(parentId!);

            if (subcategories.length === 0) {
              return null;
            }
            return (
              <div key={`category-${parentId}-${index}`} className="mb-5">
                <label htmlFor={`categoria-${index}`} className="mb-3 block text-base font-medium text-[#07074D]">
                  {index === 0 ? 'Categoría' : `Subcategoría ${index}`}
                </label>
                <select
                  id={`categoria-${index}`}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={selectedCategories[index] || ''}
                  onChange={(e) => handleCategoryChange(index, parseInt(e.target.value))}
                >
                  <option value="">Selecciona una opción</option>
                  {subcategories.map((category) => (
                    <option key={`category-${category.id}`} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {processMessage && (
            <div className={`mt-4 p-4 text-center ${processMessage.startsWith('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {processMessage}
            </div>
          )}

          <div className="flex justify-center mt-4">

            <button
              type="button"
              className="rounded-md bg-[#6A64F1] px-7 py-3 text-base font-medium text-white outline-none hover:bg-[#6A64F1] hover:shadow-md"
              onClick={handleProcessDescription}
              disabled={loadingProcessDescription}  // Deshabilitar cuando se esté procesando
            >
              {loadingProcessDescription ? 'Procesando...' : 'Procesar Descripción'}
            </button>
          </div>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">Cargar Archivos</label>
            <div className="mb-8">
              <input type="file" name="file" id="file" className="sr-only" multiple onChange={handleFileChange} />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] cursor-pointer items-center justify-center rounded-md border border-dashed border-[#e0e0e0] bg-gray-50 p-12 text-center hover:border-[#6A64F1] hover:shadow-md hover:shadow-[#6A64F1]"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold text-[#07074D]">Arrastra los archivos aquí</span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">O</span>
                  <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
                    Buscar
                  </span>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative w-20">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Imagen ${index + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-0 top-0 text-xl text-red-600"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-[#6A64F1] px-7 py-3 text-base font-medium text-white outline-none hover:bg-[#6A64F1] hover:shadow-md"
              disabled={loading}
            >
              {loading ? 'Guradando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
