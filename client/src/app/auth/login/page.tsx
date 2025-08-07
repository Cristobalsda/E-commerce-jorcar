'use client';
import FormLogin from '@/components/form/FormLogin';
import { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [googleLoginUrl, setGoogleLoginUrl] = useState('');
  useEffect(() => {
    const fetchGoogleLoginUrl = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/google/login/`;
      setGoogleLoginUrl(url);
    };
    fetchGoogleLoginUrl();
  }, []);

  return (
    <>
      <body>
        <section className="flex min-h-screen items-stretch text-white">
          <div
            className="relative hidden w-1/2 items-center bg-gray-500 bg-cover bg-no-repeat lg:flex"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)`,
            }}
          >
            <div className="absolute inset-0 z-0 bg-black opacity-60"></div>
            <div className="z-10 w-full px-24">
              <h1 className="text-left text-5xl font-bold tracking-wide">JORCAR repuestos fiables</h1>
              <p className="my-4 text-3xl">Capture your personal memory in unique way, anywhere.</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 p-4 text-center">
              {/* twitter */}
              <span>
                <a href="/">
                  <FaTwitter size={25} />
                </a>
              </span>
              {/* Facebook */}
              <span>
                <a href="">
                  <FaFacebookF size={25} />
                </a>
              </span>
              {/* Instagram */}
              <span>
                <a href="/">
                  <FaInstagram size={25} />
                </a>
              </span>
            </div>
          </div>
          <div
            className="z-0 flex w-full items-center justify-center px-0 text-center md:px-16 lg:w-1/2"
            style={{ backgroundColor: '#161616' }}
          >
            <div
              className="absolute inset-0 z-10 items-center bg-gray-500 bg-cover bg-no-repeat lg:hidden"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)`,
              }}
            >
              <div className="absolute inset-0 z-0 bg-black opacity-60"></div>
            </div>
            <div className="z-20 w-full py-6">
              <h1 className="my-6">
                {/* colocar el logo de la empresa */}
                {/* <Image src={nombredellogo}/> l */}
              </h1>
              <div className="space-x-2 py-6">
                <a
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-white p-3 text-lg font-bold hover:bg-white hover:text-gray-500"
                  href={googleLoginUrl}
                >
                  <FcGoogle size={30} />
                  <p className="pl-1">Inicia sesion con Google</p>
                </a>
              </div>
              <p className="text-gray-100">o ingresa tu correo</p>
              <FormLogin />
            </div>
          </div>
        </section>
      </body>
    </>
  );
}
