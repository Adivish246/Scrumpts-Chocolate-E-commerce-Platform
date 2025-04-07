import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import ShopPage from "@/pages/ShopPage";
import CollectionsPage from "@/pages/CollectionsPage";
import AboutPage from "@/pages/AboutPage";
import LearnPage from "@/pages/LearnPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import { PageTransition } from "@/components/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import { getAuth, getRedirectResult } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { AIChat } from "@/components/AIChat";

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/order-confirmation" component={OrderConfirmationPage} />
        <Route path="/auth/:type" component={AuthPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/profile/orders" component={ProfilePage} />
        <Route path="/profile/wishlist" component={ProfilePage} />
        <Route path="/profile/subscriptions" component={ProfilePage} />
        <Route path="/profile/settings" component={ProfilePage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/collections" component={CollectionsPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/learn" component={LearnPage} />
        {/* Redirect shortcut routes to profile sections */}
        <Route path="/orders">
          {() => {
            window.location.href = '/profile/orders';
            return null;
          }}
        </Route>
        <Route path="/wishlist">
          {() => {
            window.location.href = '/profile/wishlist';
            return null;
          }}
        </Route>
        <Route path="/settings">
          {() => {
            window.location.href = '/profile/settings';
            return null;
          }}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  const { toast } = useToast();
  
  // Handle Firebase redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth();
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          // User successfully signed in with redirect
          toast({
            title: "Welcome!",
            description: `You're now signed in as ${result.user.displayName || result.user.email}`,
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    };
    
    handleRedirectResult();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <AIChat floatingAnimation={true} />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
