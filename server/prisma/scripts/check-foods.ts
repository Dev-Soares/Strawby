import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/client.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const foodList = [
  "Peito de frango","Coxa de frango","Sobrecoxa de frango","Frango desfiado",
  "Carne bovina magra","Patinho","Acem","Alcatra","Picanha","Musculo",
  "Carne moida","Carne suina","Lombo suino","Costela suina","Bacon",
  "Presunto","Peito de peru","Linguica","Salsicha","Hamburguer",
  "Ovo inteiro","Clara de ovo","Gema de ovo","Ovo cozido","Ovo mexido",
  "Ovo frito","Tilapia","Salmao","Sardinha","Atum","Bacalhau","Merluza",
  "Linguado","Camarao","Lula","Polvo","Carne de cordeiro","Carne de cabra",
  "Carne de coelho","Carne de pato","Carne de peru","Tofu","Proteina de soja",
  "Tempeh","Seitan","Feijao preto","Lentilha","Grao-de-bico","Ervilha",
  "Amendoim","Pasta de amendoim","Castanha de caju","Castanha do Para",
  "Nozes","Amendoas","Pistache","Macadamia","Sementes de chia",
  "Sementes de linhaca","Sementes de abobora","Sementes de girassol",
  "Whey protein","Caseina","Albumina","Proteina vegetal em po",
  "Iogurte grego","Iogurte natural","Leite integral","Leite desnatado",
  "Leite sem lactose","Leite vegetal","Queijo mussarela","Queijo prato",
  "Queijo minas","Queijo cottage","Queijo ricota","Queijo parmesao",
  "Queijo cheddar","Requeijao","Cream cheese","Kefir","Coalhada",
  "Leite condensado","Doce de leite","Leite em po","Proteina isolada",
  "Proteina concentrada","Proteina hidrolisada","Carne seca","Charque",
  "Mortadela","Salame","Peixe enlatado","Frango empanado","Nuggets",
  "Almondega","Kibe","Proteina texturizada","Hamburguer vegano","Carne vegetal",
  "Arroz branco","Arroz integral","Arroz parboilizado","Arroz negro",
  "Arroz selvagem","Macarrao","Macarrao integral","Espaguete","Penne",
  "Talharim","Lasanha","Nhoque","Cuscuz","Farinha de trigo","Farinha integral",
  "Farinha de mandioca","Farofa","Pao frances","Pao integral","Pao de forma",
  "Pao de centeio","Pao de aveia","Pao sem gluten","Tapioca","Goma de tapioca",
  "Polvilho doce","Polvilho azedo","Batata inglesa","Batata doce","Batata baroa",
  "Mandioquinha","Mandioca","Inhame","Cara","Milho","Milho verde",
  "Milho enlatado","Pipoca","Canjica","Aveia","Aveia em flocos","Farelo de aveia",
  "Granola","Cereal matinal","Quinoa","Amaranto","Trigo","Cevada","Sorgo",
  "Painco","Feijao carioca","Feijao branco","Feijao vermelho","Acucar branco",
  "Acucar mascavo","Acucar demerara","Mel","Melado","Rapadura","Chocolate",
  "Chocolate amargo","Chocolate ao leite","Chocolate branco","Biscoito",
  "Biscoito integral","Biscoito recheado","Bolacha agua e sal","Bolo simples",
  "Bolo de chocolate","Bolo de cenoura","Bolo integral","Panqueca","Crepioca",
  "Waffle","Torrada","Croissant","Donut","Pizza","Massa de pizza","Lasanha pronta",
  "Yakisoba","Risoto","Pure de batata","Pure de mandioca","Polenta","Angu",
  "Mingau de aveia","Mingau de milho","Tapioca recheada","Cereal de milho",
  "Barrinha de cereal","Barra de proteina","Acucar de coco","Xarope de bordo",
  "Xarope de milho","Acucar invertido","Maltodextrina",
  "Alface","Alface americana","Rucula","Agriao","Espinafre","Couve","Couve-flor",
  "Brocolis","Repolho","Repolho roxo","Cenoura","Beterraba","Pepino","Tomate",
  "Tomate cereja","Abobrinha","Berinjela","Pimentao verde","Pimentao vermelho",
  "Pimentao amarelo","Cebola","Alho","Alho-poro","Salsinha","Cebolinha",
  "Coentro","Manjericao","Hortela","Salsa","Endivia","Chicoria","Mostarda",
  "Escarola","Nabo","Rabanete","Chuchu","Quiabo","Vagem","Ervilha fresca",
  "Abobora","Abobora japonesa","Abobora moranga","Batata-doce roxa",
  "Cogumelo champignon","Shimeji","Shiitake","Palmito","Azeitona","Tomate seco",
  "Pepino em conserva","Cenoura baby","Mix de legumes","Legumes congelados",
  "Espinafre congelado","Brocolis congelado","Couve refogada","Abobrinha grelhada",
  "Berinjela assada","Tomate assado","Alho assado","Batata rustica",
  "Chips de legumes","Sopa de legumes","Creme de abobora","Pure de cenoura",
  "Pure de abobora","Salada verde","Salada mista","Salada de repolho","Vinagrete",
  "Legumes grelhados","Legumes no vapor","Legumes cozidos","Legumes refogados",
  "Legumes crus","Mix de folhas","Salada Caesar","Salada caprese",
  "Salada de grao-de-bico","Salada de lentilha","Salada de quinoa",
  "Salada de macarrao","Tabule","Ratatouille","Caponata","Sufle de legumes",
  "Omelete com legumes","Torta de legumes","Quiche de legumes","Lasanha de legumes",
  "Hamburguer de legumes","Nuggets vegetais","Creme de espinafre","Molho de tomate",
  "Molho pesto","Molho branco","Molho de alho","Molho rose","Molho barbecue",
  "Molho de pimenta","Molho agridoce","Molho shoyu","Molho teriyaki",
  "Molho de ervas","Molho vinagrete","Molho de mostarda","Molho de iogurte",
  "Molho de queijo","Molho de tomate caseiro","Molho de tomate industrial",
  "Extrato de tomate","Polpa de tomate","Ketchup","Maionese","Mostarda",
  "Banana","Maca","Pera","Laranja","Tangerina","Limao","Abacaxi","Manga",
  "Mamao","Melancia","Melao","Uva","Uva passa","Morango","Amora","Framboesa",
  "Mirtilo","Kiwi","Maracuja","Goiaba","Acerola","Caju","Jabuticaba","Pitanga",
  "Cupuacu","Acai","Graviola","Carambola","Figo","Damasco","Pessego",
  "Nectarina","Ameixa","Cereja","Coco","Agua de coco","Polpa de fruta",
  "Fruta congelada","Mix de frutas","Salada de frutas","Suco de laranja",
  "Suco de uva","Suco de maca","Suco natural","Suco integral",
  "Suco industrializado","Vitamina de frutas","Smoothie","Acai na tigela",
  "Sorvete de fruta","Picole de fruta","Gelatina de fruta","Compota",
  "Doce de fruta","Geleia","Geleia diet","Geleia zero","Fruta desidratada",
  "Banana passa","Maca desidratada","Manga desidratada","Coco seco","Tamara",
  "Figo seco","Damasco seco","Uva seca","Mix de frutas secas","Polpa congelada",
  "Fruta organica","Fruta enlatada","Fruta em calda","Fruta cristalizada",
  "Fruta madura","Fruta verde","Fruta assada","Fruta cozida","Fruta com casca",
  "Fruta sem casca","Fruta picada","Fruta inteira",
  "Agua","Agua mineral","Agua com gas","Cafe","Cafe com leite","Cafe preto",
  "Cappuccino","Cha verde","Cha preto","Cha de ervas","Cha gelado",
  "Refrigerante","Refrigerante zero","Refrigerante diet","Suco natural",
  "Suco industrializado","Suco integral","Energetico","Isotonico","Bebida lactea",
  "Achocolatado","Leite com chocolate","Leite vegetal","Bebida proteica",
  "Shake proteico","Smoothie","Vitamina","Caldo de cana","Kombucha","Kefir",
  "Bebida fermentada","Agua saborizada","Agua aromatizada","Cafe descafeinado",
  "Cafe expresso","Cafe americano","Cafe gelado","Cha mate","Cha de hibisco",
  "Cha de camomila","Cha de hortela","Bebida de soja","Bebida de amendoas",
  "Bebida de aveia","Bebida de coco","Leite condensado","Milkshake","Frape",
  "Chocolate quente","Cafe com acucar","Cafe sem acucar","Cha com acucar",
  "Cha sem acucar","Bebida zero acucar","Bebida diet","Bebida light",
  "Bebida energetica zero","Bebida esportiva","Bebida funcional","Bebida detox",
  "Shot de gengibre","Shot de limao","Shot de curcuma","Suplemento liquido",
  "Pre-treino liquido","Pos-treino liquido","Agua alcalina","Agua ionizada",
  "Agua de coco industrial","Agua de coco natural","Suco detox","Suco verde",
  "Suco vermelho","Suco amarelo","Suco misto","Suco funcional",
  "Bebida probiotica","Bebida prebiotica","Bebida com colageno",
  "Bebida com proteina","Bebida com cafeina","Bebida sem cafeina",
  "Bebida natural","Bebida artificial","Bebida organica","Bebida industrial",
  "Bebida caseira","Bebida pronta","Bebida em po","Bebida concentrada",
  "Bebida diluida","Bebida quente","Bebida gelada","Bebida alcoolica",
  "Cerveja","Vinho","Drink","Coquetel","Licor","Bebida mista"
]

// Normalize: remove accents for comparison
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

async function main() {
  // Deduplicate the list
  const uniqueFoods = [...new Set(foodList)]

  // Fetch all food names from database
  const allDbFoods = await db.food.findMany({ select: { name: true } })
  const dbNamesNormalized = allDbFoods.map(f => normalize(f.name))

  console.log(`\nTotal foods in database: ${allDbFoods.length}`)
  console.log(`Total unique items in check list: ${uniqueFoods.length}\n`)

  const found: string[] = []
  const missing: string[] = []

  for (const food of uniqueFoods) {
    const searchTerm = normalize(food)
    const match = dbNamesNormalized.some(dbName => dbName.includes(searchTerm))
    if (match) {
      found.push(food)
    } else {
      missing.push(food)
    }
  }

  const pct = ((found.length / uniqueFoods.length) * 100).toFixed(1)

  console.log(`========== SUMMARY ==========`)
  console.log(`Total in list : ${uniqueFoods.length}`)
  console.log(`Found         : ${found.length}`)
  console.log(`Missing       : ${missing.length}`)
  console.log(`Coverage      : ${pct}%`)
  console.log(`==============================\n`)

  if (missing.length > 0) {
    console.log(`--- MISSING FOODS (${missing.length}) ---`)
    for (const m of missing) {
      console.log(`  - ${m}`)
    }
    console.log()
  }

  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
