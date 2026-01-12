import React, { useState } from "react";
import { Product } from "../../types";
import { Button } from "../components/ui/button";
import { formatPrice } from "../../lib/utils";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, ChevronLeft, Minus, Plus, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { ProductCard } from "../components/products/ProductCard";
import { PRODUCTS } from "../../data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductDetailPage({ product, onAddToCart, onNavigate, onViewDetails }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock additional images (in real app, these would come from product data)
  const images = [product.image, product.image, product.image];

  // Get related products from same category
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this product! The quality exceeded my expectations and delivery was super fast.",
      verified: true
    },
    {
      id: 2,
      author: "John D.",
      rating: 4,
      date: "1 month ago",
      comment: "Great product overall. Good value for money. Would recommend to others.",
      verified: true
    },
    {
      id: 3,
      author: "Emma W.",
      rating: 5,
      date: "1 month ago",
      comment: "Perfect! Exactly what I was looking for. Will definitely buy again.",
      verified: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <button onClick={() => onNavigate("home")} className="hover:text-gray-700">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate("shop")} className="hover:text-gray-700">Shop</button>
          <span>/</span>
          <span className="text-gray-700">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedImage === idx ? "border-black" : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <ImageWithFallback 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                {product.price < 100 && (
                  <Badge variant="destructive" className="text-sm">ON SALE</Badge>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border rounded-md">
                    <button 
                      className="p-3 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button 
                      className="p-3 hover:bg-gray-100"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {quantity > 1 && `Total: ${formatPrice(product.price * quantity)}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 h-12 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-gray-600" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RefreshCw className="h-5 w-5 text-gray-600" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - Reviews & Description */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This premium product is crafted with attention to detail and designed to exceed your expectations. 
                  Made from high-quality materials, it offers durability and style that will last for years to come.
                </p>
                <h3 className="text-xl font-semibold mb-3">Key Features:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Premium quality materials</li>
                  <li>Expert craftsmanship</li>
                  <li>Modern and timeless design</li>
                  <li>Sustainable and eco-friendly</li>
                  <li>Perfect for everyday use</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Category</span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Brand</span>
                    <span className="text-gray-600">STORE Premium</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">SKU</span>
                    <span className="text-gray-600">PRD-{product.id.padStart(6, '0')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Warranty</span>
                    <span className="text-gray-600">2 Years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">In Stock</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Shipping</span>
                    <span className="text-gray-600">Free over $100</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold mb-1">{product.rating}</div>
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                    </div>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
