// Whitelist generosa de marcas com presença no Brasil.
// Usado para decidir: nome contém marca BR → manter sem traduzir.
// Nome contém marca NÃO-BR (USA-only, brand obscura) → descartar.

export const BR_BRANDS = [
  // Bebidas
  'coca-cola', 'coca cola', 'cocacola', 'pepsi', 'guaraná antarctica', 'antarctica', 'sukita',
  'fanta', 'sprite', 'soda limonada', 'schweppes', 'red bull', 'monster', 'fusion',
  'gatorade', 'powerade', 'del valle', 'matte leão', 'nescau', 'toddy', 'toddynho',
  'tang', 'clight', 'mid', 'kapo', 'sufresh', 'natural one', 'do bem',

  // Cafés
  'nescafé', 'nescafe', '3 corações', 'pilão', 'melitta', 'mellita', 'baggio', 'café 3',
  'starbucks',

  // Lácteos
  'parmalat', 'itambé', 'piracanjuba', 'tirol', 'nestlé', 'nestle', 'danone', 'activia',
  'vigor', 'batavo', 'paulista', 'molico', 'ninho', 'mococa', 'leco', 'tirolez',
  'polenghi', 'president', 'philadelphia', 'catupiry', 'requeijão', 'qboa', 'soyos',
  'yopro', 'yopa', 'yorgus', 'verde campo', 'iogurte grego',

  // Cereais
  'kellogg', 'kelloggs', "kellogg's", 'sucrilhos', 'froot loops', 'chocokrispis',
  'nesfit', 'all bran', 'corn flakes', 'cheerios', 'quaker', 'aveia quaker',
  'jasmine', 'mãe terra', 'native', 'taeq', 'belive',

  // Chocolates
  'lacta', 'sonho de valsa', 'ouro branco', 'diamante negro', 'laka', 'shot', 'bis',
  'serenata', 'sensação', 'talento', 'classic', 'galak', 'kit kat', 'kitkat', 'prestígio',
  'chokito', 'alpino', 'crunch', 'snickers', 'twix', 'mars', 'milky way',
  'ferrero', 'rocher', 'nutella', 'kinder', 'ovomaltine', 'hersheys', "hershey's", 'hershey',
  'cacau show', 'lindt', 'godiva', 'toblerone', 'm&m', 'mms', 'mentos', 'tic tac', 'halls',

  // Biscoitos / snacks
  'bauducco', 'piraquê', 'piraque', 'adria', 'fortaleza', 'mabel', 'nestlé biscoito',
  'oreo', 'tortuguita', 'trakinas', 'negresco', 'club social', 'cream cracker',
  'maizena', 'maisena', 'aymoré', 'parati', 'isabela', 'marilan', 'maria',
  'doritos', 'cheetos', 'fandangos', 'ruffles', 'pringles', 'lay', "lay's",
  'elma chips', 'baconzitos', 'cebolitos', 'torcida', 'crocantes',

  // Pães / massas
  'wickbold', 'pullman', 'visconti', 'plus vita', 'panco', 'nutrella', 'seven boys',
  'panini', 'forno de minas', 'liev', 'l\'amour',
  'barilla', 'renata', 'galo', 'adria massa', 'petybon', 'vitarella',

  // Conservas / mercearia
  'heinz', 'hellmann', "hellmann's", 'arisco', 'knorr', 'maggi', 'sazon', 'sazón',
  'kitano', 'predilecta', 'quero', 'oderich', 'jurema',
  'fugini', 'tarantella', 'cica',
  'gallo', 'soya', 'liza', 'concórdia', 'salada', 'andorinha', 'borges',
  'qualy', 'doriana', 'becel', 'delicata',

  // Carnes / embutidos
  'sadia', 'perdigão', 'aurora', 'seara', 'pif paf', 'rezende', 'frimesa',
  'swift', 'friboi', 'estancia', 'minerva', 'marfrig', 'jbs',

  // Doces / sobremesas
  'oreo', 'kibon', 'magnum', 'cornetto', 'fini', 'fruittella', 'paçoquita',
  'pacoquita', 'dr oetker', 'fleischmann', 'royal', 'apti',
  'condensado moça', 'leite moça', 'creme leite', 'mococa', 'glória',

  // Saudáveis / fit
  'belive', 'mãe terra', 'jasmine', 'taeq', 'wickbold integral', 'nesfit',
  'yopro', 'whey', 'integralmedica', 'integral medica', 'max titanium', 'probiotica',
  'optimum', 'gold standard', 'dymatize',

  // Fast food / restaurantes (categorias)
  "mcdonald's", 'mcdonalds', 'burger king', 'subway', 'kfc', 'dominos', 'domino',
  'bobs', "bob's", 'spoleto', 'china in box', 'habibs', "habib's", 'giraffas',
  'outback', 'pizza hut', 'starbucks',

  // USA mas conhecidas no BR
  "campbell's", 'campbells', 'kraft', 'kraft heinz', 'general mills', 'mondelez',
  'unilever', 'cargill', 'procter gamble', 'pringles', 'gerber', 'nestlé gerber',
  'mucilon',

  // Comida pet / saúde (excluir)
  // (deliberadamente fora)
]

const BR_BRANDS_LOWER = BR_BRANDS.map((b) => b.toLowerCase())

/**
 * Detecta marca conhecida no nome.
 * Retorna true se algum termo da whitelist BR aparece.
 */
export function hasBrazilianBrand(name: string): boolean {
  const lower = name.toLowerCase()
  return BR_BRANDS_LOWER.some((brand) => lower.includes(brand))
}

/**
 * Detecta marca genérica (qualquer nome próprio comercial).
 * Heurística: 2+ palavras consecutivas em MAIÚSCULAS, ou padrão "Brand,".
 */
export function looksLikeBrand(name: string): boolean {
  // 2+ palavras MAIÚSCULAS consecutivas (3+ chars)
  if (/\b[A-Z]{3,}(?:[\s-]+[A-Z]{2,}){1,}/.test(name)) return true
  // Padrão "Brand® " ou "Brand™ "
  if (/[®™©]/.test(name)) return true
  // CamelCase comercial óbvio (ex: "MaltOMeal")
  if (/[A-Z][a-z]+[A-Z][a-z]+/.test(name)) return true
  return false
}

/**
 * Decide se nome de marca deve ser MANTIDO no banco.
 * Marca conhecida no BR → mantém (sem traduzir).
 * Marca obscura/só-USA → descarta.
 * Sem cara de marca → mantém (alimento genérico, pode traduzir).
 */
export function shouldKeepBrandedFood(name: string): boolean {
  if (looksLikeBrand(name)) {
    return hasBrazilianBrand(name)
  }
  return true // não é marca, mantém
}
