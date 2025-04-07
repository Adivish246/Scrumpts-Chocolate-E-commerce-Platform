import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { AIChat } from "@/components/AIChat";
import { CartSummary, formatPrice } from "@/lib/types";

const OrderConfirmationPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { cartSummary } = useCart();
  const [orderSummary, setOrderSummary] = useState<CartSummary | null>(null);

  // Set page title and save order summary
  useEffect(() => {
    document.title = "Order Confirmation - Scrumpts";
    
    // Save the cart summary before it gets cleared
    if (!orderSummary && cartSummary.total.raw > 0) {
      setOrderSummary(cartSummary);
    }
  }, [cartSummary, orderSummary]);

  // Generate a random order number
  const orderNumber = `SCR-${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 pb-8 px-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))]">
                  Thank You!
                </h1>
                
                <p className="text-lg text-gray-700 mb-2">
                  Your order has been placed successfully.
                </p>
                
                <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 my-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order Number:</span>
                    <span className="font-bold text-[hsl(var(--chocolate-medium))]">{orderNumber}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="font-medium">Order Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{orderSummary ? orderSummary.subtotal.formatted : cartSummary.subtotal.formatted}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{orderSummary ? orderSummary.shipping.formatted : cartSummary.shipping.formatted}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax (18% GST):</span>
                      <span>{orderSummary ? orderSummary.tax.formatted : cartSummary.tax.formatted}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="font-medium text-lg">Order Total:</span>
                    <span className="font-bold text-lg">{orderSummary ? orderSummary.total.formatted : cartSummary.total.formatted}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  We've sent a confirmation email with the order details to your registered email address.
                  Your delicious chocolates will be on their way soon!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/orders")}
                  >
                    View Orders
                  </Button>
                  
                  <Button 
                    className="w-full bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white"
                    onClick={() => navigate("/shop")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <AIChat />
    </div>
  );
};

export default OrderConfirmationPage;