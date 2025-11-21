
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Integrations from '@/components/Integrations';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function Home() {
  

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Integrations />
      <Pricing />
      <Footer />
    </div>
  );
}
