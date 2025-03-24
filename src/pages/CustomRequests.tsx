
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ArrowLeft, Search, X, Check } from 'lucide-react';

interface CustomRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  description: string;
  quantity: number;
  budget: number;
  phone: string;
  image: string | null;
  status: string;
  date: string;
}

const CustomRequests = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CustomRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Redirect if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Load custom requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('customRequests');
    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests);
      setRequests(parsedRequests);
      setFilteredRequests(parsedRequests);
    }
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request => 
        request.title.toLowerCase().includes(term.toLowerCase()) ||
        request.userName.toLowerCase().includes(term.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  // View request details
  const viewRequestDetails = (request: CustomRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  // Update request status
  const updateRequestStatus = (requestId: string, newStatus: string) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setFilteredRequests(
      filteredRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: newStatus };
        }
        return req;
      })
    );
    
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
    
    localStorage.setItem('customRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: `Request ${newStatus}`,
      description: `Custom request has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <motion.div 
      className="container mx-auto py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel p-8 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => navigate('/admin-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Custom Requests</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-towel-gray h-4 w-4" />
            <Input
              className="pl-10 w-[250px]"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {filteredRequests.length > 0 ? (
          <Table>
            <TableCaption>Custom towel design requests from customers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Request Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <button 
                      onClick={() => viewRequestDetails(request)}
                      className="hover:underline text-left text-towel-blue"
                    >
                      {request.title.length > 30 
                        ? `${request.title.substring(0, 30)}...` 
                        : request.title}
                    </button>
                  </TableCell>
                  <TableCell>{request.userName}</TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>${request.budget.toFixed(2)}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewRequestDetails(request)}
                      >
                        View Details
                      </Button>
                      
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateRequestStatus(request.id, 'approved')}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-towel-gray">No custom requests found</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('');
                  setFilteredRequests(requests);
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Request Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Custom Request Details</SheetTitle>
            <SheetDescription>
              Reviewing request from {selectedRequest?.userName}
            </SheetDescription>
          </SheetHeader>
          
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-towel-gray">Request Title</h3>
                <p className="mt-1 text-lg">{selectedRequest.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-towel-gray">Description</h3>
                <p className="mt-1 whitespace-pre-line">{selectedRequest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-towel-gray">Quantity</h3>
                  <p className="mt-1">{selectedRequest.quantity}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-towel-gray">Budget per Item</h3>
                  <p className="mt-1">${selectedRequest.budget.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-towel-gray">Contact Information</h3>
                <div className="mt-1">
                  <p>{selectedRequest.userEmail}</p>
                  {selectedRequest.phone && <p>{selectedRequest.phone}</p>}
                </div>
              </div>
              
              {selectedRequest.image && (
                <div>
                  <h3 className="text-sm font-medium text-towel-gray">Design Reference</h3>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={selectedRequest.image} 
                      alt="Design reference" 
                      className="w-full object-contain max-h-96" 
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-towel-gray mb-3">Current Status</h3>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedRequest.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedRequest.status === 'rejected' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                  >
                    <Check className="h-4 w-4 mr-2" /> Approve Request
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default CustomRequests;
