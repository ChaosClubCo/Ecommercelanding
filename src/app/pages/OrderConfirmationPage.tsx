import React from "react";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationPageProps {
  orderNumber: string;
  onNavigate: (page: string) => void;
}

export function OrderConfirmationPage({ orderNumber, onNavigate }: OrderConfirmationPageProps) {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
      <p className="text-lg mb-8">
        Your order number is: <strong className="font-mono">{orderNumber}</strong>
      </p>
      <p className="text-sm text-gray-500 mb-8">
        A confirmation email will be sent to your email address once backend is connected.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => onNavigate("home")}>Continue Shopping</Button>
        <Button variant="outline" onClick={() => onNavigate("shop")}>Browse Products</Button>
      </div>
    </div>
  );
}
