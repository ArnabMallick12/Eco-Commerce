import { create } from "zustand";

// Backend URL
const API_URL = 'https://eco-commerce-2vxl.onrender.com'

export const useStore = create((set, get) => ({
  cart: [],
  user: JSON.parse(localStorage.getItem("user")) || null,
  setUser: (userData) => {
    if (!userData) {
      set({ user: null });
      return;
    }
    
    // ✅ Ensure rewardPoints is included
    const user = {
      ...userData,
      rewardPoints: userData.rewardPoints || 0
    };
    
    // ✅ Update localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // ✅ Update store state
    set({ user });
  },
  purchaseHistory: [],
  totalCarbonFootprint: 0,
  isLoading: false,
  notification: null,

  // ✅ Set Loading State
  setLoading: (isLoading) => set({ isLoading }),

  // ✅ Show Notification
  showNotification: (message, type = 'success') => {
    set({ notification: { message, type } });
    // Auto hide after 3 seconds
    setTimeout(() => set({ notification: null }), 3000);
  },

  // ✅ Fetch User Rewards, Purchase History & Carbon Footprint
  fetchUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/user/${user.id}/rewards`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const userData = await response.json();
      console.log("✅ Fetched user data:", userData);
      
      // ✅ Update user data in localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.rewardPoints = userData.rewardPoints;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      
      // ✅ Update store state
      set({ 
        user: { ...user, rewardPoints: userData.rewardPoints },
        purchaseHistory: userData.purchaseHistory || []
      });
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  },

  // ✅ Fetch Purchase History
  fetchPurchaseHistory: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/user/${user.id}/rewards`);
      if (!response.ok) throw new Error("Failed to fetch purchase history");
      
      const data = await response.json();
      console.log("✅ Fetched purchase history:", data);
      
      set({ purchaseHistory: data.purchaseHistory || [] });
    } catch (error) {
      console.error("❌ Error fetching purchase history:", error);
    }
  },

  // ✅ Get Total Spent
  getTotalSpent: () => {
    const purchaseHistory = get().purchaseHistory;
    return purchaseHistory.reduce((total, item) => total + item.totalPrice, 0);
  },

  // ✅ Fetch Cart from Backend
  fetchCart: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/${user.id}`);
      const data = await response.json();

      if (!data.items || !Array.isArray(data.items)) {
        return;
      }

      set({ cart: data.items }); // ✅ Store only the array of items
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  },

  // ✅ Add to Cart
  addToCart: async (product) => {
    const user = get().user;
    if (!user) {
      get().showNotification("Please login to add items to cart", "error");
      return;
    }

    try {
      get().setLoading(true);
      get().showNotification("Adding to cart...", "info");

      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id
        }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      const data = await response.json();
      console.log("✅ Added to cart:", data);

      // ✅ Update local cart state
      set((state) => ({
        cart: [...state.cart, product],
      }));

      get().showNotification("Added to cart successfully! 🛒", "success");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      get().showNotification("Failed to add item to cart", "error");
    } finally {
      get().setLoading(false);
    }
  },

  // ✅ Remove from Cart
  removeFromCart: async (productId) => {
    const user = get().user;
    if (!user) return;

    try {
      get().setLoading(true);
      get().showNotification("Removing from cart...", "info");

      const response = await fetch(`${API_URL}/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId
        }),
      });

      if (!response.ok) throw new Error("Failed to remove item from cart");

      const data = await response.json();
      console.log("✅ Removed from cart:", data);

      // ✅ Update local cart state
      set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
      }));

      get().showNotification("Item removed from cart", "success");
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      get().showNotification("Failed to remove item from cart", "error");
    } finally {
      get().setLoading(false);
    }
  },

  // ✅ Complete Purchase (Checkout)
  completePurchase: async () => {
    const user = get().user;
    if (!user) {
      get().showNotification("Please login to complete purchase", "error");
      return;
    }

    try {
      get().setLoading(true);
      get().showNotification("Processing your order...", "info");

      // ✅ Fetch the latest cart from the database
      const cartResponse = await fetch(`${API_URL}/cart/${user.id}`);
      const cartData = await cartResponse.json();

      if (!cartResponse.ok || !cartData.items || !Array.isArray(cartData.items)) {
        console.error("❌ Error fetching cart from database:", cartData);
        get().showNotification("Error: Could not retrieve cart details", "error");
        return;
      }

      const cart = cartData.items;

      if (cart.length === 0) {
        get().showNotification("Your cart is empty", "error");
        return;
      }

      // ✅ Send checkout request using cart from database
      const checkoutResponse = await fetch(`${API_URL}/cart/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const responseData = await checkoutResponse.json();
      
      if (!checkoutResponse.ok) {
        console.error("❌ Checkout failed:", {
          status: checkoutResponse.status,
          statusText: checkoutResponse.statusText,
          data: responseData
        });
        throw new Error(responseData.error || "Checkout failed");
      }

      console.log("✅ Checkout successful:", responseData);

      // ✅ Update user data with new reward points from checkout response
      const updatedUser = {
        ...user,
        rewardPoints: responseData.newRewardPoints
      };

      // ✅ Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Update store state
      set({ 
        user: updatedUser,
        purchaseHistory: [...get().purchaseHistory, responseData.order],
        cart: [] 
      });

      get().showNotification("Order placed successfully! 🎉", "success");

      // ✅ Navigate to success page
      window.location.href = '/checkout-success';
    } catch (error) {
      console.error("❌ Error during checkout:", {
        message: error.message,
        stack: error.stack,
        user: user?.id
      });
      get().showNotification(error.message || "Error processing checkout", "error");
    } finally {
      get().setLoading(false);
    }
  },

  // ✅ Logout User
  logout: () => {
    // ✅ Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

    // ✅ Reset store state
    set({
      user: null,
      cart: [],
      purchaseHistory: [],
      totalCarbonFootprint: 0,
      notification: { message: "Logged out successfully", type: "success" }
    });
  },
}));
