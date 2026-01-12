import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { Product } from '../types';
import { Toaster } from 'sonner';
import { CartProvider, useCart } from '../contexts/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Router Types
type Page = 'home' | 'shop' | 'cart' | 'checkout' | 'account' | 'about' | 'contact' | 'product-detail' | 'search' | 'order-confirmation';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const { cart, cartCount, addToCart, updateQuantity, removeFromCart } = useCart();

  // Navigation Handler
  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Order completion handler
  const handleOrderComplete = (orderNum: string) => {
    setOrderNumber(orderNum);
    navigate('order-confirmation');
  };

  // View Logic
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={navigate} 
            onAddToCart={addToCart}
            onViewDetails={(p) => {
              setSelectedProduct(p);
              navigate('product-detail');
            }}
          />
        );
      case 'shop':
        return (
          <ShopPage 
            onAddToCart={addToCart}
            onViewDetails={(p) => {
              setSelectedProduct(p);
              navigate('product-detail');
            }}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage 
            product={selectedProduct}
            onAddToCart={addToCart}
            onNavigate={navigate}
            onViewDetails={(p) => {
              setSelectedProduct(p);
              navigate('product-detail');
            }}
          />
        ) : (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <button 
              className="mt-8 text-blue-600 hover:underline"
              onClick={() => navigate("shop")}
            >
              Back to Shop
            </button>
          </div>
        );
      case 'cart':
        return (
          <CartPage 
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onNavigate={navigate}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage 
            onOrderComplete={handleOrderComplete}
            onNavigate={navigate}
          />
        );
      case 'account':
        return <AuthPage onNavigate={navigate} />;
      case 'search':
        return (
          <SearchPage 
            initialQuery={searchQuery}
            onAddToCart={addToCart} 
            onNavigate={navigate} 
            onViewDetails={(p) => {
              setSelectedProduct(p);
              navigate('product-detail');
            }}
          />
        );
      case 'order-confirmation':
        return (
          <OrderConfirmationPage 
            orderNumber={orderNumber}
            onNavigate={navigate}
          />
        );
      default:
        return (
          <div className="container mx-auto px-4 py-20 text-center">
             <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
             <p className="text-gray-500">This page is under construction.</p>
             <button 
              className="mt-8 text-blue-600 hover:underline"
              onClick={() => navigate("home")}
            >
              Back Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      <Toaster position="top-center" />
      <Header onNavigate={navigate} cartCount={cartCount} onSearch={handleSearch} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </CartProvider>
  );
}

export default App;