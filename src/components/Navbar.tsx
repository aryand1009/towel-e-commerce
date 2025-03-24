import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';

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
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-towel-blue mr-8">TowelShop</Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" text="Home" />
            <NavLink to="/custom-request" text="Custom Design" />
            {user && isAdmin && (
              <NavLink to="/admin-dashboard" text="Admin" />
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:block text-sm font-medium text-foreground">
                {user.name || user.email}
              </span>
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
                    <NavLink to="/custom-request" text="Custom Design" />
                    {user && isAdmin && (
                      <NavLink to="/admin-dashboard" text="Admin" />
                    )}
                    <Button variant="outline" size="sm" onClick={logout} className="w-full mt-4">
                      Logout
                    </Button>
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
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <NavLink to="/" text="Home" />
            <NavLink to="/custom-request" text="Custom Design" />
            {user && isAdmin && (
              <NavLink to="/admin-dashboard" text="Admin" />
            )}
            {user && (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
