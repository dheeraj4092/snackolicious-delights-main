import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCart from "@/components/ui/FloatingCart";
import ProductCard from "@/components/ui/ProductCard";

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    category: categoryParam || "all",
    availability: "all",
    sortBy: "newest"
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Apply filters whenever activeFilters change
  useEffect(() => {
    let filteredProducts = [...products];
    
    // Filter by category
    if (activeFilters.category !== "all") {
      filteredProducts = filteredProducts.filter(
        product => product.category === activeFilters.category
      );
    }
    
    // Filter by availability
    if (activeFilters.availability === "available") {
      filteredProducts = filteredProducts.filter(product => product.stock_quantity > 0);
    } else if (activeFilters.availability === "preorder") {
      filteredProducts = filteredProducts.filter(product => product.stock_quantity === 0);
    }
    
    // Sort products
    if (activeFilters.sortBy === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (activeFilters.sortBy === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (activeFilters.sortBy === "newest") {
      filteredProducts.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    setProducts(filteredProducts);
  }, [activeFilters]);
  
  const updateFilter = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error loading products</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters */}
          <div className="lg:w-64 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden flex items-center"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                  {mobileFiltersOpen ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Hide Filters
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Show Filters
                    </>
                  )}
                </Button>
              </div>
              
              <div className={`lg:block ${mobileFiltersOpen ? 'block bg-white/95 backdrop-blur-sm lg:bg-transparent fixed inset-0 top-[60px] z-40 p-6 lg:p-0 overflow-y-auto' : 'hidden'}`}>
                <div className="space-y-6 max-w-sm mx-auto lg:max-w-none">
                  <div>
                    <h3 className="font-medium mb-3">Category</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="all"
                          checked={activeFilters.category === "all"}
                          onCheckedChange={() => updateFilter("category", "all")}
                        />
                        <label htmlFor="all" className="ml-2">All Products</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="snacks"
                          checked={activeFilters.category === "snacks"}
                          onCheckedChange={() => updateFilter("category", "snacks")}
                        />
                        <label htmlFor="snacks" className="ml-2">Traditional Snacks</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="fresh"
                          checked={activeFilters.category === "fresh"}
                          onCheckedChange={() => updateFilter("category", "fresh")}
                        />
                        <label htmlFor="fresh" className="ml-2">Fresh Foods</label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="all-availability"
                          checked={activeFilters.availability === "all"}
                          onCheckedChange={() => updateFilter("availability", "all")}
                        />
                        <label htmlFor="all-availability" className="ml-2">All</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="available"
                          checked={activeFilters.availability === "available"}
                          onCheckedChange={() => updateFilter("availability", "available")}
                        />
                        <label htmlFor="available" className="ml-2">In Stock</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="preorder"
                          checked={activeFilters.availability === "preorder"}
                          onCheckedChange={() => updateFilter("availability", "preorder")}
                        />
                        <label htmlFor="preorder" className="ml-2">Pre-order</label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <div className="flex flex-wrap">
                      <Button
                        variant={activeFilters.sortBy === "newest" ? "default" : "outline"}
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => updateFilter("sortBy", "newest")}
                      >
                        Newest
                      </Button>
                      <Button
                        variant={activeFilters.sortBy === "price-low" ? "default" : "outline"}
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => updateFilter("sortBy", "price-low")}
                      >
                        Price: Low to High
                      </Button>
                      <Button
                        variant={activeFilters.sortBy === "price-high" ? "default" : "outline"}
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => updateFilter("sortBy", "price-high")}
                      >
                        Price: High to Low
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-medium">
                {activeFilters.category === "all" 
                  ? "All Products" 
                  : activeFilters.category === "snacks"
                    ? "Traditional Snacks"
                    : "Fresh Foods"}
              </h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{products.length} products</span>
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.id}`}
                    className="block transform transition-transform hover:scale-[1.02]"
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      isAvailable={product.stock_quantity > 0}
                      isPreOrder={product.stock_quantity === 0}
                      deliveryEstimate={product.delivery_estimate}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default ProductsPage;
