import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { designnames } from "../../designs/designassets";

const CusBillPage = () => {
  const { customizationId } = useParams();
  const navigate = useNavigate();
  const [customization, setCustomization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const billRef = useRef();

  const apiUrl = "https://ritualcakes-stg-92alpha.vercel.app/api";

  const fetchCustomization = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please login again.");

      const res = await axios.get(
        `${apiUrl}/customizations/single/${customizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomization(res.data.customization);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch customization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomization();
  }, [customizationId]);

  const handlePrint = () => {
    if (!billRef.current) return;

    // Turn off edit mode
    setEditMode(false);

    // Wait for the DOM to update
    requestAnimationFrame(() => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 p-8">
          ${billRef.current.outerHTML}
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    });
  };


  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => setEditMode(!editMode);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">Error: {error}</div>;
  if (!customization) return <div className="p-8 text-center">No customization found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <div ref={billRef} className="p-6 border shadow-lg bg-white rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src="/favicon.ico.png" alt="Ritual Logo" className="h-16 w-16 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-pink-600">Ritual Cakes</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">Invoice</p>
            <p className="text-gray-600 text-sm">
              Placed on:{" "}
              {editMode ? (
                <input
                  type="date"
                  value={moment(customization.createdAt).format("YYYY-MM-DD")}
                  onChange={e => handleChange("createdAt", e.target.value)}
                  className="border px-1 py-1 w-full"
                />
              ) : (
                moment(customization.createdAt).format("YYYY-MM-DD")
              )}
            </p>
            <p className="text-gray-600 text-sm">
              Order ID:{" "}
              {editMode ? (
                <input
                  type="text"
                  value={customization._id}
                  onChange={e => handleChange("_id", e.target.value)}
                  className="border px-1 py-1 w-full"
                />
              ) : (
                customization._id
              )}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 border-t pt-2">
          <p className="font-semibold">Billed To:</p>
          {editMode ? (
            <>
              <input type="text" value={customization.name} onChange={e => handleChange("name", e.target.value)} className="border px-1 py-1 w-full mb-1" placeholder="Name" />
              <input type="text" value={customization.email} onChange={e => handleChange("email", e.target.value)} className="border px-1 py-1 w-full mb-1" placeholder="Email" />
              <input type="text" value={customization.phone || ""} onChange={e => handleChange("phone", e.target.value)} className="border px-1 py-1 w-full mb-1" placeholder="Phone" />
              <input type="text" value={customization.address} onChange={e => handleChange("address", e.target.value)} className="border px-1 py-1 w-full" placeholder="Address" />
            </>
          ) : (
            <>
              <p>{customization.name}</p>
              <p>{customization.email}</p>
              <p>{customization.phone || "N/A"}</p>
              <p>{customization.address}</p>
            </>
          )}
        </div>

        {/* Cake Details */}
        <h2 className="text-xl font-semibold mt-4 mb-2">Cake Details</h2>
        <table className="w-full border-collapse border mb-4 text-left">
          <tbody>
            {["cakeType", "size", "flavor", "specialInstructions", "deliveryDate", "approvalStatus", "price"].map(field => (
              <tr key={field}>
                <td className="border px-4 py-2 font-semibold">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                <td className="border px-4 py-2">
                  {editMode ? (
                    field === "specialInstructions" ? (
                      <textarea value={customization[field] || ""} onChange={e => handleChange(field, e.target.value)} className="border px-2 py-1 w-full" />
                    ) : field === "deliveryDate" ? (
                      <input type="date" value={moment(customization[field]).format("YYYY-MM-DD")} onChange={e => handleChange(field, e.target.value)} className="border px-1 py-1 w-full" />
                    ) : field === "price" ? (
                      <input type="number" value={customization[field]} onChange={e => handleChange(field, e.target.value)} className="border px-1 py-1 w-full" />
                    ) : (
                      <input type="text" value={customization[field] || ""} onChange={e => handleChange(field, e.target.value)} className="border px-1 py-1 w-full" />
                    )
                  ) : field === "deliveryDate" ? (
                    moment(customization[field]).format("YYYY-MM-DD")
                  ) : (
                    customization[field] || "N/A"
                  )}
                </td>
              </tr>
            ))}

            {/* Design / Image */}
            <tr>
              <td className="border px-4 py-2 font-semibold">Design / Image</td>
              <td className="border px-4 py-2">
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={customization.imageOrDesign || ""}
                      onChange={e => handleChange("imageOrDesign", e.target.value)}
                      className="border px-1 py-1 w-full mb-2"
                      placeholder="Enter image URL or design name"
                    />
                    {customization.imageOrDesign ? (
                      designnames[customization.imageOrDesign] ? (
                        <img src={designnames[customization.imageOrDesign]} alt={customization.imageOrDesign} className="w-32 h-32 object-cover rounded-lg" />
                      ) : customization.imageOrDesign.startsWith("http") &&
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(customization.imageOrDesign) ? (
                        <img src={customization.imageOrDesign} alt="Cake Design" className="w-32 h-32 object-cover rounded-lg" />
                      ) : (
                        <a href={customization.imageOrDesign} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">Open Link</a>
                      )
                    ) : (
                      "No image/design provided"
                    )}
                  </>
                ) : customization.imageOrDesign ? (
                  designnames[customization.imageOrDesign] ? (
                    <img src={designnames[customization.imageOrDesign]} alt={customization.imageOrDesign} className="w-32 h-32 object-cover rounded-lg" />
                  ) : customization.imageOrDesign.startsWith("http") &&
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(customization.imageOrDesign) ? (
                    <img src={customization.imageOrDesign} alt="Cake Design" className="w-32 h-32 object-cover rounded-lg" />
                  ) : (
                    <a href={customization.imageOrDesign} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">Open Link</a>
                  )
                ) : (
                  "No image/design provided"
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2 text-gray-700 text-sm">
          <p>If you have any questions, feel free to{" "}
            <a href="mailto:ritualcakes2019@gmail.com" className="underline text-pink-600">contact us</a>.
          </p>
          <p>Sincerely, <br /> Ritual Cakes</p>
          <p>&copy; {new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button onClick={toggleEditMode} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded">
          {editMode ? "Cancel Edit" : "Edit Bill"}
        </button>
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Print Bill
        </button>
        <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
};

export default CusBillPage;
