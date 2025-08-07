import FormProducts from '@/components/products/FormProducts';
import Link from 'next/link';
import { IoArrowBackCircle } from 'react-icons/io5';

export default function AddProduct() {
  return (
    <div>
      <div>
        <Link
          href="/Admin/products"
          className="focus:shadow-outline gap m-2 mt-2 flex w-1/12 items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 hover:text-white focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:hover:bg-gray-600 dark:focus:bg-gray-600"
        >
          <IoArrowBackCircle size={30} />
          <p>Volver</p>
        </Link>
      </div>
      <div>
        <FormProducts />
      </div>
    </div>
  );
}
