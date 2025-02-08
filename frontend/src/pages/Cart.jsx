import React, { useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const { cart, fetchCart, removeFromCart, completePurchase } = useStore((state) => ({
    cart: state.cart || [], // ✅ Ensure cart is always an array
    fetchCart: state.fetchCart,
    removeFromCart: state.removeFromCart,
    completePurchase: state.completePurchase,
  }));

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  // console.log("🛒 Current cart data (after fix):", cart); // ✅ Debugging log

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div key={item._id || item.productId} className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="ml-6 flex-grow">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">price : {item.price}</p>
                <p className="text-gray-600 text-sm">Reward Points : {item.rewardPoints}</p>
                <button
                  onClick={() => {
                    console.log("🗑️ Removing item:", item);
                    removeFromCart(item._id || item.productId);
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={completePurchase} className="bg-green-600 text-white px-6 py-2 rounded-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
