'use client';

import ProductCard from '@/components/cards/ProductCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
};

async function loadProduct(): Promise<Product[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/`);
    return res.data;
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    throw error;
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productData = await loadProduct();
        setProducts(productData);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-b-8 border-t-8 border-gray-200"></div>
          <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-b-8 border-t-8 border-yellow-500"></div>
        </div>
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <div className="bg-slate-100">
      <div className="mb-8">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 3000, // El tiempo entre slides (3 segundos)
            disableOnInteraction: false, // El autoplay seguirá funcionando después de la interacción
          }}
          modules={[Autoplay, Navigation, Pagination]} // Agrega Autoplay a los módulos
        >
          <SwiperSlide>
            <img
              src="https://api.autoplanet.cl/medias/sys_master/images/he7/hfe/9848841666590/CALL_CAJA_1/CALL-CAJA-1.svg"
              alt="Imagen 1"
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://api.autoplanet.cl/medias/sys_master/images/h6b/h87/9848839438366/CALL_AIRE/CALL-AIRE.svg"
              alt="Imagen 2"
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://api.autoplanet.cl/medias/sys_master/images/h04/h84/9848839536670/CALL_BOMBA_AGUA/CALL-BOMBA-AGUA.svg"
              alt="Imagen 3"
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <h2 className="relative mb-6 mt-8 text-center text-3xl font-extrabold uppercase tracking-wide text-gray-800">
        <span className="relative z-10">Productos</span>
        <div className="absolute inset-0 opacity-30"></div>
      </h2>
      <div className="mx-auto grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
