import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaRegFileAlt } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { TbHelpHexagon, TbLogout } from 'react-icons/tb';

interface UserProfile {
  name: string;
  email: string;
}
interface ModalCardUserLoginProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export default function ModalCardUserLogin({ user, onLogout }: ModalCardUserLoginProps) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    router.push('/');
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm divide-y divide-gray-200 rounded-lg bg-gray-100 p-3 drop-shadow-xl">
          <div aria-label="header" className="flex items-center space-x-4 p-4">
            <div aria-label="avatar" className="mr-auto flex items-center space-x-4">
              <img
                src="https://avatars.githubusercontent.com/u/499550?v=4"
                alt="avatar Evan You"
                className="h-10 w-10 shrink-0 rounded-full"
              />
              <div className="flex flex-1 flex-col space-y-2 truncate">
                <div className="relative text-lg font-medium leading-tight text-gray-900">
                  <span className="flex">
                    <span className="relative">{user?.name}</span>
                  </span>
                </div>
                <p className="truncate text-base font-normal leading-tight text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div aria-label="navigation" className="py-2">
            <nav className="grid gap-1">
              <Link
                href="/Home/user/profile"
                className="flex w-full items-center space-x-3 rounded-md px-4 py-3 text-lg leading-6 text-gray-600 hover:bg-gray-200 focus:outline-none"
              >
                <FiUser size={25} />
                <span>Datos Personales</span>
              </Link>
              <Link
                href="/Home/user/record"
                className="flex w-full items-center space-x-3 rounded-md px-4 py-3 text-lg leading-6 text-gray-600 hover:bg-gray-200 focus:outline-none"
              >
                <FaRegFileAlt size={25} />
                <span>Historial de compras</span>
              </Link>
              <Link
                href="/Home/user/address"
                className="flex w-full items-center space-x-3 rounded-md px-4 py-3 text-lg leading-6 text-gray-600 hover:bg-gray-200 focus:outline-none"
              >
                <TbHelpHexagon size={25} />
                <span>Direcciones</span>
              </Link>
            </nav>
          </div>

          <div aria-label="footer" className="pt-2">
            <button
              type="button"
              className="flex w-full items-center space-x-3 rounded-md px-4 py-3 text-lg leading-6 text-gray-600 hover:bg-gray-200 focus:outline-none"
              onClick={handleLogout}
            >
              <TbLogout size={25} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
