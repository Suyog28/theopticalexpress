import type { Localized } from "./i18n";

export type CategorySlug =
  "eyeglasses" | "sunglasses" | "kids" | "premium" | "everyday" | "blue-light";

/** Primary department a product is listed under. Collections (premium, everyday, blue-light) are tags. */
export type Department = "eyeglasses" | "sunglasses" | "kids";

export type FrameShape =
  "rectangle" | "round" | "oval" | "cat-eye" | "aviator" | "browline" | "geometric" | "wayfarer";

export type FrameMaterial = "acetate" | "metal" | "titanium" | "tr90" | "stainless-steel";

export type ColourKey =
  | "black"
  | "tortoise"
  | "gold"
  | "silver"
  | "gunmetal"
  | "clear"
  | "brown"
  | "pink"
  | "blue"
  | "white";

export type Fit = "unisex" | "men" | "women" | "kids";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductImage {
  src: string;
  alt: Localized;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colour: ColourKey;
  stockQty: number;
}

export interface FrameSize {
  /** Lens width in mm */
  lens: number;
  /** Bridge width in mm */
  bridge: number;
  /** Temple length in mm */
  temple: number;
  label: "S" | "M" | "L";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Department;
  collections: CategorySlug[];
  shortDescription: Localized;
  description: Localized;
  /** Price in integer paise (₹1 = 100 paise). */
  pricePaise: number;
  originalPricePaise?: number;
  images: ProductImage[];
  material: FrameMaterial;
  shape: FrameShape;
  size: FrameSize;
  fit: Fit;
  variants: ProductVariant[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  /** Illustrative popularity score used for "Most popular" sorting. */
  popularity: number;
  createdAt: string;
  isActive: boolean;
  /** Always true until the owner supplies the real catalogue. */
  isSample: true;
  /** Whether prescription lenses can be fitted. Never assume — set per product. */
  supportsPrescription: boolean;
}

export interface Category {
  slug: CategorySlug;
  image: string;
  imageAlt: Localized;
}
