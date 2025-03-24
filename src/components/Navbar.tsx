
import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, X, ShoppingCart } from 'lucide-react';
import CartModal from './CartModal';

// Define CartItem type for global access
declare global {
  interface Window {
    addToCart: (item: {
      id: string;
      name: string;
      price: number;
      quantity?: number;
      image: string;
    }) => void;
  }
}

interface NavLinkProps {
  to: string;
  text: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, text }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors hover:text-towel-blue ${
        isActive ? 'text-towel-blue' : 'text-foreground'
      }`
    }
  >
    {text}
  </RouterNavLink>
);

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    
    // Create global addToCart function
    window.addToCart = (item) => {
      addToCart(item);
    };
    
    // Clean up on unmount
    return () => {
      delete window.addToCart;
    };
  }, []);
  
  // Add item to cart
  const addToCart = (item: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
  }) => {
    const newItem = {
      ...item,
      quantity: item.quantity || 1
    };
    
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === newItem.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...prevItems, newItem];
      }
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-towel-blue mr-8">DTex</Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" text="Home" />
            {!isAdmin && (
              <NavLink to="/custom-request" text="Custom Design" />
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:block text-sm font-medium text-foreground">
                {user.name || user.email}
              </span>
              
              {!isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-towel-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={logout} className="hidden md:block">
                Logout
              </Button>
              
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-sm">
                  <SheetHeader className="text-left">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through the app
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <NavLink to="/" text="Home" />
                    {!isAdmin && (
                      <NavLink to="/custom-request" text="Custom Design" />
                    )}
                    <Button variant="outline" size="sm" onClick={logout} className="w-full mt-4">
                      Logout
                    </Button>
                    
                    {!isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setIsCartOpen(true);
                        }}
                        className="w-full mt-2"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart ({cartItems.length})
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </header>
  );
};

export default Navbar;
