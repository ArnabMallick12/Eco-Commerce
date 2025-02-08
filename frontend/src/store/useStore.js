import { create } from "zustand";

// Backend URL
const API_URL = "https://eco-commerce-2vxl.onrender.com/cart";

export const useStore = create((set, get) => ({
  cart: [],
  user: JSON.parse(localStorage.getItem("user")) || null,
  setUser: (user) => set({ user }),
  purchaseHistory: [],
  totalCarbonFootprint: 0,

   // ✅ Fetch User Rewards & Purchase History
   fetchUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`https://eco-commerce-2vxl.onrender.com/user/${user.id}/rewards`);
      const data = await response.json();

      console.log("🏆 Updated user data after checkout:", data);

      set({
        user: { ...user, rewardPoints: data.rewardPoints },
        purchaseHistory: data.purchaseHistory || [],
        totalCarbonFootprint: data.totalCarbonFootprint || 0, // ✅ Store purchase history
      });
    } catch (error) {
      console.error("❌ Error fetching updated user data:", error);
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
      // console.log("📦 Fetched cart data:", data);

      if (!data.items || !Array.isArray(data.items)) {
        // console.error("❌ Cart response format is incorrect:", data);
        return;
      }

      set({ cart: data.items }); // ✅ Store only the array of items
    } catch (error) {
      // console.error("❌ Error fetching cart:", error);
    }
  },

   // ✅ Get Total Carbon Footprint
   getTotalCarbonFootprint: () => {
    return get().totalCarbonFootprint; // ✅ Returns stored carbon footprint
  },

  // ✅ Add to Cart (Sends request to backend)
  addToCart: async (product) => {
    const user = get().user;
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }
  
    if (!product || !product._id) {
      alert("Error: Product ID is missing!");
      return;
    }
  
    if (typeof product.rewardPoints === "undefined") {
      console.warn("⚠️ Missing rewardPoints in product:", product);
      return alert("Error: This product is missing reward points.");
    }
  
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product._id }),
      });
  
      const data = await response.json();
      console.log("🔄 Response from server:", data);
  
      if (!response.ok) throw new Error(data.error || "Failed to add item");
  
      // ✅ Ensure all required fields are added
      const newItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        rewardPoints: product.rewardPoints,
        carbonFootprint : product.carbonFootprint,
        imageUrl: product.imageUrl,
      };
  
      set((state) => ({
        cart: [...state.cart, newItem],
      }));
  
      console.log("✅ Updated cart:", get().cart);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  },

   // ✅ Fetch Purchase History & Carbon Footprint
   fetchPurchaseHistory: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/orders/${user.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch orders");

      set({
        purchaseHistory: data.orders || [],
        totalCarbonFootprint: data.totalCarbonFootprint || 0, // ✅ Store total carbon footprint
      });

      console.log("📜 Purchase history updated:", get().purchaseHistory);
    } catch (error) {
      console.error("❌ Error fetching purchase history:", error);
    }
  },
  

  // ✅ Remove from Cart (Sync with Backend)
  removeFromCart: async (productId) => {
    const user = get().user;
    if (!user) return;

    try {
      // console.log(`🗑️ Removing product ${productId} for user ${user.id}`);

      const response = await fetch(`${API_URL}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to remove item");

      set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId), // ✅ Update Zustand state
      }));

      console.log("✅ Item removed successfully:", data);
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  },

  // ✅ Complete Purchase (Checkout)
  completePurchase: async () => {
    const user = get().user;
    if (!user) return alert("User not authenticated");
  
    try {
      // ✅ Fetch the latest cart from the database
      const cartResponse = await fetch(`${API_URL}/${user.id}`);
      const cartData = await cartResponse.json();
  
      if (!cartResponse.ok || !cartData.items || !Array.isArray(cartData.items)) {
        console.error("❌ Error fetching cart from database:", cartData);
        return alert("Error: Could not retrieve cart details from the database.");
      }
  
      const cart = cartData.items; // ✅ Use fetched cart
  
      if (cart.length === 0) return alert("Cart is empty");
  
      console.log("🛒 Using database cart for checkout:", JSON.stringify(cart, null, 2));
  
      // ✅ Send checkout request using cart from database
      const checkoutResponse = await fetch("https://eco-commerce-2vxl.onrender.com/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cart }),
      });
  
      const checkoutData = await checkoutResponse.json();
      if (!checkoutResponse.ok) throw new Error(checkoutData.error || "Checkout failed");
  
      console.log("✅ Checkout successful:", checkoutData);
  
      // ✅ Fetch updated user rewards
      await get().fetchUserData();
      await get().fetchPurchaseHistory();
  
      // ✅ Clear cart in Zustand state (Frontend cart)
      set({ cart: [] });
  
      alert("Order placed successfully! Your rewards have been updated.");
    } catch (error) {
      console.error("❌ Error during checkout:", error);
    }
  },
  
  
}));
