'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}
interface Carrito {
  id: number;
  cart_id: string;
}
interface CarritoCompras {
  id: number;
  carrito: number;
  producto: number;
  cantidad: number;
  precio_unitario: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  removeFromCart: (carritoProductoId: number) => void;
  clearCart: () => void;
  decrementFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const existingCartId = localStorage.getItem('cartId');
    if (!existingCartId) {
      const newCartId = `cart-${Date.now()}-${Math.random()}`;
      localStorage.setItem('cartId', newCartId);
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) return;

      try {
        // Obtener carrito
        const carritoResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito/`, {
          params: { cart_id: cartId },
        });

        const matchedCart = carritoResponse.data.find((item: Carrito) => item.cart_id === cartId);
        if (!matchedCart) return;

        // Obtener productos del carrito
        const carritoComprasResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/`);
        const matchedItems = carritoComprasResponse.data.filter(
          (item: CarritoCompras) => item.carrito === matchedCart.id,
        );

        // Obtener detalles de los productos
        const productDetails = await Promise.all(
          matchedItems.map(async (item: CarritoCompras) => {
            const productResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/producto/${item.producto}/`,
            );
            return {
              id: item.producto,
              nombre: productResponse.data.nombre,
              precio: parseFloat(item.precio_unitario),
              cantidad: item.cantidad,
              imagen: productResponse.data.imagenes[0] || `/path/to/default/image.jpg`,
            };
          }),
        );

        setCart(productDetails);
      } catch (error) {
        console.error('Error al obtener los datos del carrito:', error);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (product: CartItem) => {
    const cartId = localStorage.getItem('cartId');

    try {
      // Crear o actualizar producto en el carrito
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/`, {
        cart_id: cartId,
        producto: product.id,
        cantidad: 1,
        precio_unitario: product.precio,
      });

      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === product.id);
        if (existingProduct) {
          return prevCart.map((item) => (item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
          return [...prevCart, { ...product, cantidad: 1 }];
        }
      });
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    }
  };

  const removeFromCart = async (carritoProductoId: number) => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito/`, {
        params: { cart_id: cartId },
      });

      const matchedCart = response.data.find((item: Carrito) => item.cart_id === cartId);
      if (!matchedCart) return;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/`);
      const matched = res.data.find(
        (item: CarritoCompras) => item.producto === carritoProductoId && item.carrito === matchedCart.id,
      );

      if (!matched) return;

      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/${matched.id}/`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== carritoProductoId));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const decrementFromCart = async (productId: number) => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito/`, {
        params: { cart_id: cartId },
      });
      const matchedCart = response.data.find((item: Carrito) => item.cart_id === cartId);
      if (!matchedCart) return;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/`);
      const matched = res.data.find(
        (item: CarritoCompras) => item.producto === productId && item.carrito === matchedCart.id,
      );

      if (!matched) return;

      if (matched.cantidad > 1) {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/${matched.id}/`, {
          cantidad: matched.cantidad - 1,
        });
        setCart((prevCart) =>
          prevCart.map((item) => (item.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item)),
        );
      } else {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/${matched.id}/`);
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      }
    } catch (error) {
      console.error('Error al decrementar la cantidad del producto:', error);
    }
  };

  const clearCart = async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/carrito_compras/`, {
        params: { cart_id: cartId },
      });
      setCart([]);
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, decrementFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
