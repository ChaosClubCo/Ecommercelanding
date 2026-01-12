import React, { useState, useMemo } from "react";
import { Product } from "../../types";
import { PRODUCTS } from "../../data/mockData";
import { ProductCard } from "../components/products/ProductCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface SearchPageProps {
  initialQuery?: string;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onNavigate: (page: string) => void;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'name';

export function SearchPage({ initialQuery = "", onAddToCart, onViewDetails, onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  // Search and filter logic
  const filteredAndSortedProducts = useMemo(() => {
    let results = PRODUCTS;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    return results;
  }, [searchQuery, sortBy, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive, so this just prevents form submission
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="px-8">
            Search
          </Button>
        </form>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        {searchQuery && (
          <p className="text-gray-600">
            {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 ? 's' : ''} for 
            <span className="font-semibold"> "{searchQuery}"</span>
          </p>
        )}
        {!searchQuery && (
          <p className="text-gray-600">
            Showing all {filteredAndSortedProducts.length} products
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setSortBy("relevance");
          }}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
