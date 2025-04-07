import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Mail, 
  Instagram, 
  CreditCard, 
  Send 
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[hsl(var(--chocolate-dark))] text-white py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="mb-12 max-w-lg mx-auto text-center">
          <h3 className="font-display text-2xl font-bold mb-4">Join Our Chocolate Club</h3>
          <p className="text-gray-300 mb-6">
            Subscribe to receive exclusive offers, new product announcements, and chocolate inspiration.
          </p>
          <div className="flex">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="rounded-l-md rounded-r-none border-gray-700 focus:border-[hsl(var(--chocolate-accent))] bg-gray-800"
            />
            <Button 
              className="rounded-l-none bg-[hsl(var(--chocolate-accent))] hover:bg-opacity-90 text-[hsl(var(--chocolate-dark))] font-semibold"
            >
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Scrumpts</h3>
            <p className="text-gray-300 mb-4">
              Handcrafted luxury chocolates with AI-powered personalization for an extraordinary chocolate experience.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white">
                  All Chocolates
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white">
                  Gift Boxes
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="text-gray-300 hover:text-white">
                  Corporate Gifts
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-gray-300 hover:text-white">
                  Chocolate Making
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-300 hover:text-white">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Scrumpts. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <CreditCard className="h-6 w-auto text-gray-400" />
            <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-visa">
              <title id="pi-visa">Visa</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
              <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
            </svg>
            <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-mastercard">
              <title id="pi-mastercard">Mastercard</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
              <circle fill="#EB001B" cx="15" cy="12" r="7"/>
              <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
              <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-upi">
              <title id="pi-upi">UPI</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
              <path d="M8.97 14.354c-.35-.303-.616-.65-.796-1.04-.18-.39-.27-.824-.27-1.304 0-.654.18-1.265.54-1.835.36-.57.86-1.06 1.5-1.47.64-.41 1.375-.736 2.205-.976.83-.24 1.71-.36 2.64-.36l-.03-4.655c.01 0 .02-.178.19-.178h2.54c.17.003.33.08.46.216.13.136.2.308.2.492v13.77c0 .188-.77.365-.23.502-.152.137-.348.208-.55.198h-2.55c-.356 0-.534-.268-.534-.7v-.572c-.19.147-.41.296-.66.444s-.53.28-.83.4c-.3.12-.622.213-.967.283s-.695.107-1.05.107c-.935 0-1.748-.187-2.438-.56-.69-.373-1.232-.873-1.626-1.499 0-.004 0-.008.003-.01zm5.87-1.206c.2-.158.385-.283.553-.376.168-.092.342-.156.522-.19v-3.33c-.307.004-.61.037-.91.1-.3.063-.575.16-.827.292-.252.13-.465.294-.64.488-.173.195-.26.43-.26.703 0 .29.062.544.186.762.124.217.29.396.498.537.208.142.444.25.71.327.265.074.543.11.833.11.106 0 .215-.01.325-.034.11-.023.226-.07.35-.143-.16.126-.27.212-.33.257-.06.045-.06.045 0 0l.023-.02-.03.02c-.026-.015 0 0 0 0zm7.56 1.7l5.398-7.656v-.23H23.86l-3.78 5.74h-.05V4.88c0-.19.073-.368.207-.505.134-.136.315-.213.504-.216h2.626c0 .013-.04.184.18.178l-.026 4.655c.93 0 1.81.12 2.64.36.83.24 1.566.565 2.205.975.64.41 1.14.9 1.5 1.47.36.57.54 1.18.54 1.835 0 .48-.09.916-.27 1.306-.18.39-.446.736-.796 1.038-.35.303-.765.535-1.245.7-.48.164-1.01.245-1.59.245-.354 0-.698-.035-1.03-.107-.333-.07-.656-.164-.967-.283-.31-.12-.584-.25-.83-.4s-.465-.296-.66-.444v.572c0 .432-.177.7-.533.7h-2.548c-.203.01-.4-.06-.552-.198-.152-.136-.23-.314-.23-.5V4.87c0-.184.07-.356.2-.492.128-.137.29-.213.46-.216h2.54c.204-.006.4.063.55.198.15.135.23.313.23.5v8.954h.05l3.933-5.846h3.267l-5.338 7.638 5.726 8.018h-3.477L22.4 17.57v3.444c0 .187-.077.365-.23.5-.15.137-.347.21-.55.2h-2.54c-.17.01-.332-.063-.46-.2-.13-.135-.2-.313-.2-.5V8.847l.03 6.002z" fill="#097339"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};
