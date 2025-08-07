'use client';

import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import { GoSearch } from 'react-icons/go';
import { PiShoppingCart } from 'react-icons/pi';
import Modal from '../modal/Modal';
import { useEffect, useState } from 'react';
import ModalCardUserLogin from '../modal/ModalCardUserLogin';
import Link from 'next/link';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
import { useCart } from '@/context/CardContext';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children: Category[];
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showCategories, setShowCategories] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { cart } = useCart();
  const router = useRouter();

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get<UserProfile>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categorias/`);
        const organizedCategories = organizeCategories(response.data);
        setCategories(organizedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
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

  const handleUserClick = () => {
    if (role === 'admin') {
      router.push('/Admin');
    } else {
      setOpen(!open);
    }
  };
  const renderCategories = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div
        key={category.id}
        className={`group relative pl-${level * 4} mt-2`}
        onMouseEnter={() => setExpandedCategories((prev) => new Set(prev).add(category.id))}
        onMouseLeave={() =>
          setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            newSet.delete(category.id);
            return newSet;
          })
        }
      >
        <div className="flex items-center justify-between">
          <Link href={`/Home/category/${category.id}`} onClick={() => setShowCategories(!showCategories)}>
            <span className="cursor-pointer hover:text-blue-500">{category.name}</span>
          </Link>
        </div>
        {expandedCategories.has(category.id) && category.children.length > 0 && (
          <div className="absolute left-full top-0 z-10 grid h-[500px] w-[900px] grid-cols-4 gap-4 bg-white p-4 shadow-lg">
            {category.children.map((subCategory) => (
              <div key={subCategory.id} className="flex flex-col items-start">
                <Link href={`/Home/category/${subCategory.id}`} onClick={() => setShowCategories(!showCategories)}>
                  <span className="cursor-pointer hover:text-blue-500">{subCategory.name}</span>
                </Link>

                {/* Mostrar los hijos de la subcategoría */}
                {subCategory.children.length > 0 && (
                  <div className="ml-4 mt-2">
                    <ul className="list-none">
                      {subCategory.children.map((subSubCategory) => (
                        <li key={subSubCategory.id} className="mt-1 text-sm text-gray-500 hover:text-blue-500">
                          {subSubCategory.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };
  return (
    <header className="bg-white pr-5">
      <div className="container mx-auto flex items-center px-4 py-8">
        <div className="mx-auto flex-shrink-0 md:w-48">
          <Link
            href="/"
            className="transform text-3xl font-extrabold text-yellow-500 transition duration-300 hover:scale-105 hover:text-blue-800"
          >
            JORCAR
          </Link>
        </div>

        <div className="hidden w-full max-w-xs items-center rounded-md bg-gray-100 xl:flex xl:max-w-lg 2xl:max-w-2xl">
          <div className="relative mr-4 bg-transparent p-4 text-sm font-bold uppercase text-gray-500">
            <button className="text-nowrap" onClick={() => setShowCategories(!showCategories)}>
              {showCategories ? 'OCULTAR CATEGORÍAS' : 'MOSTRAR CATEGORÍAS'}
            </button>

            {showCategories && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 bg-gray-100 p-4 shadow-lg">
                {renderCategories(categories)}
              </div>
            )}
          </div>
          <input
            className="border-l border-gray-300 bg-transparent pl-4 text-sm font-semibold"
            type="text"
            placeholder="¿Qué estás buscando?"
          />
          <div className="mr-5 flex w-full justify-end">
            <GoSearch color="#6b7280" size={24} />
          </div>
        </div>

        <div className="ml-auto hidden flex-col place-items-end sm:flex md:w-48">
          <span className="font-bold md:text-xl">8 800 332 65-66</span>
          <span className="text-sm font-semibold text-gray-400">Support 24/7</span>
        </div>

        <nav className="contents">
          <ul className="ml-4 flex items-center justify-end xl:w-48">
            <li className="relative ml-2 inline-block lg:ml-4">
              {user ? (
                <div>
                  <button className="p-2" onClick={handleUserClick}>
                    <FaRegUser color="#6b7280" size={20} />
                  </button>
                  <div className="relative z-10">
                    <Modal open={open} onClose={() => setOpen(false)}>
                      <div className="absolute left-full top-20 -translate-x-full transform pr-24">
                        <ModalCardUserLogin user={user} onLogout={handleLogout} />
                      </div>
                    </Modal>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login">
                  <FaRegUser color="#6b7280" size={20} />
                </Link>
              )}
            </li>
            <li className="relative ml-2 inline-block lg:ml-4">
              <div>
                <div>
                  {totalItems > 0 && (
                    <div className="absolute -top-1 right-0 z-10 rounded-sm bg-yellow-400 px-1 py-0.5 text-xs font-bold">
                      {totalItems}
                    </div>
                  )}
                  <button className="p-2" onClick={() => setOpenCard(!openCard)}>
                    <PiShoppingCart color="#6b7280" size={22} />
                  </button>
                </div>
                <div className="relative z-10">
                  <Modal open={openCard} onClose={() => setOpenCard(false)}>
                    <div className="absolute left-full top-20 -translate-x-full transform pr-5">
                      <ShoppingCart onClose={() => setOpenCard(false)} />
                    </div>
                  </Modal>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div className="ml-4 hidden flex-col font-bold sm:flex">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-gray-600">${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
      <div className="border-t border-gray-100"></div>
    </header>
  );
}
