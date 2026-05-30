import Navbar from '@/modules/landing/components/Navbar';
import Hero from '@/modules/landing/components/Hero';
import Features from '@/modules/landing/components/Features';
import FoodShowcase from '@/modules/landing/components/FoodShowcase';
import CTA from '@/modules/landing/components/CTA';
import DownloadSection from '@/modules/landing/components/DownloadSection';
import Footer from '@/modules/landing/components/Footer';
import PageSEO from '@/shared/components/PageSEO';

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Strawby',
  url: 'https://strawby.com',
  description:
    'App de nutrição para acompanhar calorias, macros e refeições do dia a dia. Simples, visual e consistente.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web, Android, iOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
  },
  featureList: [
    'Registro de refeições e calorias',
    'Acompanhamento de macronutrientes (proteína, carboidrato, gordura)',
    'Base de alimentos com busca integrada',
    'Criação de alimentos e receitas personalizados',
    'Plano nutricional diário',
    'Pontuação de consistência',
    'Suporte a nutricionistas',
    'Progressive Web App (PWA)',
    'Modo escuro',
  ],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Strawby',
  url: 'https://strawby.com',
  logo: 'https://strawby.com/logo.png',
  description: 'App de nutrição para acompanhar calorias, macros e refeições do dia a dia.',
  sameAs: [],
}

export default function LandingPage() {
  return (
    <>
      <PageSEO
        title="Strawby — Controle de Refeições e Nutrição Diária"
        description="Strawby é o app de nutrição para acompanhar calorias, macros e refeições do dia a dia. Simples, visual e consistente. Grátis e funciona como PWA."
        path="/"
        jsonLd={[webAppSchema, organizationSchema]}
      />
      <main className="bg-white dark:bg-neutral-950 min-h-screen transition-colors duration-300">
        <Navbar />
        <Hero />
        <Features />
        <FoodShowcase />
        <DownloadSection />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
