import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIChat } from "@/components/AIChat";
import { useProductDetail } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ChevronLeft, 
  Clock, 
  Weight, 
  Salad, 
  ThumbsUp,
  Share2
} from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { fadeIn, slideInLeft, slideInRight, slideUp, staggerItems, staggeredItem } from "@/lib/animations";

const ProductPage: React.FC = () => {
  const [, params] = useRoute("/product/:id");
  const productId = params ? parseInt(params.id, 10) : 0;
  const { product, isLoading, error } = useProductDetail(productId);
  const { featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts();
  const { addItemToCart, isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Scrumpts`;
    } else {
      document.title = "Product Details - Scrumpts";
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product.id, quantity);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center text-sm">
              <Link href="/">
                <a className="text-gray-500 hover:text-gray-700">Home</a>
              </Link>
              <ChevronLeft className="mx-2 h-4 w-4 text-gray-400 rotate-180" />
              <Link href="/shop">
                <a className="text-gray-500 hover:text-gray-700">Shop</a>
              </Link>
              <ChevronLeft className="mx-2 h-4 w-4 text-gray-400 rotate-180" />
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="text-gray-900">{product?.name || "Product"}</span>
              )}
            </nav>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[400px] md:h-[600px]">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-6">
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          ) : error ? (
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold text-red-600 mb-2">Error Loading Product</h2>
                <p className="text-gray-600">We couldn't load the product information. Please try again later.</p>
                <Link href="/shop">
                  <Button className="mt-4">Return to Shop</Button>
                </Link>
              </div>
            </Card>
          ) : product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image with animation */}
              <motion.div 
                className="bg-white rounded-lg overflow-hidden shadow-md"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideInLeft}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-[400px] md:h-[600px] object-cover"
                />
              </motion.div>

              {/* Product Details with staggered animations */}
              <motion.div 
                className="space-y-6"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={staggerItems}
              >
                <motion.div variants={staggeredItem}>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-[hsl(var(--chocolate-accent))] mr-2">
                      <Star className="fill-current h-5 w-5" />
                      <span className="ml-1 font-medium">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    {product.bestseller && (
                      <span className="bg-[hsl(var(--chocolate-accent))] text-white text-xs font-bold px-2 py-1 rounded">
                        BESTSELLER
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-semibold mb-4">
                    {formatPrice(product.price).formatted}
                  </p>
                  <p className="text-gray-700 mb-6">
                    {product.description}
                  </p>
                </motion.div>

                {/* Product Attributes */}
                <motion.div variants={staggeredItem} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="bg-[hsl(var(--muted))] p-2 rounded mr-2">
                      <Weight className="h-4 w-4 text-[hsl(var(--chocolate-medium))]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-sm font-medium">{product.weightGrams}g</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-[hsl(var(--muted))] p-2 rounded mr-2">
                      <Clock className="h-4 w-4 text-[hsl(var(--chocolate-medium))]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shelf Life</p>
                      <p className="text-sm font-medium">{product.shelfLife}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-[hsl(var(--muted))] p-2 rounded mr-2">
                      <Salad className="h-4 w-4 text-[hsl(var(--chocolate-medium))]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Diet</p>
                      <p className="text-sm font-medium">{product.vegetarian ? "Vegetarian" : "Non-Vegetarian"}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Type and Flavors */}
                <motion.div variants={staggeredItem}>
                  <div className="flex items-center mb-2">
                    <p className="text-sm font-medium text-gray-500 mr-2">Type:</p>
                    <span className="bg-[hsl(var(--muted))] text-[hsl(var(--chocolate-medium))] text-sm px-3 py-1 rounded-full">
                      {product.type}
                    </span>
                  </div>
                  {product.flavors && (
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-500 mr-2">Flavors:</p>
                      <span className="bg-[hsl(var(--muted))] text-[hsl(var(--chocolate-medium))] text-sm px-3 py-1 rounded-full">
                        {product.flavors}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Add to Cart */}
                <motion.div variants={staggeredItem} className="pt-6 border-t">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center border border-gray-300 rounded-md mr-4">
                      <button 
                        onClick={decrementQuantity}
                        className="px-3 py-1 text-xl"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                      <button 
                        onClick={incrementQuantity}
                        className="px-3 py-1 text-xl"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white flex-grow h-12"
                      disabled={isAddingToCart[product.id]}
                    >
                      {isAddingToCart[product.id] ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Add to Cart
                        </span>
                      )}
                    </Button>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="flex-1">
                      <Heart className="mr-2 h-5 w-5" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="mr-2 h-5 w-5" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : null}

          {/* Product Details Tabs */}
          {product && (
            <motion.div 
              className="mt-12"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
            >
              <Tabs defaultValue="ingredients">
                <TabsList className="w-full justify-start border-b mb-6 pb-0">
                  <TabsTrigger value="ingredients" className="text-base">Ingredients</TabsTrigger>
                  <TabsTrigger value="tasting-notes" className="text-base">Tasting Notes</TabsTrigger>
                  <TabsTrigger value="nutrition" className="text-base">Nutrition</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients" className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-display text-xl font-semibold mb-4">Ingredients</h3>
                      <p className="text-gray-700">{product.ingredients || "Premium ingredients carefully selected by our master chocolatiers. Our chocolates are made with high-quality cocoa beans, fresh cream, butter, and natural flavors."}</p>
                      
                      {product.vegetarian && (
                        <div className="flex items-center mt-4 text-green-600">
                          <ThumbsUp className="h-5 w-5 mr-2" />
                          <span>Suitable for vegetarians</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tasting-notes" className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-display text-xl font-semibold mb-4">Tasting Notes</h3>
                      <p className="text-gray-700">
                        {product.type === 'Dark' ? 
                          "Rich and intense with subtle fruity notes and a smooth finish. The complexity of flavors develops as it melts in your mouth, revealing layers of depth and character." :
                          product.type === 'Milk' ?
                          "Creamy and sweet with caramel undertones and a velvety smooth texture. The balanced sweetness complements the cocoa notes perfectly." :
                          "Delicate and sweet with subtle vanilla notes and a creamy mouthfeel. The smooth, buttery texture melts effortlessly."}
                      </p>
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Pairs well with:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(product.type === 'Dark' ? 
                            ["Red Wine", "Coffee", "Berries"] : 
                            product.type === 'Milk' ? 
                            ["Coffee", "Caramel", "Nuts"] : 
                            ["Champagne", "Fruits", "Tea"]).map(pair => (
                            <span key={pair} className="bg-[hsl(var(--muted))] text-[hsl(var(--chocolate-medium))] text-sm px-3 py-1 rounded-full">
                              {pair}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="nutrition" className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-display text-xl font-semibold mb-4">Nutrition Information</h3>
                      <p className="text-sm text-gray-500 mb-4">Values per 100g</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border p-3 rounded-md text-center">
                          <p className="text-lg font-semibold">530</p>
                          <p className="text-xs text-gray-500">Calories (kcal)</p>
                        </div>
                        <div className="border p-3 rounded-md text-center">
                          <p className="text-lg font-semibold">31g</p>
                          <p className="text-xs text-gray-500">Fats</p>
                        </div>
                        <div className="border p-3 rounded-md text-center">
                          <p className="text-lg font-semibold">58g</p>
                          <p className="text-xs text-gray-500">Carbohydrates</p>
                        </div>
                        <div className="border p-3 rounded-md text-center">
                          <p className="text-lg font-semibold">5g</p>
                          <p className="text-xs text-gray-500">Protein</p>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-500">
                        Allergen Information: Contains milk and soy. May contain traces of nuts.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* You May Also Like */}
          <motion.div 
            className="mt-16"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideUp}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--chocolate-dark))] mb-6">
              You May Also Like
            </h2>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={staggerItems}
            >
              {isLoadingFeatured ? (
                Array(4).fill(0).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                    variants={staggeredItem}
                  >
                    <Skeleton className="h-64 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-8 w-1/3" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                featuredProducts
                  .filter(p => p.id !== productId)
                  .slice(0, 4)
                  .map(product => (
                    <motion.div key={product.id} variants={staggeredItem}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <AIChat />
    </div>
  );
};

export default ProductPage;