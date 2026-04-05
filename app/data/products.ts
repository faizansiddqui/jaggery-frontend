export interface Product {
  id: number;
  publicId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity?: number;
  stockBySize?: Record<string, number>;
  stockByVariant?: Record<string, number>;
  collection: string;
  category: string;
  tag?: string;
  colors?: string[];
  sizes: string[];
  image: string;
  images?: string[];
  slug: string;
  description: string;
  descriptionHtml?: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'KINETIC P-24 SHELL',
    price: 285,
    collection: 'OUTERWEAR / RED LINE',
    category: 'Jackets',
    tag: 'New Arrival',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCPPxeva2_roYGpDN5rerNlGmz6zoyzfNrduSt5wuJKChKQlJdaQNuoN650Bnh-v1F17aexaiDdCfX_W0ZRjEaijRW3whfNF0h2Hx3DpaU6yBtTJq6oCZ3XDtmVXvkgM91-RpYY-R_AHUtDM6PvyGgiK7nnMbYjiYo0E734ZjkhnYpM0XuZIwksg46v4EztjbMV8OtIc9SC4TEId6DK3iDB8QIpApL7Q9cgtom_W5A7OIkJXm1-Soke8SI56Cbqj_qhRt56HaFoqDT',
    slug: 'kinetic-p24-shell',
    description: 'Engineered for the elite. Precision-cut racing jacket with carbon-fiber-inspired panels, water-resistant shell, and industrial zippers.',
    details: ['Water-resistant performance shell', 'Internal ergonomic lining', 'Modular utility pockets', 'Precision-bonded seams', 'Gaskets @ cuffs & neck'],
  },
  {
    id: 2,
    name: 'VOID SHELL v1.4',
    price: 385,
    collection: 'OUTERWEAR / TECHNO',
    category: 'Jackets',
    tag: 'New Arrival',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgryweli9dBU2KXApNAoIl3-ws1TLdfVic6aUvfkbF1ugEZOIGJicoBk48NphtF8wFN60EO6jUJLV5mc9-lrighBfb0YzPpkGRdspa5yWkSngMRmeuaAG0U3Efi7y2Kc5CcalyMcjlUVtMIMG6Jy-mqkNhxqpvFnvHht0TvdrMAOnCv6AyF0_K98BuZ899J5ytpzUp8yWttAjY7KDPs4tfGOCIJjAzffwilRmQODj8bpMTfGVUbqkdNaZfZxgiBJ_4gse4eZeJMrcd',
    slug: 'void-shell-v14',
    description: 'Modular techno-cotton construction. Maximalist silhouette with precision engineering at every seam.',
    details: ['Techno-cotton fabrication', 'Modular attachment points', 'YKK hardware', 'Drop-shoulder cut'],
  },
  {
    id: 3,
    name: 'KINETIC OVERSIZED HOODIE',
    price: 145,
    collection: 'NOIR SERIES 01',
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi2LBbQZCIFwCDB7YxF2C8Jv9wLphvAPwfwJ20xySq3CW8TiyToikeAp0DRoQp84i1ALiCcgkeKnVRYrGlDH_7i74yzXC4gJ5GC8l6qHF9-TkaFMYyTmoczCz1HVnL5KgIjLqEMR1VHeJx5q8FIZF09TvEvkAfgWZXE1YOI-4G-BkHLr0VYxF2UCHZtu8HjsgOR3DMTIGhDGAZleuEUFfrAzPyvkf0XSIlSnMHpv2Al4-KcyF1NY4XgEJsrEHtyn92cUaghFH0cP5n',
    slug: 'kinetic-oversized-hoodie',
    description: 'Dropped-shoulder editorial hoodie in heavyweight noir fleece. Signature kinetic fit.',
    details: ['400gsm fleece', 'Oversized fit', 'Embroidered branding', 'Kangaroo pocket'],
  },
  {
    id: 4,
    name: 'KINETIC PUFFER',
    price: 290,
    collection: 'VELOCITY GEAR',
    category: 'Jackets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYpfwl45t2QICt9dW_uBqCA-4QxzxSX_2Ar4Y48aWnyxDULL7s9siycpY6Tx-EodQQLJkFq4VeTZKA5raaq4vwJFFiuGcXo6lu13ZOCfMIf-qjOwKcRgRNb8WBdktMgFHegltpSA8CEtmqLhiJIJu78pf3VF7-YeNtlK9xu4Z7mojQvTqfqIGdKXyCxlFtaNnXpGE-0bZ56iMY6qUsZIIz2LbWzVCJ5avfpQxwViocfXDUwDrTA9GJQ_nAMSO67htf6Ui9H1Nek1r3',
    slug: 'kinetic-puffer',
    description: 'Down-fill kinetic puffer in velocity red. Quilted performance exterior, street-ready silhouette.',
    details: ['Down-fill insulation', 'Water-repellent shell', 'Internal storm guard', 'Packable design'],
  },
  {
    id: 5,
    name: 'PRECISION TECH RUNNER',
    price: 210,
    collection: 'VELOCITY GEAR',
    category: 'Footwear',
    sizes: ['7', '8', '9', '10', '11', '12'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCPPxeva2_roYGpDN5rerNlGmz6zoyzfNrduSt5wuJKChKQlJdaQNuoN650Bnh-v1F17aexaiDdCfX_W0ZRjEaijRW3whfNF0h2Hx3DpaU6yBtTJq6oCZ3XDtmVXvkgM91-RpYY-R_AHUtDM6PvyGgiK7nnMbYjiYo0E734ZjkhnYpM0XuZIwksg46v4EztjbMV8OtIc9SC4TEId6DK3iDB8QIpApL7Q9cgtom_W5A7OIkJXm1-Soke8SI56Cbqj_qhRt56HaFoqDT',
    slug: 'precision-tech-runner',
    description: 'High-velocity runner with carbon-injected midsole and kinetic mesh upper.',
    details: ['Carbon-injected midsole', 'Kinetic mesh upper', 'Anti-slip outsole', 'Reflective detailing'],
  },
  {
    id: 6,
    name: 'RAW BOMBER X',
    price: 210,
    collection: 'EDITORIAL SERIES',
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHn1Dn6oq3CpwegkwP7SqPJlSNXH-cArhQu_vEq6QW_8bPw9OBgWz5ib68DZU3kM9Zg-TRLGxRkDeNgnPKCOs7VDkRyPYn9Fg-2i_GJE3-A5g8zyFUWQaXDLuHozoroOW0kdrqlxLyz8X0fuiJiFiu8x_yqcFypB8dKgyY8sxhpXDBZa_YRggK2f7DXFf0A5flbzuzR_iVWRbPmZ2joP76ta-DdHMOp96qUFk_141_8wVy6r0svZgXd3_R0gyUsPrarkRGVcGnKZBD',
    slug: 'raw-bomber-x',
    description: 'Distressed denim bomber with silver hardware and editorial patch detailing.',
    details: ['Distressed denim shell', 'Silver hardware', 'Editorial patch graphics', 'Ribbed trim'],
  },
];

export function getProductById(id: number) {
  return products.find(p => p.id === id);
}

export function formatProductNameForPath(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createProductHref(product: {
  id: number;
  publicId?: string;
  name: string;
  collection?: string;
  price?: number;
  image?: string;
  description?: string;
  category?: string;
  tag?: string;
  details?: string[];
  sizes?: string[];
}) {
  const routeId = product.publicId || String(product.id);
  return `/product/${routeId}/${formatProductNameForPath(product.name)}`;
}

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug);
}

export function searchProducts(query: string, category?: string, sizes?: string[]) {
  return products.filter(p => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.collection.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || category === 'ALL' || p.category === category;
    const matchesSizes = !sizes || sizes.length === 0 || p.sizes.some(s => sizes.includes(s));
    return matchesQuery && matchesCategory && matchesSizes;
  });
}
