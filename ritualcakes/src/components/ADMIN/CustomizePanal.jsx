import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { designnames } from "../../designs/designassets";
import { useNavigate } from "react-router-dom";

const CustomizationPanel = () => {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCakeType, setSelectedCakeType] = useState("");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const apiUrl = '/api'
  const fetchCustomizations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.get(`${apiUrl}/customizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setCustomizations(response.data);
      } else {
        setCustomizations([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch customizations");
    } finally {
      setLoading(false);
    }
  };
  const filteredCustomizations = customizations
    .filter((customization) => {
      const searchLower = searchQuery.toLowerCase();
      const cakeTypeFilter = selectedCakeType ? customization.cakeType === selectedCakeType : true;
      const approvalStatusFilter = selectedApprovalStatus ? customization.approvalStatus === selectedApprovalStatus : true;
      const dateFilter = selectedDate
        ? moment(customization.deliveryDate).format("YYYY-MM-DD") === selectedDate
        : true;
      return (
        (customization.name.toLowerCase().includes(searchLower) ||
          customization.email.toLowerCase().includes(searchLower) ||
          customization.cakeType.toLowerCase().includes(searchLower)) &&
        cakeTypeFilter &&
        approvalStatusFilter &&
        dateFilter
      );
    })
    .sort((a, b) => moment(b.deliveryDate).isBefore(moment(a.deliveryDate)) ? 1 : -1);
  const updateCustomizationStatus = async (customizationId, newStatus) => {
    setLoadingStates((prev) => ({ ...prev, [customizationId]: true }));
    try {
      const token = localStorage.getItem("token");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.put(
        `${apiUrl}/customizations/${customizationId}`,
        { approvalStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomizations((prevCustomizations) =>
        prevCustomizations.map((customization) =>
          customization._id === customizationId ? { ...customization, approvalStatus: newStatus } : customization
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update customization status");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [customizationId]: false }));
    }
  };
  const updateCustomizationPrice = async (customizationId, newPrice) => {
    setLoadingStates((prev) => ({ ...prev, [customizationId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");
      const currentCustomization = customizations.find((c) => c._id === customizationId);
      if (!currentCustomization) throw new Error("Customization not found.");
      const payload = {
        price: newPrice,
        approvalStatus: currentCustomization.approvalStatus,
      };
      const response = await axios.put(
        `${apiUrl}/customizations/${customizationId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomizations((prevCustomizations) =>
        prevCustomizations.map((customization) =>
          customization._id === customizationId ? { ...customization, price: newPrice } : customization
        )
      );
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Failed to update price");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [customizationId]: false }));
    }
  };
  const exportToCSV = () => {
    const headers = [
      "Customization ID",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "Cake Size",
      "Cake Type",
      "Flavor",
      "Message",
      "Special Instructions",
      "Delivery Date",
      "Approval Status",
      "Price",
      "imageOrDesign"
    ];
    const rows = customizations.map((customization) => [
      customization._id,
      customization.name,
      customization.email,
      customization.phone || "N/A",
      customization.address,
      customization.size,
      customization.cakeType,
      customization.imageOrDesign,
      customization.flavor,
      customization.message || "N/A",
      customization.specialInstructions || "N/A",
      moment(customization.deliveryDate).format("YYYY-MM-DD"),
      customization.approvalStatus,
      `₹${customization.price}`,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customizations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    fetchCustomizations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 h-full">
      <h2 className="text-xl font-bold mb-4">Customization Panel</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or cake type"
          className="border border-gray-400 rounded px-4 py-2 w-64 mr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border border-gray-400 rounded px-4 py-2 w-64 mr-4"
          value={selectedApprovalStatus}
          onChange={(e) => setSelectedApprovalStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="date"
          className="border border-gray-400 rounded px-4 py-2 w-64 mr-4"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-4"
        >
          Export to CSV
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Customization ID</th>
            <th className="border border-gray-300 px-12 py-2">Image Or Design</th>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">Cake Size</th>
            <th className="border border-gray-300 px-4 py-2">Cake Type</th>
            <th className="border border-gray-300 px-4 py-2">Flavor</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Special Instructions</th>
            <th className="border border-gray-300 px-4 py-2">Delivery Date</th>
            <th className="border border-gray-300 px-4 py-2">Approval Status</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomizations.map((customization) => (
            <tr key={customization._id}>
              <td className="border border-gray-300 px-4 py-2">{customization._id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {customization.imageOrDesign ? (
                  designnames[customization.imageOrDesign] ? (
                    <img
                      src={designnames[customization.imageOrDesign]}
                      alt={`Design: ${customization.imageOrDesign}`}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  ) : customization.imageOrDesign.startsWith("http") && /\.(jpg|jpeg|png|gif|webp)$/i.test(customization.imageOrDesign) ? (
                    <img
                      src={customization.imageOrDesign}
                      alt={`Design: ${customization.imageOrDesign}`}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  ) : (
                    <div>
                      <span>Open in new tab</span>
                      <span className="break-all text-blue-500 overflow-hidden text-ellipsis line-clamp-3">
                        <a
                          href={customization.imageOrDesign}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(customization.imageOrDesign, "_blank");
                          }}
                          rel="noopener noreferrer"
                        >
                          {customization.imageOrDesign}
                        </a>
                      </span>
                    </div>
                  )
                ) : (
                  "No image/design provided"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{customization.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.phone || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.address}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.size}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.cakeType}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.flavor}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.message || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.specialInstructions || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{moment(customization.deliveryDate).format("YYYY-MM-DD")}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.approvalStatus}</td>
              <td className="border border-gray-300 px-4 py-2">
                {loadingStates[customization._id] ? (
                  <span className="text-blue-500">Updating...</span> // Show loading only in this td
                ) : (
                  <input
                    type="number"
                    className="border border-gray-400 rounded px-2 py-1"
                    value={customization.price || ""} // Prevent undefined issues
                    onBlur={async (e) => {
                      const newPrice = parseFloat(e.target.value);
                      if (isNaN(newPrice)) return; // Prevent invalid updates
                      await updateCustomizationPrice(customization._id, newPrice);
                    }}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setCustomizations((prevCustomizations) =>
                        prevCustomizations.map((item) =>
                          item._id === customization._id ? { ...item, price: newPrice } : item
                        )
                      );
                    }}
                  />
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {loadingStates[customization._id] ? (
                  <span className="text-blue-500">Updating...</span> // Show loading only in this td
                ) : (
                  <select
                    className="border border-gray-400 rounded px-2 py-1"
                    value={customization.approvalStatus}
                    onChange={(e) => updateCustomizationStatus(customization._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                )}
              </td>
              <td>
                <button
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/admin/cusbill/${customization._id}`)}
                >
                  Print Bill
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomizationPanel;
