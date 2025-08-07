import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <main className="start-0 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
