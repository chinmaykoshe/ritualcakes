import React, { createContext, useState, useContext } from 'react';
const CustomizationContext = createContext();

export const useCustomization = () => {
  return useContext(CustomizationContext);
};

export const CustomizationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: localStorage.getItem('user') || '',
    phone: '',
    address: '',
    size: '',
    cakeType: '',
    flavor: '',
    message: '',
    specialInstructions: '',
    deliveryDate: '',
    imageOrDesign: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customizations, setCustomizations] = useState([]); 
  const yourToken = localStorage.getItem('token'); 
  const apiUrl = '/api'
  const fetchCustomizations = async () => {
    setLoading(true);
    setError('');
    const userEmail = localStorage.getItem('user');
    if (!userEmail) {
      setError('User email not found.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/customizations/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customization data');
      }
      const result = await response.json();
      setCustomizations(result);
      setSuccess('Customization data fetched successfully!');
    } catch (err) {
      setError('There was an error fetching the customization data.');
    } finally {
      setLoading(false); 
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const submitCustomization = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${apiUrl}/customizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError('There was an error with your submission. Please try again.');
        return;
      }
      const result = await response.json();
      setSuccess('Customization submitted successfully!');
      fetchCustomizations(); 
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        size: '',
        cakeType: '',
        flavor: '',
        message: '',
        specialInstructions: '',
        deliveryDate: '',
        imageOrDesign: '',
      });
    } catch (err) {
      setError('There was an error with your submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const updateCustomization = async (id, updatedData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${apiUrl}/customizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Update failed!');
      }

      const result = await response.json();
      setSuccess('Customization updated successfully!');
      setFormData(updatedData);
    } catch (err) {
      setError('There was an error updating the customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const deleteCustomization = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${apiUrl}/customizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Deletion failed!');
      }
      setSuccess('Customization deleted successfully!');
      fetchCustomizations();
    } catch (err) {
      setError('There was an error deleting the customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CustomizationContext.Provider
      value={{
        customizations, 
        setCustomizations, 
        formData,
        handleChange, 
        submitCustomization, 
        updateCustomization,
        deleteCustomization,
        fetchCustomizations,
        loading, 
        error, 
        success,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};
