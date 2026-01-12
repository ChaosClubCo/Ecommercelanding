import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

export const productsRouter = new Hono();

// Initialize Supabase client with error handling
let supabase: any = null;
try {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('⚠️ Supabase credentials not configured. API will return empty data.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
}

// Get all products
productsRouter.get('/products', async (c) => {
  try {
    // Return empty array if Supabase not configured
    if (!supabase) {
      console.log('📦 Database not configured - using frontend mock data');
      return c.json([]);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      // Check if it's a "table not found" error (expected before DB setup)
      if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message?.includes('Could not find')) {
        console.log('📦 Database tables not created yet - using frontend mock data');
        console.log('ℹ️  To use real database, run /supabase/DATABASE_SETUP.sql in Supabase SQL Editor');
        return c.json([]);
      }
      
      // Other errors - log them
      console.error('⚠️ Unexpected database error:', error);
      return c.json([]);
    }
    
    // Transform to match frontend Product type
    const products = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      image: p.image_url,
      category: p.category,
      rating: parseFloat(p.rating || 0),
      reviewCount: p.review_count || 0,
    }));
    
    console.log(`✅ Fetched ${products.length} products from database`);
    return c.json(products);
  } catch (error) {
    console.log('📦 Database error - using frontend mock data');
    // Return empty array to trigger mock data fallback
    return c.json([]);
  }
});

// Get single product by ID
productsRouter.get('/products/:id', async (c) => {
  try {
    if (!supabase) {
      return c.json({ error: 'Database not configured' }, 503);
    }

    const id = c.req.param('id');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return c.json({ error: 'Product not found' }, 404);
    }
    
    if (!data) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    // Transform to match frontend Product type
    const product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image_url,
      category: data.category,
      rating: parseFloat(data.rating || 0),
      reviewCount: data.review_count || 0,
    };
    
    return c.json(product);
  } catch (error) {
    console.error('Error in GET /products/:id:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Search products
productsRouter.get('/products/search/query', async (c) => {
  try {
    if (!supabase) {
      return c.json([]);
    }

    const query = c.req.query('q') || '';
    const category = c.req.query('category');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    
    let dbQuery = supabase.from('products').select('*');
    
    // Text search on name and description
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }
    
    // Category filter
    if (category && category !== 'all') {
      dbQuery = dbQuery.eq('category', category);
    }
    
    // Price range filter
    if (minPrice) {
      dbQuery = dbQuery.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      dbQuery = dbQuery.lte('price', parseFloat(maxPrice));
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      // Silently handle "table not found" errors
      if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message?.includes('Could not find')) {
        return c.json([]);
      }
      console.error('Error searching products:', error);
      return c.json([]);
    }
    
    // Transform to match frontend Product type
    const products = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      image: p.image_url,
      category: p.category,
      rating: parseFloat(p.rating || 0),
      reviewCount: p.review_count || 0,
    }));
    
    return c.json(products);
  } catch (error) {
    return c.json([]);
  }
});

// Get products by category
productsRouter.get('/products/category/:category', async (c) => {
  try {
    if (!supabase) {
      return c.json([]);
    }

    const category = c.req.param('category');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      // Silently handle "table not found" errors
      if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message?.includes('Could not find')) {
        return c.json([]);
      }
      console.error('Error fetching products by category:', error);
      return c.json([]);
    }
    
    // Transform to match frontend Product type
    const products = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      image: p.image_url,
      category: p.category,
      rating: parseFloat(p.rating || 0),
      reviewCount: p.review_count || 0,
    }));
    
    return c.json(products);
  } catch (error) {
    return c.json([]);
  }
});