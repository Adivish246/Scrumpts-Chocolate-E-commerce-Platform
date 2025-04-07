import React, { useEffect } from "react";
import { useRoute, Redirect } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModals } from "@/components/AuthModals";
import { useAuth } from "@/hooks/useAuth";

const AuthPage: React.FC = () => {
  const [, params] = useRoute("/auth/:type");
  const type = params?.type as 'login' | 'signup';
  const { isAuthenticated } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = type === 'login' ? "Sign In - Scrumpts" : "Create Account - Scrumpts";
  }, [type]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="p-0">
              <AuthModals
                isOpen={true}
                type={type}
                onClose={() => {}}
                onSwitch={() => {}}
                standalone={true}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
