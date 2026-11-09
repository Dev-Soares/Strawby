import { Helmet } from 'react-helmet-async'

type Props = {
  /** Nome da tela. Vira "<nome> - Strawby" na aba. */
  title: string
}

/**
 * Título de aba para telas privadas (auth e app).
 *
 * Diferente do `PageSEO`, não emite canonical, Open Graph nem JSON-LD: nada disso faz
 * sentido numa página que não é indexada. Serve só para a aba não herdar a chamada de
 * marketing do index.html, que fica truncada e repetida em toda tela.
 */
export default function PageTitle({ title }: Props) {
  return (
    <Helmet>
      <title>{`${title} - Strawby`}</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )
}
