import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: number, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);

          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      updateQuantity: (id, newQuantity) =>
        set((state) => {
          if (newQuantity < 1) {
            return {
              cart: state.cart.filter((item) => item.id !== id),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            ),
          };
        }),

      clearCart: () => set({ cart: [] }),

      totalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart",
    }
  )
);