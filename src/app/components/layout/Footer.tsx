import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">STORE</h3>
            <p className="text-sm text-gray-500">
              Premium products for your lifestyle. Quality guaranteed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>All Products</li>
              <li>Featured</li>
              <li>New Arrivals</li>
              <li>Sale</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Shipping & Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Enter your email" 
              />
              <button className="bg-black text-white h-9 px-4 rounded-md text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} STORE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}