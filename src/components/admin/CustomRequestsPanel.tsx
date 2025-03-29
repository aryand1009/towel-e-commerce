
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface CustomRequest {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface CustomRequestsPanelProps {
  customRequests: CustomRequest[];
  pendingRequests: number;
}

const CustomRequestsPanel: React.FC<CustomRequestsPanelProps> = ({ 
  customRequests, 
  pendingRequests 
}) => {
  const navigate = useNavigate();
  
  if (customRequests.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel p-6 rounded-lg mb-8">
      <h2 className="text-xl font-medium mb-4">Custom Design Requests</h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-towel-gray">Pending Requests:</span>
          <span className="ml-2 font-semibold text-lg">{pendingRequests}</span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/custom-requests')}
        >
          Manage Custom Requests
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customRequests.slice(0, 3).map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.id.substring(0, 8)}...</TableCell>
              <TableCell>{request.title}</TableCell>
              <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomRequestsPanel;
