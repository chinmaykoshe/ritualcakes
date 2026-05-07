import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActions, setShowActions] = useState(false); // Controls "Delete" visibility
  const token = localStorage.getItem('token');
  const apiUrl = `https://ritualcakes-stg-92alpha.vercel.app/api/users`;

  useEffect(() => {
    const fetchCustomers = async () => {
      if (token) {
        try {
          const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (Array.isArray(response.data)) {
            setCustomers(response.data);
          } else if (Array.isArray(response.data.users)) {
            setCustomers(response.data.users);
          } else {
            setError('Unexpected data format');
          }
        } catch (err) {
          console.error('Error fetching customers:', err);
          setError(err.response?.data?.message || err.message || 'Error fetching customers');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No token found. Please log in.');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (confirmDelete) {
      try {
        await axios.delete(`${apiUrl}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
        alert('Customer deleted successfully.');
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer: ' + err.message);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const search = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.surname?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.mobile?.toLowerCase().includes(search) ||
      customer.address?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Customers List</h2>
      <p className="text-neutral-500 text-sm mb-8">Dashboard / Customers</p>
      <input
        type="text"
        placeholder="Search by name, email, address, etc..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showActions}
            onChange={(e) => setShowActions(e.target.checked)}
          />
          <span className="text-gray-700">Show Delete Actions</span>
        </label>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-solid border-[1px] border-neutral-300">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700">
                <th className="px-4 py-2 border border-solid">Name</th>
                <th className="px-4 py-2 border border-solid">Surname</th>
                <th className="px-4 py-2 border border-solid">Email</th>
                <th className="px-4 py-2 border border-solid">Phone</th>
                <th className="px-4 py-2 border border-solid">Address</th>
                <th className="px-4 py-2 border border-solid">Cart Products</th>
                {showActions && (
                  <th className="px-4 py-2 border border-solid">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 7 : 6} className="text-center py-4">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers
                  .filter((customer) => customer.role !== 'admin')
                  .map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-4 py-2 border border-solid">{customer.name}</td>
                      <td className="px-4 py-2 border border-solid">{customer.surname}</td>
                      <td className="px-4 py-2 border border-solid">{customer.email}</td>
                      <td className="px-4 py-2 border border-solid">{customer.mobile}</td>
                      <td className="px-4 py-2 border border-solid">{customer.address}</td>
                      <td className="px-4 py-2 border border-solid">
                        {customer.cartProducts && customer.cartProducts.length > 0 ? (
                          <ul>
                            {customer.cartProducts.map((product, index) => (
                              <li key={index}>{product.name || 'Unnamed Product'}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>No products</span>
                        )}
                      </td>
                      {showActions && (
                        <td className="px-4 py-2 border border-solid">
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 active:bg-red-700 transition"
                          >
                            Delete
                          </button>


                        </td>
                      )}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Customers;