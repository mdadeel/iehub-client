/**
 * Commodity Image Resolution & Fallback Engine
 * Ensures clean, high-signal institutional images are always served,
 * preventing stale, broken, or retail-store images from showing in the trade desk.
 */

export const CATEGORY_IMAGE_MAP = {
  beverages: '/images/com-coffee.jpg',
  agriculture: '/images/com-soybean.jpg',
  spices: '/images/com-spices.jpg',
  metals: '/images/com-copper.jpg',
  'industrial materials': '/images/com-rubber.jpg',
  textiles: '/images/ind-textiles.jpg',
  food: '/images/com-rice.jpg',
  seafood: '/images/ind-seafood.jpg',
};

const COMMODITY_KEYWORD_MAP = [
  { match: /coffee|tea|beverage/i, image: '/images/com-coffee.jpg' },
  { match: /soy|grain|pulse|wheat|corn|barley|agri/i, image: '/images/com-soybean.jpg' },
  { match: /spice|cinnamon|pepper|saffron|vanilla|cardamom/i, image: '/images/com-spices.jpg' },
  { match: /copper|aluminium|aluminum|metal|billet|cathode/i, image: '/images/com-copper.jpg' },
  { match: /rubber|latex|polymer|chemical/i, image: '/images/com-rubber.jpg' },
  { match: /rice|sugar|flour|cereal|pulse/i, image: '/images/com-rice.jpg' },
  { match: /coconut|oil|palm/i, image: '/images/com-coconut.jpg' },
  { match: /textile|cotton|yarn|fabric|silk/i, image: '/images/ind-textiles.jpg' },
  { match: /shrimp|seafood|fish/i, image: '/images/ind-seafood.jpg' },
];

export const FALLBACK_CARGO_IMAGE = '/images/com-coffee.jpg';

/**
 * Resolves the appropriate image URL for a product, prioritizing
 * verified local asset paths and recovering gracefully from outdated Unsplash links.
 */
export function resolveProductImage(product) {
  if (!product) return FALLBACK_CARGO_IMAGE;

  const rawImage = product.image;

  // 1. If it's already a local verified image in /images/, use it directly
  if (rawImage && typeof rawImage === 'string' && rawImage.startsWith('/images/')) {
    return rawImage;
  }

  // 2. If it's an old unsplash URL or missing, check product name keywords
  const name = product.name || '';
  for (const item of COMMODITY_KEYWORD_MAP) {
    if (item.match.test(name)) {
      return item.image;
    }
  }

  // 3. Check category mapping
  const categoryKey = (product.category || '').toLowerCase();
  if (CATEGORY_IMAGE_MAP[categoryKey]) {
    return CATEGORY_IMAGE_MAP[categoryKey];
  }

  // 4. If rawImage is provided and valid http(s), keep it as secondary fallback
  if (rawImage && typeof rawImage === 'string' && (rawImage.startsWith('http://') || rawImage.startsWith('https://'))) {
    return rawImage;
  }

  return FALLBACK_CARGO_IMAGE;
}

