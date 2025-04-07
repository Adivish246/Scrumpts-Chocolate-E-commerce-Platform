import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthModals } from "@/components/AuthModals";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  UndoDot,
  CreditCard,
  QrCode,
  Shield
} from "lucide-react";
import { useState } from "react";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatPrice } from "@/lib/types";

export const ShoppingCart: React.FC = () => {
  const { cartItems, cartSummary, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [location, navigate] = useLocation();

  const handleUpdateQuantity = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setAuthType('login');
      setIsAuthModalOpen(true);
      return;
    }
    
    try {
      // In a real implementation, we would process the payment first
      // For now, clear the cart and navigate to confirmation
      await clearCart();
      
      // Navigate to confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full max-w-sm ml-auto" />
        </div>
      ) : cartItems.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Looks like you haven't added any chocolates to your cart yet. Explore our collection to find your perfect treat.
            </p>
            <Link href="/shop">
              <Button className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white px-8">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart ({cartSummary.itemCount} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-20 h-20 overflow-hidden rounded-md">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/product/${item.productId}`}>
                            <a className="font-medium hover:text-[hsl(var(--chocolate-medium))]">
                              {item.name}
                            </a>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.price.formatted}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(item.price.raw * item.quantity).formatted}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/shop')}>
                  <UndoDot className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{cartSummary.subtotal.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{cartSummary.shipping.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium">{cartSummary.tax.formatted}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{cartSummary.total.formatted}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">Payment Methods</h4>
                  <Tabs defaultValue="upi">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upi">UPI</TabsTrigger>
                      <TabsTrigger value="card">Card</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upi" className="mt-4">
                      <div className="flex items-center justify-center bg-white p-8 border rounded-md">
                        <div className="text-center">
                          <QrCode className="h-32 w-32 mx-auto mb-4" />
                          <p className="text-sm text-gray-500">
                            Scan with any UPI app to pay
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="card" className="mt-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm">Card Number</label>
                          <div className="flex border rounded-md overflow-hidden">
                            <input 
                              type="text" 
                              className="flex-1 px-3 py-2 outline-none" 
                              placeholder="1234 5678 9012 3456" 
                            />
                            <div className="px-3 flex items-center bg-gray-50">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm">Expiry Date</label>
                            <input 
                              type="text" 
                              className="w-full border rounded-md px-3 py-2" 
                              placeholder="MM/YY" 
                            />
                          </div>
                          <div>
                            <label className="text-sm">CVV</label>
                            <input 
                              type="text" 
                              className="w-full border rounded-md px-3 py-2" 
                              placeholder="123" 
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white"
                  onClick={handleCheckout}
                >
                  Pay Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center text-xs text-gray-500 gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout. Your data is protected.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModals
        isOpen={isAuthModalOpen}
        type={authType}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitch={(type) => setAuthType(type)}
      />
    </>
  );
};
