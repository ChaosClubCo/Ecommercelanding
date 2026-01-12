# Developer Handoff Guide

## 📋 Project Overview

This is a modern e-commerce web application built as a progressive enhancement prototype. The current version (v0.2.0) includes a fully functional frontend with cart management, product browsing, search functionality, and is ready for backend integration.

**Current Status:** Production-ready frontend, backend integration in progress  
**Tech Stack:** React 18.3.1, TypeScript, Tailwind CSS v4, Vite 6.3.5  
**Target Deployment:** https://thundercloud.base44.app

---

## 🚀 Quick Start for New Developers

### 1. Clone and Setup
```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run build
```

### 2. Understanding the Architecture

#### Project Structure
```
/src
├── /app                    # Main application code
│   ├── App.tsx            # Root component with routing
│   ├── /components        # Reusable components
│   │   ├── /layout        # Header, Footer
│   │   ├── /products      # ProductCard
│   │   └── /ui            # shadcn/ui library
│   └── /pages             # Page components
│       ├── HomePage.tsx
│       ├── ShopPage.tsx
│       ├── ProductDetailPage.tsx
│       ├── SearchPage.tsx
│       ├── CartPage.tsx
│       └── AuthPage.tsx
├── /contexts              # React Context providers
│   └── CartContext.tsx    # Global cart state
├── /data                  # Mock data
│   └── mockData.ts        # 6 sample products
├── /types                 # TypeScript definitions
│   └── index.ts
└── /lib                   # Utilities
    └── utils.ts           # Helper functions
```

#### Key Concepts

**Client-Side Routing:**
- Routing is managed via state in `App.tsx`
- No external router library (keeps it simple)
- Navigation via `navigate()` function passed as props

**State Management:**
- Global cart state: `CartContext` (Context API)
- Local state: React useState hooks
- Persistence: localStorage for cart

**Styling:**
- Tailwind CSS v4 (utility-first)
- Custom theme in `/src/styles/theme.css`
- No CSS modules or styled-components

---

## 🔧 Development Patterns

### Adding a New Page

1. Create page component in `/src/app/pages/`:
```tsx
// NewPage.tsx
import React from 'react';

interface NewPageProps {
  onNavigate: (page: string) => void;
}

export function NewPage({ onNavigate }: NewPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
      {/* Your content */}
    </div>
  );
}
```

2. Add route to `App.tsx`:
```tsx
// Add to Page type
type Page = 'home' | 'shop' | 'cart' | 'new-page' | ...;

// Add case to renderPage()
case 'new-page':
  return <NewPage onNavigate={navigate} />;
```

3. Add navigation link in Header or elsewhere:
```tsx
<button onClick={() => onNavigate("new-page")}>New Page</button>
```

### Adding a New Component

1. Create component in `/src/app/components/`:
```tsx
// components/MyComponent.tsx
import React from 'react';
import { Button } from './ui/button';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <Button onClick={onClick}>Click Me</Button>
    </div>
  );
}
```

2. Import and use:
```tsx
import { MyComponent } from './components/MyComponent';

// In your component
<MyComponent title="Hello" onClick={() => console.log('clicked')} />
```

### Working with Cart Context

The cart is managed globally via CartContext. Here's how to use it:

```tsx
import { useCart } from '../contexts/CartContext';

function MyComponent() {
  const { 
    cart,           // CartItem[]
    cartCount,      // number
    addToCart,      // (product: Product, quantity?: number) => void
    updateQuantity, // (id: string, delta: number) => void
    removeFromCart, // (id: string) => void
    clearCart,      // () => void
    getCartTotal,   // () => number
    getCartSubtotal,// () => number
    getShippingCost // () => number
  } = useCart();

  // Use cart functions
  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return <div>Cart Count: {cartCount}</div>;
}
```

**Important:** Always wrap your app with `<CartProvider>` in the root:
```tsx
function App() {
  return (
    <CartProvider>
      <YourApp />
    </CartProvider>
  );
}
```

### Using UI Components

All UI components are from shadcn/ui and are located in `/src/app/components/ui/`.

```tsx
// Import what you need
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Use them
<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter text" />
    <Button>Submit</Button>
  </CardContent>
</Card>
```

[Full UI component list in package.json]

---

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

**Do:**
```tsx
// Use utility classes
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">

// Use responsive variants
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Use hover and focus states
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2">
```

**Don't:**
```tsx
// Don't use inline styles (unless absolutely necessary)
<div style={{ padding: '16px' }}>

// Don't create custom CSS classes (use Tailwind)
<div className="my-custom-class">
```

### Theme Colors

Use theme colors from `/src/styles/theme.css`:
- Primary: Black (`bg-black`, `text-black`)
- Secondary: Gray shades (`bg-gray-100`, `text-gray-500`)
- Accent: Blue (`bg-blue-600`, `text-blue-600`)
- Error: Red (`bg-red-500`, `text-red-500`)
- Success: Green (`bg-green-600`, `text-green-600`)

---

## 🔌 Backend Integration Guide

### Current Setup

The project has a Supabase backend server configured in `/supabase/functions/server/`.

**Server Structure:**
```
/supabase/functions/server/
├── index.tsx        # Main Hono server
└── kv_store.tsx     # Key-value store utilities (protected)
```

**Current Endpoints:**
- `GET /make-server-f0d6b019/health` - Health check

### Adding Backend Functionality

#### 1. Authentication

To add real authentication:

```tsx
// In your AuthPage.tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

#### 2. Database Operations

Use the KV store for simple data:

```tsx
import * as kv from '/supabase/functions/server/kv_store';

// Set value
await kv.set('key', 'value');

// Get value
const value = await kv.get('key');

// Delete value
await kv.del('key');

// Get multiple
const values = await kv.mget(['key1', 'key2']);
```

For complex data, create database tables via Supabase dashboard.

#### 3. Adding New API Routes

In `/supabase/functions/server/index.tsx`:

```tsx
// Add new route
app.post('/make-server-f0d6b019/products', async (c) => {
  try {
    const product = await c.req.json();
    // Save to database
    await kv.set(`product:${product.id}`, JSON.stringify(product));
    return c.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

app.get('/make-server-f0d6b019/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    return c.json({ product: JSON.parse(product) });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});
```

#### 4. Frontend API Calls

```tsx
import { projectId, publicAnonKey } from '/utils/supabase/info';

async function fetchProducts() {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-f0d6b019/products`,
    {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await response.json();
  return data;
}
```

### Environment Variables

Required for backend:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server only!)

**⚠️ NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend!**

---

## 🐛 Common Issues & Solutions

### Issue: Cart not persisting
**Solution:** Check that `<CartProvider>` wraps your app in App.tsx

### Issue: Images not loading
**Solution:** Ensure you're using `<ImageWithFallback>` component, not `<img>`

### Issue: Tailwind classes not working
**Solution:** Check `/src/styles/theme.css` for custom theme overrides

### Issue: TypeScript errors
**Solution:** Run `npm install` to ensure all types are installed. Check `/src/types/index.ts`

### Issue: Search not working
**Solution:** Ensure `onSearch` prop is passed to Header component

### Issue: Mobile menu not opening
**Solution:** Check that Sheet component is properly imported from shadcn/ui

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

**Core Functionality:**
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Cart persists after refresh
- [ ] Search products
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Sort products
- [ ] View product details
- [ ] Navigate between pages
- [ ] Mobile menu works
- [ ] Toast notifications appear

**Responsive Design:**
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] All images load correctly
- [ ] Text is readable at all sizes

### Adding Tests (Future)

For unit tests:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

For E2E tests:
```bash
npm install -D @playwright/test
```

---

## 📦 Deployment

### Building for Production

```bash
npm run build
```

This creates optimized files in `/dist`.

### Environment Variables

Set these in your deployment platform:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Recommended Hosting

- **Frontend:** Vercel, Netlify, or Cloudflare Pages
- **Backend:** Supabase (already configured)
- **Images:** Unsplash (current) or Cloudinary (recommended for production)

---

## 🔐 Security Considerations

### Current Security
- ✅ No sensitive data in frontend
- ✅ Environment variables for backend
- ✅ Input sanitization on forms
- ✅ CORS configured on server

### TODO for Production
- [ ] Add rate limiting to API
- [ ] Implement CSRF protection
- [ ] Add input validation on server
- [ ] Sanitize user-generated content
- [ ] Add security headers
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Use HTTPS only
- [ ] Add content security policy

---

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)

### Project Files
- `README.md` - Project overview and features
- `CHANGELOG.md` - Version history and changes
- `ROADMAP.md` - Future features and phases
- `DEVELOPER_GUIDE.md` - This file

---

## 🆘 Getting Help

### Common Questions

**Q: How do I add a new product?**  
A: Currently, products are in `/src/data/mockData.ts`. For production, connect to database.

**Q: Can I use a different UI library?**  
A: Yes, but shadcn/ui is already set up. Switching would require significant refactoring.

**Q: How do I change the logo?**  
A: Edit the Header component at `/src/app/components/layout/Header.tsx`

**Q: Where are the product images stored?**  
A: Currently from Unsplash CDN. For production, upload to Supabase Storage or Cloudinary.

**Q: How do I add more payment methods?**  
A: Checkout is a placeholder. Implement with Stripe (recommended) or other payment gateway.

---

## ✅ Pre-Launch Checklist

Before deploying to production:

### Code Quality
- [ ] Remove console.logs
- [ ] Fix all TypeScript errors
- [ ] Remove unused imports and variables
- [ ] Add proper error boundaries
- [ ] Add loading states to all async operations

### Performance
- [ ] Optimize images (compress, use WebP)
- [ ] Code split large components
- [ ] Add lazy loading
- [ ] Run Lighthouse audit (score > 90)
- [ ] Test on slow 3G network

### SEO
- [ ] Add meta tags to all pages
- [ ] Add Open Graph tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Add schema.org structured data

### Security
- [ ] Review all API endpoints
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Set up security headers
- [ ] Review environment variables

### Testing
- [ ] Test all user flows
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Test with screen readers
- [ ] Load test API endpoints

### Legal
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add cookie consent (if needed)
- [ ] Add GDPR compliance (if needed)
- [ ] Add refund policy

---

## 🎯 Next Steps

### Immediate (This Week)
1. Implement wishlist functionality
2. Add user profile page
3. Set up backend authentication

### Short Term (Next Month)
1. Connect product catalog to database
2. Implement checkout with Stripe
3. Add order management
4. Launch MVP

### Long Term (Next Quarter)
1. Add reviews system
2. Build admin dashboard
3. Implement analytics
4. Scale and optimize

---

**Last Updated:** January 12, 2026  
**Version:** 0.2.0  
**Maintained By:** Development Team  

**Questions?** Review the documentation or check the roadmap for planned features.

---

## Appendix: Code Examples

### Example: Creating a New Context

```tsx
// contexts/WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => [...prev, product]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(p => p.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
```

### Example: Protected Route

```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export function ProtectedRoute({ children, onNavigate }: { children: React.ReactNode, onNavigate: (page: string) => void }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      onNavigate('account');
    }
  }, [user, loading, onNavigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}

// Usage in App.tsx
case 'profile':
  return (
    <ProtectedRoute onNavigate={navigate}>
      <ProfilePage />
    </ProtectedRoute>
  );
```

---

**Happy Coding! 🚀**
