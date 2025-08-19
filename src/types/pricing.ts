export interface KahitSanPricing {
  spaceType: 'entrance' | 'inner' | 'call_chamber' | 'whole_inner';
  name: string;
  basePrice: number;
  baseDuration: number; // in hours
  extensionPrice: number;
  discountBlockPrice?: number;
  currency: string;
}
