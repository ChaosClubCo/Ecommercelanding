import React, { useState } from "react";
import { ShoppingCart, Search, Menu, User, Heart, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

interface HeaderProps {
  onNavigate: (page: string) => void;
  cartCount: number;
  onSearch?: (query: string) => void;
}

export function Header({ onNavigate, cartCount, onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearch) {
        onSearch(searchInput);
      }
      onNavigate("search");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={() => handleNavigate("home")} 
                  className="text-left py-3 border-b font-medium hover:text-gray-600 transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavigate("shop")} 
                  className="text-left py-3 border-b font-medium hover:text-gray-600 transition-colors"
                >
                  Shop
                </button>
                <button 
                  onClick={() => handleNavigate("about")} 
                  className="text-left py-3 border-b font-medium hover:text-gray-600 transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => handleNavigate("contact")} 
                  className="text-left py-3 border-b font-medium hover:text-gray-600 transition-colors"
                >
                  Contact
                </button>
                <button 
                  onClick={() => handleNavigate("account")} 
                  className="text-left py-3 border-b font-medium hover:text-gray-600 transition-colors"
                >
                  My Account
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
          <span className="text-xl font-bold tracking-tight">STORE</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => onNavigate("home")} className="transition-colors hover:text-gray-600">Home</button>
          <button onClick={() => onNavigate("shop")} className="transition-colors hover:text-gray-600">Shop</button>
          <button onClick={() => onNavigate("about")} className="transition-colors hover:text-gray-600">About</button>
          <button onClick={() => onNavigate("contact")} className="transition-colors hover:text-gray-600">Contact</button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex w-full max-w-sm items-center space-x-2 mr-4">
            <Input 
              type="email" 
              placeholder="Search..." 
              className="h-8 w-[150px] lg:w-[250px]" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => onNavigate("account")}>
            <User className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
             <Heart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => onNavigate("cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}