import React, { useState, useEffect } from "react";
import { ProductCard } from "../components/products/ProductCard";
import { Product } from "../../types";
import { fetchProducts } from "../../data/mockData";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

interface ShopPageProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ShopPage({ onAddToCart, onViewDetails }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all" 
                  checked={selectedCategory === null}
                  onCheckedChange={() => setSelectedCategory(null)}
                />
                <Label htmlFor="all" className="cursor-pointer">All Categories</Label>
              </div>
              {categories.map(cat => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={cat} 
                    checked={selectedCategory === cat}
                    onCheckedChange={() => setSelectedCategory(cat)}
                  />
                  <Label htmlFor={cat} className="cursor-pointer">{cat}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Price Range</h3>
            <Slider 
              defaultValue={priceRange} 
              max={1000} 
              step={10} 
              className="mb-2" 
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}