export interface HectarePricing {
  id: string;
  name: string;
  pricePerHectare: number;
  width: number;
  length: number;
  hectares: number;
  totalPrice: number;
}

export interface PricingFormData {
  name: string;
  pricePerHectare: number;
  width: number;
  length: number;
}
