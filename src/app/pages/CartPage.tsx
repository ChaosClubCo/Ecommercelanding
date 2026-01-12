import React from "react";
import { CartItem } from "../../types";
import { Button } from "../components/ui/button";
import { formatPrice } from "../../lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../../contexts/CartContext";

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigate: (page: string) => void;
}

export function CartPage({ cart, onUpdateQuantity, onRemoveItem, onNavigate }: CartPageProps) {
  const { getCartSubtotal, getShippingCost, getCartTotal } = useCart();
  
  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => onNavigate("shop")}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="font-bold">{formatPrice(item.price)}</div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2 border rounded-md">
                    <button 
                      className="p-1 hover:bg-gray-100"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      className="p-1 hover:bg-gray-100"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    className="text-red-500 text-sm hover:underline flex items-center gap-1"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="w-full lg:w-96 h-fit bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          
          <Button className="w-full h-12 text-lg" onClick={() => onNavigate("checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}