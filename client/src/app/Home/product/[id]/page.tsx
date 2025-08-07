import DetailProduct from '@/components/home/DetailProduct';

interface HomeProductProps {
  params: {
    id: number;
  };
}

export default function HomeProduct({ params }: HomeProductProps) {
  const { id } = params;
  return (
    <div className="">
      <DetailProduct id={id} />
    </div>
  );
}
