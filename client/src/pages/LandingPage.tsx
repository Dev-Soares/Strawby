import Navbar from '@/modules/landing/components/Navbar';
import Hero from '@/modules/landing/components/Hero';
import Features from '@/modules/landing/components/Features';
import FoodShowcase from '@/modules/landing/components/FoodShowcase';
import CTA from '@/modules/landing/components/CTA';
import DownloadSection from '@/modules/landing/components/DownloadSection';
import Footer from '@/modules/landing/components/Footer';

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <FoodShowcase />
      <DownloadSection />
      <CTA />
      <Footer />
    </main>
  );
}
