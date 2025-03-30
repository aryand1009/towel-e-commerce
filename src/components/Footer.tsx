
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-towel-dark text-white">
      {/* Main footer */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">DTex TOWELS</h3>
            <p className="text-towel-gray mb-6 max-w-md">
              Premium towels crafted with the finest materials for a luxurious bathing experience.
              Our commitment to quality and sustainability sets us apart.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Help - Only show for customers */}
          {!isAdmin && (
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/track-order" className="text-towel-gray hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="text-towel-gray hover:text-white transition-colors">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-towel-gray hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          )}
          
          {/* Contact */}
          <div className={isAdmin ? "md:col-span-2" : ""}>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 text-towel-accent flex-shrink-0 mt-1" />
                <span className="text-towel-gray">
                  MIDC, Solpaur, Maharashtra, India.
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-towel-accent flex-shrink-0" />
                <span className="text-towel-gray">+91 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-towel-accent flex-shrink-0" />
                <span className="text-towel-gray">contact@dtex.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="border-t border-white/10">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-2">Subscribe to our newsletter</h4>
              <p className="text-towel-gray">
                Get the latest updates on new products, special offers, and more.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-towel-accent"
              />
              <button className="px-6 py-3 bg-white text-towel-dark font-medium rounded-lg hover:bg-towel-accent transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-towel-gray text-sm">
              © {new Date().getFullYear()} DTex. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-towel-gray text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-towel-gray text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-towel-gray text-sm hover:text-white transition-colors">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
