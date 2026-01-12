import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getShippingCost: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecommerce_cart';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          return JSON.parse(savedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success(`Updated quantity for ${product.name}`);
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`Added ${product.name} to cart`);
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (item) {
        toast.error(`Removed ${item.name} from cart`);
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getShippingCost = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 100 ? 0 : 15;
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getShippingCost();
  };

  const value: CartContextType = {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getShippingCost,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
