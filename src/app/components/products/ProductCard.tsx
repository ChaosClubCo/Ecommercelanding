import React from "react";
import { Product } from "../../../types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { formatPrice } from "../../../lib/utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div 
        className="aspect-square relative cursor-pointer overflow-hidden bg-gray-100"
        onClick={() => onViewDetails(product)}
      >
        <ImageWithFallback 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {product.price < 100 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 
          className="font-semibold text-lg leading-tight mb-2 cursor-pointer hover:underline"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="font-bold text-lg">{formatPrice(product.price)}</div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full" onClick={() => onAddToCart(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}