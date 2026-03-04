// Fun titles based on order content - Seyfi Chef steakhouse edition
const STEAK_TITLES = [
  'Sultan du Steak',
  'Roi du Grill',
  'Maitre des Braises',
  'Empereur de la Viande',
  'Seigneur du T-Bone',
]

const BURGER_TITLES = [
  'Boss du Burger',
  'Prince du Bun',
  'Champion du Smash',
  'Roi du Texas Beef',
]

const AGNEAU_TITLES = [
  'Seigneur de l\'Agneau',
  'Sultan du Carre',
  'Grand Maitre du Gigot',
  'Prince de la Cote Tendre',
]

const PASTA_TITLES = [
  'Roi des Pennes',
  'Sultan de la Tagliatelle',
  'Maestro du Al Dente',
]

const GENERIC_TITLES = [
  'Grand Gourmet du Seyfi',
  'Explorateur des Saveurs',
  'Ambassadeur du Steakhouse',
  'Fin Connaisseur du Chef',
  'VIP du Seyfi Chef',
  'Legende du Iftar',
  'Boss du Festin',
]

const BIG_SPENDER_TITLES = [
  'Le Genereux du Seyfi',
  'Philanthrope du Iftar',
  'Le Magnifique',
  'Sultan du Festin Royal',
  'Grand Mecene',
]

export function getFunTitle(itemNames: string[], total: number): string {
  if (total > 80) return pick(BIG_SPENDER_TITLES)

  const allLower = itemNames.map((n) => n.toLowerCase()).join(' ')
  if (allLower.includes('steak') || allLower.includes('t-bone') || allLower.includes('tomahawk') || allLower.includes('dallas') || allLower.includes('fiorentina') || allLower.includes('porter')) return pick(STEAK_TITLES)
  if (allLower.includes('burger')) return pick(BURGER_TITLES)
  if (allLower.includes('agneau') || allLower.includes('carre')) return pick(AGNEAU_TITLES)
  if (allLower.includes('penne') || allLower.includes('tagliatelle') || allLower.includes('spaghetti')) return pick(PASTA_TITLES)
  return pick(GENERIC_TITLES)
}

// Blessings in Turkish and Arabic
const BLESSINGS = [
  { text: 'Afiyet olsun!', lang: '🇹🇷 Turc', meaning: 'Bon appetit !' },
  { text: 'Hayirli iftarlar!', lang: '🇹🇷 Turc', meaning: 'Bon iftar !' },
  { text: 'Ellerine saglik!', lang: '🇹🇷 Turc', meaning: 'Merci pour ce bon repas !' },
  { text: 'Allah kabul etsin!', lang: '🇹🇷 Turc', meaning: 'Que Dieu accepte !' },
  { text: 'Bereketli olsun!', lang: '🇹🇷 Turc', meaning: 'Que ce soit abondant !' },
  { text: 'بالصحة والعافية', lang: '🇲🇦 Arabe', meaning: 'A la sante !' },
  { text: 'الله يبارك', lang: '🇲🇦 Arabe', meaning: 'Que Dieu benisse !' },
  { text: 'تقبل الله', lang: '🇲🇦 Arabe', meaning: 'Que Dieu accepte !' },
]

export function getRandomBlessing() {
  return pick(BLESSINGS)
}

export const FOOD_EMOJIS = [
  '🥩', '🍔', '🥙', '🍨', '🥤', '☕', '🍵',
  '🌙', '⭐', '✨', '🕌', '🏮', '🫖', '🍯',
  '🐑', '🧆', '🫓', '🥬', '🌶️', '🍹',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
