import {
  OrangeSlice,
  Carrot,
  Fish,
  Egg,
  Cookie,
  Coffee,
  Wine,
  Bread,
  Pizza,
  Hamburger,
  IceCream,
  Pepper,
  Grains,
  Shrimp,
  Avocado,
  CookingPot,
  BowlSteam,
  Cake,
  BeerStein,
  Champagne,
  Martini,
  TeaBag,
  Cheese,
  Nut,
  Leaf,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const ease = [0.34, 1.05, 0.64, 1] as const
const easeIcons = [0.34, 1.2, 0.64, 1] as const

interface FoodItem {
  icon: Icon
  color: string
}

const foods: FoodItem[] = [
  { icon: OrangeSlice,  color: 'text-orange-500'  },
  { icon: Avocado,      color: 'text-lime-500'    },
  { icon: Carrot,       color: 'text-orange-500'  },
  { icon: Fish,         color: 'text-cyan-500'    },
  { icon: Egg,          color: 'text-yellow-400'  },
  { icon: Pizza,        color: 'text-red-500'     },
  { icon: Coffee,       color: 'text-amber-800'   },
  { icon: TeaBag,       color: 'text-green-600'   },
  { icon: Hamburger,    color: 'text-yellow-600'  },
  { icon: Leaf,         color: 'text-green-500'   },
  { icon: Grains,       color: 'text-yellow-500'  },
  { icon: Wine,         color: 'text-rose-600'    },
  { icon: Champagne,    color: 'text-yellow-400'  },
  { icon: Martini,      color: 'text-indigo-500'  },
  { icon: BeerStein,    color: 'text-amber-400'   },
  { icon: Shrimp,       color: 'text-pink-500'    },
  { icon: Bread,        color: 'text-amber-500'   },
  { icon: Cookie,       color: 'text-orange-600'  },
  { icon: IceCream,     color: 'text-fuchsia-500' },
  { icon: CookingPot,   color: 'text-teal-600'    },
  { icon: BowlSteam,    color: 'text-cyan-600'    },
  { icon: Pepper,       color: 'text-red-600'     },
  { icon: Cake,         color: 'text-pink-500'    },
  { icon: Cheese,       color: 'text-yellow-500'  },
  { icon: Nut,          color: 'text-amber-600'   },
]

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeIcons },
  },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export default function FoodShowcase() {
  return (
    <section id="funcionalidades" className="relative overflow-hidden flex items-center pt-40 lg:pt-56 pb-28 lg:pb-32 bg-white">

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16 mb-24">

          {/* Left — story block */}
          <div className="shrink-0 max-w-md">

            <motion.h2
              className="text-neutral-950 font-black text-[44px] sm:text-[52px] lg:text-[60px] leading-[1.02] tracking-tight"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease, delay: 0 }}
            >
              Do açaí ao{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-red-600">pão de queijo</span>
              </span>
              , tudo aqui.
            </motion.h2>

            <motion.p
              className="text-neutral-600 text-[17px] leading-relaxed mt-6"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
            >
              Uma base nutricional completa, atualizada constantemente e validada pela comunidade.
            </motion.p>

            <motion.div
              className="flex items-center gap-6 mt-10 pt-8 border-t border-neutral-200"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
            >
              <div>
                <p className="font-display text-red-600 font-black text-[38px] leading-none tracking-tight">
                  10K<span className="text-red-600">+</span>
                </p>
                <p className="text-neutral-500 text-[13px] font-semibold uppercase tracking-wider mt-2">
                  alimentos
                </p>
              </div>
              <div className="w-px h-14 bg-linear-to-b from-transparent via-neutral-300 to-transparent" />
              <div>
                <p className="font-display text-red-600 font-black text-[38px] leading-none tracking-tight">
                  100<span className="text-red-600">%</span>
                </p>
                <p className="text-neutral-500 text-[13px] font-semibold uppercase tracking-wider mt-2">
                  gratuito
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — food icons */}
          <motion.div
            className="flex flex-wrap gap-6 max-w-lg lg:max-w-md justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {foods.map((food, i) => (
              <motion.div key={i} variants={iconVariants}>
                <food.icon
                  className={`${food.color} cursor-default select-none transition-[scale] duration-200 hover:scale-125`}
                  size={52}
                  weight="duotone"
                />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
