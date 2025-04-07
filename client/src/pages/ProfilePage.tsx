import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIChat } from "@/components/AIChat";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, Package, Heart, ShoppingBag, Settings, LogOut, AlertCircle, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserPreferences } from "@/lib/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteTypes: [],
    dietaryRestrictions: [],
    flavorPreferences: [],
    occasions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{open: boolean; title: string; message: string}>({
    open: false,
    title: '',
    message: ''
  });
  
  // Determine active tab based on URL path
  const getActiveTab = () => {
    if (location.includes('/orders')) return 'orders';
    if (location.includes('/wishlist')) return 'wishlist';
    if (location.includes('/subscriptions')) return 'subscriptions';
    if (location.includes('/settings')) return 'settings';
    return 'preferences'; // default tab
  };

  // Set page title
  useEffect(() => {
    document.title = "My Profile - Scrumpts";
  }, []);

  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user?.uid) {
        try {
          const response = await apiRequest('GET', `/api/users/${user.uid}`);
          
          if (!response.ok) {
            throw new Error(`Failed to load profile data: ${response.status} ${response.statusText}`);
          }
          
          const userData = await response.json();
          
          if (userData.preferences) {
            setPreferences(userData.preferences);
          }
        } catch (error) {
          console.error("Error loading user preferences:", error);
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to load your profile data. Please try again later.';
            
          setErrorDialog({
            open: true,
            title: 'Profile Error',
            message: errorMessage
          });
        }
      }
    };
    
    loadUserPreferences();
  }, [user]);

  // Save preferences
  const savePreferences = async () => {
    if (!user?.uid) {
      setErrorDialog({
        open: true,
        title: 'Authentication Error',
        message: 'You need to be logged in to save preferences. Please refresh the page and try again.'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiRequest('PATCH', `/api/users/${user.uid}/preferences`, {
        preferences
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.status} ${response.statusText}`);
      }
      
      toast({
        title: "Preferences Saved",
        description: "Your chocolate preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save your preferences. Please try again later.';
        
      setErrorDialog({
        open: true,
        title: 'Save Error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preference changes
  const toggleType = (type: string) => {
    setPreferences(prev => {
      const types = prev.favoriteTypes.includes(type)
        ? prev.favoriteTypes.filter(t => t !== type)
        : [...prev.favoriteTypes, type];
      
      return { ...prev, favoriteTypes: types };
    });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences(prev => {
      const restrictions = prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction];
      
      return { ...prev, dietaryRestrictions: restrictions };
    });
  };

  const toggleFlavor = (flavor: string) => {
    setPreferences(prev => {
      const flavors = prev.flavorPreferences.includes(flavor)
        ? prev.flavorPreferences.filter(f => f !== flavor)
        : [...prev.flavorPreferences, flavor];
      
      return { ...prev, flavorPreferences: flavors };
    });
  };

  const toggleOccasion = (occasion: string) => {
    setPreferences(prev => {
      const occasions = prev.occasions.includes(occasion)
        ? prev.occasions.filter(o => o !== occasion)
        : [...prev.occasions, occasion];
      
      return { ...prev, occasions };
    });
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-6">
            My Profile
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left sidebar - Navigation */}
            <div className="md:w-1/4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center mb-6 pt-4">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || "User"}
                        className="w-20 h-20 rounded-full mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[hsl(var(--chocolate-medium))] flex items-center justify-center text-white text-2xl mb-3">
                        {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                      </div>
                    )}
                    <h2 className="text-lg font-semibold">
                      {user?.displayName || user?.email}
                    </h2>
                  </div>

                  <nav className="space-y-2">
                    <Link href="/profile">
                      <Button 
                        variant={!location.includes('/profile/') ? "default" : "ghost"} 
                        className="w-full justify-start"
                      >
                        <UserCircle className="mr-2 h-5 w-5" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/profile/orders">
                      <Button 
                        variant={location.includes('/profile/orders') ? "default" : "ghost"} 
                        className="w-full justify-start"
                      >
                        <Package className="mr-2 h-5 w-5" />
                        Orders
                      </Button>
                    </Link>
                    <Link href="/profile/wishlist">
                      <Button 
                        variant={location.includes('/profile/wishlist') ? "default" : "ghost"} 
                        className="w-full justify-start"
                      >
                        <Heart className="mr-2 h-5 w-5" />
                        Wishlist
                      </Button>
                    </Link>
                    <Link href="/profile/subscriptions">
                      <Button 
                        variant={location.includes('/profile/subscriptions') ? "default" : "ghost"} 
                        className="w-full justify-start"
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Subscriptions
                      </Button>
                    </Link>
                    <Link href="/profile/settings">
                      <Button 
                        variant={location.includes('/profile/settings') ? "default" : "ghost"} 
                        className="w-full justify-start"
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        Settings
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Right content - Tabs */}
            <div className="md:w-3/4">
              <Tabs defaultValue={getActiveTab()}>
                <TabsList className="mb-6">
                  <TabsTrigger 
                    value="preferences" 
                    onClick={() => {
                      const url = "/profile";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Chocolate Preferences
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    onClick={() => {
                      const url = "/profile";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Account Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    onClick={() => {
                      const url = "/profile/orders";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Order History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="wishlist" 
                    onClick={() => {
                      const url = "/profile/wishlist";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subscriptions" 
                    onClick={() => {
                      const url = "/profile/subscriptions";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Subscriptions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    onClick={() => {
                      const url = "/profile/settings";
                      if (location !== url) window.history.pushState(null, "", url);
                    }}
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chocolate Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Favorite Chocolate Types</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Dark', 'Milk', 'White', 'Ruby', 'Bittersweet', 'Semisweet'].map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`type-${type}`} 
                                checked={preferences.favoriteTypes.includes(type)}
                                onCheckedChange={() => toggleType(type)}
                              />
                              <Label htmlFor={`type-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Dietary Preferences</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Vegan', 'Vegetarian', 'Gluten-Free', 'Sugar-Free', 'Organic', 'Fair Trade'].map(diet => (
                            <div key={diet} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`diet-${diet}`} 
                                checked={preferences.dietaryRestrictions.includes(diet)}
                                onCheckedChange={() => toggleDietaryRestriction(diet)}
                              />
                              <Label htmlFor={`diet-${diet}`}>{diet}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Flavor Preferences</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Nutty', 'Fruity', 'Caramel', 'Spicy', 'Mint', 'Coffee', 'Floral', 'Vanilla'].map(flavor => (
                            <div key={flavor} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`flavor-${flavor}`} 
                                checked={preferences.flavorPreferences.includes(flavor)}
                                onCheckedChange={() => toggleFlavor(flavor)}
                              />
                              <Label htmlFor={`flavor-${flavor}`}>{flavor}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Occasions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Everyday', 'Gifts', 'Celebrations', 'Self-Care', 'Holiday', 'Special Events'].map(occasion => (
                            <div key={occasion} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`occasion-${occasion}`} 
                                checked={preferences.occasions.includes(occasion)}
                                onCheckedChange={() => toggleOccasion(occasion)}
                              />
                              <Label htmlFor={`occasion-${occasion}`}>{occasion}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="receive-recommendations" className="block mb-1">AI Recommendations</Label>
                              <p className="text-sm text-gray-500">Receive personalized chocolate recommendations</p>
                            </div>
                            <Switch id="receive-recommendations" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="new-collections" className="block mb-1">New Collections</Label>
                              <p className="text-sm text-gray-500">Be the first to know about new chocolates</p>
                            </div>
                            <Switch id="new-collections" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="exclusive-offers" className="block mb-1">Exclusive Offers</Label>
                              <p className="text-sm text-gray-500">Receive exclusive deals and promotions</p>
                            </div>
                            <Switch id="exclusive-offers" />
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={savePreferences} 
                        className="bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] w-full md:w-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Account Tab */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Details</CardTitle>
                      <CardDescription>
                        Manage your account information and connected services
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Error handling when user data isn't properly loaded */}
                      {!user?.uid && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Authentication Error</AlertTitle>
                          <AlertDescription>
                            There was a problem accessing your account information. Please try logging out and back in.
                          </AlertDescription>
                        </Alert>
                      )}
                    
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="display-name" className="block mb-1">Display Name</Label>
                          <Input 
                            id="display-name" 
                            value={user?.displayName || ''} 
                            placeholder="Your name" 
                            disabled={!user?.uid || user?.providerData[0]?.providerId !== 'password'}
                          />
                          {user?.uid && user?.providerData[0]?.providerId !== 'password' && (
                            <p className="text-xs text-gray-500 mt-1">
                              Managed by your {user?.providerData[0]?.providerId} account
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="block mb-1">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={user?.email || ''} 
                            disabled 
                          />
                        </div>
                        
                        {user?.uid && user?.providerData[0]?.providerId === 'password' && (
                          <div>
                            <Label htmlFor="password" className="block mb-1">Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              value="••••••••" 
                              disabled 
                            />
                            <Button variant="link" className="px-0 mt-1 h-auto">
                              Change Password
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-3">Connected Accounts</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-[#4285F4] text-white rounded-full p-2 mr-3">
                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Google</p>
                                <p className="text-sm text-gray-500">
                                  {user?.providerData.some(p => p.providerId === 'google.com') 
                                    ? 'Connected' 
                                    : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              {user?.providerData.some(p => p.providerId === 'google.com') 
                                ? 'Disconnect' 
                                : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-[#1877F2] text-white rounded-full p-2 mr-3">
                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Facebook</p>
                                <p className="text-sm text-gray-500">
                                  {user?.providerData.some(p => p.providerId === 'facebook.com') 
                                    ? 'Connected' 
                                    : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              {user?.providerData.some(p => p.providerId === 'facebook.com') 
                                ? 'Disconnect' 
                                : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-3">Danger Zone</h3>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-4">
                          Looks like you haven't placed any orders with us yet.
                        </p>
                        <Button 
                          className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))]"
                          onClick={() => window.location.href = '/shop'}
                        >
                          Start Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Wishlist Tab */}
                <TabsContent value="wishlist">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-4">
                          Save your favorite chocolates for later by adding them to your wishlist.
                        </p>
                        <Button 
                          className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))]"
                          onClick={() => window.location.href = '/shop'}
                        >
                          Explore Chocolates
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Subscriptions</CardTitle>
                      <CardDescription>
                        Manage your chocolate subscription boxes and deliveries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-2">No active subscriptions</h3>
                        <p className="text-gray-500 mb-4">
                          Subscribe to receive handcrafted chocolates delivered to your door monthly.
                        </p>
                        <Button className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))]">
                          Explore Subscription Plans
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your notification preferences and account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing-emails" className="block mb-1">Marketing Emails</Label>
                            <p className="text-sm text-gray-500">Receive emails about new products and promotions</p>
                          </div>
                          <Switch id="marketing-emails" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="order-updates" className="block mb-1">Order Updates</Label>
                            <p className="text-sm text-gray-500">Get notified about your order status</p>
                          </div>
                          <Switch id="order-updates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="event-invites" className="block mb-1">Event Invites</Label>
                            <p className="text-sm text-gray-500">Receive invites to chocolate tasting events</p>
                          </div>
                          <Switch id="event-invites" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t space-y-4">
                        <h3 className="text-lg font-medium">Privacy Settings</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="data-collection" className="block mb-1">Data Collection</Label>
                            <p className="text-sm text-gray-500">Allow us to collect usage data to improve services</p>
                          </div>
                          <Switch id="data-collection" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="personalized-ads" className="block mb-1">Personalized Ads</Label>
                            <p className="text-sm text-gray-500">Allow us to show you personalized ads</p>
                          </div>
                          <Switch id="personalized-ads" />
                        </div>
                      </div>
                      
                      <Button 
                        className="bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] w-full md:w-auto mt-4"
                      >
                        Save Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AIChat />
      
      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {errorDialog.title}
            </DialogTitle>
            <DialogDescription>
              {errorDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => setErrorDialog(prev => ({ ...prev, open: false }))}
              className="bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))]"
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
