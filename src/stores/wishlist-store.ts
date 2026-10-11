"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProductById } from "@/lib/catalog";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const exists = get().ids.includes(productId);
        set({
          ids: exists ? get().ids.filter((id) => id !== productId) : [...get().ids, productId],
        });
        return !exists;
      },
      remove: (productId) => set({ ids: get().ids.filter((id) => id !== productId) }),
      has: (productId) => get().ids.includes(productId),
    }),
    {
      name: "visionco-wishlist-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<WishlistState>;
        return { ...current, ids: (p.ids ?? []).filter((id) => !!getProductById(id)) };
      },
    },
  ),
);
