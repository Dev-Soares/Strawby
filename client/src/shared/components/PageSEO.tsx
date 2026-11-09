import { Helmet } from 'react-helmet-async'

/**
 * Domínio público do site, vindo de VITE_SITE_URL. Nunca escrever o domínio à mão:
 * canonical apontando para o domínio errado faz o Google tratar o site real como
 * duplicata. A barra final é removida para não gerar `//path`.
 */
const BASE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`
const DEFAULT_IMAGE_ALT = 'Mascote do Strawby acenando ao lado do nome do app'

type Props = {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  jsonLd?: object | object[]
  noIndex?: boolean
}

export default function PageSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  type = 'website',
  jsonLd,
  noIndex = false,
}: Props) {
  const canonicalUrl = `${BASE_URL}${path}`
  const fullTitle = title.includes('Strawby') ? title : `${title} — Strawby`

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
