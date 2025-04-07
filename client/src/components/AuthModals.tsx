import React, { useState } from "react";
import { X, User, Mail, Facebook, Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation } from "wouter";

interface AuthModalsProps {
  isOpen: boolean;
  type: 'login' | 'signup';
  onClose: () => void;
  onSwitch: (type: 'login' | 'signup') => void;
  standalone?: boolean;
}

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export const AuthModals: React.FC<AuthModalsProps> = ({ 
  isOpen, 
  type, 
  onClose, 
  onSwitch,
  standalone = false 
}) => {
  const { login, signup, loginWithGoogle, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
    if (!standalone) onClose();
    else navigate("/");
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    await signup(data.email, data.password, data.name);
    if (!standalone) onClose();
    else navigate("/");
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // No need to close modal as it will redirect
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchAuthType = () => {
    const newType = type === 'login' ? 'signup' : 'login';
    onSwitch(newType);
    
    if (standalone) {
      navigate(`/auth/${newType}`);
    }
  };

  const modalContent = (
    <div className="p-6 w-full">
      {/* Header */}
      {!standalone && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl font-bold text-[hsl(var(--chocolate-dark))]">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {standalone && (
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl font-bold text-[hsl(var(--chocolate-dark))]">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <p className="text-gray-500 mt-2">
            {type === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create an account to get started'}
          </p>
        </div>
      )}

      {/* Login Form */}
      {type === 'login' && (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="your.email@example.com"
                        type="email"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pl-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-gray-400"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] text-white font-semibold py-3 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      )}

      {/* Signup Form */}
      {type === 'signup' && (
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="John Doe"
                        type="text"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="your.email@example.com"
                        type="email"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pl-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-gray-400"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] text-white font-semibold py-3 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      )}

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-gray-300 absolute w-full"></div>
        <span className="bg-white px-2 relative text-sm text-gray-500">
          {type === 'login' ? "or sign in with" : "or sign up with"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-center h-12"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </div>

      <div className="text-center text-sm mt-6">
        <span className="text-gray-600">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
        </span>
        <Button
          variant="link"
          className="text-[hsl(var(--chocolate-accent))] font-medium hover:underline px-2 h-auto"
          onClick={switchAuthType}
          disabled={loading}
        >
          {type === 'login' ? "Sign Up" : "Sign In"}
        </Button>
      </div>
    </div>
  );

  return standalone ? (
    modalContent
  ) : (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 sm:max-w-md">{modalContent}</DialogContent>
    </Dialog>
  );
};
