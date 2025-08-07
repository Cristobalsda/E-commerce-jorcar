import ListBranches from '@/components/branches/ListBranches';
export const dynamic = 'force-dynamic';

export default async function Branches() {
  return (
    <div>
      <h1 className="mt-10 flex justify-center text-4xl font-bold">Sucursales</h1>
      <ListBranches />
    </div>
  );
}
