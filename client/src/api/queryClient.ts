import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Antes era refetchOnMount: 'always', que ignora cache e staleTime: toda
      // navegacao remontava os componentes e refetchava tudo, com skeleton de
      // novo. No iOS o Safari suspende a aba/PWA rapido, e cada volta pro app
      // disparava a mesma tempestade via refetchOnWindowFocus.
      // Com staleTime, mount e focus so refetcham dado realmente velho — e as
      // mutations invalidam as queries afetadas, entao a frescura nao depende
      // disso.
      staleTime: 1000 * 30,
      refetchOnWindowFocus: true,
    },
  },
})
