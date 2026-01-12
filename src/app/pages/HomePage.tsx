import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/products/ProductCard";
import { Product } from "../../types";
import { fetchProducts } from "../../data/mockData";
import { motion } from "framer-motion";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function HomePage({ onNavigate, onAddToCart, onViewDetails }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Summer Collection 2026
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover the latest trends in fashion and electronics. Premium quality, unbeatable prices.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => onNavigate("shop")}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Electronics", "Fashion", "Accessories"].map((cat) => (
              <div 
                key={cat} 
                className="group relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onNavigate("shop")}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <h3 className="text-2xl font-bold text-white">{cat}</h3>
                </div>
                {/* Fallback pattern background since we don't have category images specifically */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="link" onClick={() => onNavigate("shop")}>View All</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-400">Get 10% off your first order when you subscribe.</p>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 rounded-md bg-gray-800 border-none text-white w-full md:w-80"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}