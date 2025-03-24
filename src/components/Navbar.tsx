import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from './CartModal';
import { CartItem } from './CartModal';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Create a context for sharing cart functionality
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart items from localStorage on initial mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Check if the item already exists in cart
      const existingItem = prevItems.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        // Increase quantity of existing item
        newItems = prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        newItems = [...prevItems, { ...product, quantity: 1 }];
      }
      
      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart.`
      });
      
      return newItems;
    });
  };
  
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      return newItems;
    });
  };
  
  return { cartItems, addToCart, removeFromCart };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Make cart functions available globally
  useEffect(() => {
    window.addToCart = addToCart;
  }, [addToCart]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 glass-panel' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-towel-navy to-towel-blue">
              LUXE TOWELS
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/collections" className="nav-link">Collections</Link>
            <Link to="/bestsellers" className="nav-link">Best Sellers</Link>
            <Link to="/custom" className="nav-link">Custom Design</Link>
            <Link to="/about" className="nav-link">About Us</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full text-towel-gray hover:text-towel-dark hover:bg-white/50 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <button 
              className="p-2 rounded-full text-towel-gray hover:text-towel-dark hover:bg-white/50 transition-colors relative"
              aria-label="Shopping Cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-towel-accent text-towel-dark text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-2 rounded-full text-towel-gray hover:text-towel-dark hover:bg-white/50 transition-colors"
                    aria-label="User Menu"
                  >
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin-dashboard' : '/profile')}>
                    {isAdmin ? 'Admin Dashboard' : 'Profile'}
                  </DropdownMenuItem>
                  
                  {!isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="hidden md:block text-sm font-medium text-towel-dark hover:text-towel-blue transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="hidden md:block px-4 py-2 text-sm font-medium bg-towel-blue text-white rounded-full hover:bg-towel-navy transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 rounded-full text-towel-gray hover:text-towel-dark hover:bg-white/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <div 
          className={`md:hidden absolute top-full left-0 right-0 glass-panel overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] border-t border-white/20' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/collections" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            <Link to="/bestsellers" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Best Sellers</Link>
            <Link to="/custom" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Custom Design</Link>
            <Link to="/about" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            
            {!isAuthenticated && (
              <>
                <div className="border-t border-white/10 my-2"></div>
                <Link to="/login" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
            
            {isAuthenticated && (
              <>
                <div className="border-t border-white/10 my-2"></div>
                <Link 
                  to={isAdmin ? '/admin-dashboard' : '/profile'} 
                  className="nav-link block py-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAdmin ? 'Admin Dashboard' : 'My Profile'}
                </Link>
                {!isAdmin && (
                  <Link to="/orders" className="nav-link block py-2" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                )}
                <button 
                  className="nav-link block py-2 text-left w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </>
  );
};

// Add types to the window object
declare global {
  interface Window {
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  }
}

export default Navbar;
