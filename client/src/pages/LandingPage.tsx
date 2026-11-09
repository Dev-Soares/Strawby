import Navbar from '@/modules/landing/components/Navbar';
import Hero from '@/modules/landing/components/Hero';
import ProductShowcaseSection from '@/modules/landing/components/ProductShowcaseSection';
import HowToUseSection from '@/modules/landing/components/HowToUseSection';
import DifferentialsSection from '@/modules/landing/components/DifferentialsSection';
import CTA from '@/modules/landing/components/CTA';


import Footer from '@/modules/landing/components/Footer';
import { useLightThemeOnly } from '@/modules/landing/hooks/useLightThemeOnly';
import PageSEO from '@/shared/components/PageSEO';

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Strawby',
  url: SITE_URL,
  description:
    'App de nutrição para acompanhar calorias, nutrientes e refeições do dia a dia. Simples, visual e consistente.',
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

// `sameAs` fica de fora enquanto não houver perfis oficiais — array vazio não
// agrega nada ao schema e só ocupa espaço no payload.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Strawby',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description: 'App de nutrição para acompanhar calorias, nutrientes e refeições do dia a dia.',
}

export default function LandingPage() {
  useLightThemeOnly()

  return (
    <>
      <PageSEO
        title="Strawby - Controle de Refeições e Nutrição Diária"
        description="Strawby é o app de nutrição para acompanhar calorias, nutrientes e refeições do dia a dia. Simples, visual e consistente. Grátis e funciona como PWA."
        path="/"
        jsonLd={[webAppSchema, organizationSchema]}
      />
      <main className="min-h-screen bg-white transition-colors duration-300">
        <Navbar />
        {/* S1: Hero */}
        <Hero />
        {/* S2: Conheça o Strawby */}
        <ProductShowcaseSection />
        {/* S3: Como usar */}
        <HowToUseSection />
        {/* S4: Não é só sobre contar calorias */}
        <DifferentialsSection />
        {/* S5: CTA Final + Footer */}
        <CTA />
        <Footer />
      </main>
    </>
  );
}
