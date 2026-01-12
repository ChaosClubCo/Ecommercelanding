import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  onOrderComplete: (orderNumber: string) => void;
}

export function CheckoutPage({ onNavigate, onOrderComplete }: CheckoutPageProps) {
  const { cart, getCartSubtotal, getShippingCost, getCartTotal, clearCart } = useCart();
  
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate order creation
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // In a real app, this would create a payment intent and process the payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      toast.success("Order placed successfully!");
      onOrderComplete(orderNumber);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => onNavigate("shop")}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input 
                  id="address" 
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input 
                    id="state" 
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input 
                  id="zip" 
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  required 
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-600">
                  💳 Payment integration ready for Stripe
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This is a demo checkout. In production, Stripe payment elements would appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{getShippingCost() === 0 ? "Free" : formatPrice(getShippingCost())}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={loading}
              >
                {loading ? "Processing..." : `Place Order ${formatPrice(getCartTotal())}`}
              </Button>
              <p className="text-xs text-center text-gray-500">
                By placing this order, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
