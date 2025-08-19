import { KahitSanPricing } from '../types/pricing';

export const kahitsanPricing: KahitSanPricing[] = [
  {
    spaceType: 'entrance',
    name: 'Entrance Sector',
    basePrice: 99,
    baseDuration: 8,
    extensionPrice: 15,
    discountBlockPrice: 99,
    currency: 'PHP'
  },
  {
    spaceType: 'inner',
    name: 'Inner Sector', 
    basePrice: 149,
    baseDuration: 8,
    extensionPrice: 15,
    discountBlockPrice: 120,
    currency: 'PHP'
  },
  {
    spaceType: 'call_chamber',
    name: 'Call Chamber',
    basePrice: 250,
    baseDuration: 5,
    extensionPrice: 50,
    currency: 'PHP'
  },
  {
    spaceType: 'whole_inner',
    name: 'Whole Inner Sector',
    basePrice: 500,
    baseDuration: 2,
    extensionPrice: 250,
    currency: 'PHP'
  }
];
