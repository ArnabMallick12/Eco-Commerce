import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  user: null,
  purchaseHistory: [],
  addToCart: (product) =>
    set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  setUser: (user) => set({ user }),
  completePurchase: () =>
    set((state) => ({
      purchaseHistory: [...state.purchaseHistory, ...state.cart],
      cart: [],
      user: state.user
        ? {
            ...state.user,
            rewardPoints:
              state.user.rewardPoints +
              state.cart.reduce((total, item) => total + item.rewardPoints, 0),
          }
        : null,
    })),
}));