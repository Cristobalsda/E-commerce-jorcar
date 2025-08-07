'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}
interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function FormLogin() {
  // Estado para alternar entre login y registro
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isRegister) {
      setRegisterFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login/`, formData);
      if (response.status === 200) {
        const token = response.data.token;
        const rol = response.data.rol;
        console.log('Token:', token);
        console.log('Rol:', rol);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', rol);
        if (rol === 'admin') {
          router.push('/Admin');
        } else if (rol === 'user') {
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleSubmitRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register/`, registerFormData);
      if (response.status === 201) {
        router.push('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message || 'Error al registrarse';
        setError(errMsg);
      } else {
        setError('Error desconocido');
      }
    }
  };

  // Función para alternar entre los formularios
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="mx-auto w-full px-4 sm:w-2/3 lg:px-0">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">{isRegister ? 'Registro' : 'Iniciar Sesión'}</h1>

      {isRegister ? (
        // Formulario de registro
        <form className="register-form" onSubmit={handleSubmitRegister}>
          <div className="grid grid-cols-2 gap-2">
            <div className="pb-2 pt-4">
              <input
                type="text"
                name="first_name"
                id="first_name"
                placeholder="Nombre"
                value={registerFormData.first_name}
                onChange={handleChange}
                required
                className="block w-full rounded-sm bg-black p-4 text-lg"
              />
            </div>
            <div className="pb-2 pt-4">
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={registerFormData.last_name}
                onChange={handleChange}
                required
                placeholder="Apellido"
                className="block w-full rounded-sm bg-black p-4 text-lg"
              />
            </div>
          </div>
          <div className="pb-2 pt-4">
            <input
              type="email"
              name="email"
              id="email"
              value={registerFormData.email}
              required
              onChange={handleChange}
              placeholder="Email"
              className="block w-full rounded-sm bg-black p-4 text-lg"
            />
          </div>
          <div className="pb-2 pt-4">
            <input
              className="block w-full rounded-sm bg-black p-4 text-lg"
              type="password"
              name="password"
              id="password"
              value={registerFormData.password}
              required
              onChange={handleChange}
              placeholder="Contraseña"
            />
          </div>
          <div className="pb-2 pt-4">
            <input
              className="block w-full rounded-sm bg-black p-4 text-lg"
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={registerFormData.confirm_password}
              required
              onChange={handleChange}
              placeholder="Confirma la contraseña"
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="px-4 pb-2 pt-4">
            <button
              type="submit"
              className="block w-full rounded-full bg-indigo-500 p-4 text-lg uppercase hover:bg-indigo-600 focus:outline-none"
            >
              Registrarse
            </button>
          </div>
          <p className="mt-4 text-center text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <button onClick={toggleForm} className="text-indigo-500 hover:text-indigo-600 focus:outline-none">
              Inicia sesión
            </button>
          </p>
        </form>
      ) : (
        // Formulario de inicio de sesión
        <form className="login-form" onSubmit={handleSubmitLogin}>
          <div className="pb-2 pt-4">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-sm bg-black p-4 text-lg"
            />
          </div>
          <div className="pb-2 pt-4">
            <input
              className="block w-full rounded-sm bg-black p-4 text-lg"
              type="password"
              name="password"
              id="password"
              placeholder="Contraseña"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 text-gray-400">
            <button onClick={toggleForm} className="text-start hover:text-gray-100 hover:underline focus:outline-none">
              Regístrate
            </button>
            <a href="#" className="text-end hover:text-gray-100 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="px-4 pb-2 pt-4">
            <button className="block w-full rounded-full bg-indigo-500 p-4 text-lg uppercase hover:bg-indigo-600 focus:outline-none">
              Iniciar sesión
            </button>
          </div>
        </form>
      )}

      <div className="left-0 right-0 mt-16 flex justify-center space-x-4 p-4 text-center lg:hidden">
        <a href="#">
          <FaTwitter size={25} />
        </a>
        <a href="#">
          <FaFacebookF size={25} />
        </a>
        <a href="#">
          <FaInstagram size={25} />
        </a>
      </div>
    </div>
  );
}
