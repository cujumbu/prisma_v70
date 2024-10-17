import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendStatusUpdateEmail } from '../utils/emailService';
import { X } from 'lucide-react';

interface Claim {
  id: string;
  orderNumber: string;
  email: string;
  name: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phoneNumber: string;
  brand: string;
  problemDescription: string;
  status: string;
  submissionDate: string;
}

const AdminDashboard: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchClaims = async () => {
      try {
        const response = await fetch('/api/claims');
        if (!response.ok) {
          throw new Error('Failed to fetch claims');
        }
        const claimsData = await response.json();
        setClaims(claimsData);
        setFilteredClaims(claimsData);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, [user, navigate]);

  useEffect(() => {
    if (statusFilter) {
      setFilteredClaims(claims.filter(claim => claim.status === statusFilter));
    } else {
      setFilteredClaims(claims);
    }
  }, [statusFilter, claims]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/claims/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update claim status');
      }

      const updatedClaim = await response.json();

      setClaims(prevClaims => prevClaims.map(claim =>
        claim.id === id ? { ...claim, status: newStatus } : claim
      ));

      // Send email notification
      await sendStatusUpdateEmail(updatedClaim.email, updatedClaim.orderNumber, newStatus);
    } catch (error) {
      console.error('Error updating claim status:', error);
    }
  };

  const getFormattedAddress = (claim: Claim) => {
    if (claim.street && claim.postalCode && claim.city) {
      return `${claim.street}, ${claim.postalCode} ${claim.city}`;
    } else {
      return 'Address not provided';
    }
  };

  const handleViewDetails = (claim: Claim) => {
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-6 py-4 whitespace-nowrap">{claim.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={claim.status}
                    onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                    className="mr-2 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => handleViewDetails(claim)}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Claim Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Order Number:</strong> {selectedClaim.orderNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Name:</strong> {selectedClaim.name}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {selectedClaim.email}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Phone:</strong> {selectedClaim.phoneNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Address:</strong> {getFormattedAddress(selectedClaim)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Brand:</strong> {selectedClaim.brand}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {selectedClaim.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Submission Date:</strong> {new Date(selectedClaim.submissionDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Problem Description:</strong>
                </p>
                <p className="text-sm text-gray-500 mt-1 text-left">
                  {selectedClaim.problemDescription}
                </p>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
