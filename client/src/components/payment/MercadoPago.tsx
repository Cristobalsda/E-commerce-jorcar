import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CardContext';

export default function MercadoPagoButton() {
  const { cart } = useCart(); // Obtener el carrito
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar MercadoPago solo una vez
    initMercadoPago('APP_USR-29830014-6771-4524-9bd4-9f85442bdcad', {
      locale: 'es-CL',
    });

    // Crear la preferencia automáticamente al cargar el componente
    const createPreference = async () => {
      // Crear un array de items a enviar
      const items = cart.map((item) => ({
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'CLP',
      }));

      const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

      try {
        // Enviar los datos del carrito al backend
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_preference/`, {
          items: items,
          total: total,
        });

        if (response.data.error) {
          setErrorMessage(response.data.error);
          return null;
        }

        const { id } = response.data; // Obtener el id de la preferencia
        setPreferenceId(id); // Establecer el ID de la preferencia
      } catch (error) {
        console.error(error);
        setErrorMessage('Error al comunicarse con el servidor.');
      }
    };

    createPreference(); // Crear la preferencia al montar el componente
  }, [cart]); // Dependencia en 'cart' para ejecutar cuando cambie

  return (
    <>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {preferenceId && (
        <Wallet
          initialization={{
            preferenceId: preferenceId,
            redirectMode: 'blank',
          }}
          customization={{ texts: { valueProp: 'smart_option' } }}
        />
      )}
    </>
  );
}
