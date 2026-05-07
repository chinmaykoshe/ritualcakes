import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BillPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const invoiceRef = useRef();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!token) throw new Error("Token missing. Please login again.");
                const res = await fetch(
                    `https://ritualcakes-stg-92alpha.vercel.app/api/orders/id/${orderId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token]);

    const handlePrint = () => {
        if (!invoiceRef.current) return;

        // Turn off edit mode
        setEditMode(false);

        // Wait for DOM to update
        requestAnimationFrame(() => {
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        /* Hide inputs and textareas when printing */
                        input, textarea { display: none !important; }
                    </style>
                </head>
                <body class="bg-gray-100 p-8">
                    ${invoiceRef.current.outerHTML}
                </body>
            </html>
        `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500);
        });
    };

    const handleChange = (field, value) => {
        setOrder(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...order.orderItems];
        updatedItems[index][field] = value;
        setOrder(prev => ({ ...prev, orderItems: updatedItems }));
    };

    const toggleEditMode = () => setEditMode(!editMode);

    if (loading) return <div className="p-6 text-center">Loading bill...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!order) return <div className="p-6">Order not found.</div>;

    const itemsWithSubtotal = order.orderItems.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
    }));
    const grandTotal = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="p-8 max-w-3xl mx-auto font-sans">
            <div ref={invoiceRef} className="p-6 border shadow-lg bg-white rounded-lg">
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
                            Date: {editMode ? <input type="date" value={order.orderDate?.slice(0, 10)} onChange={e => handleChange("orderDate", e.target.value)} className="border px-1 py-1 w-full" /> : new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                            Order No: {editMode ? <input type="text" value={order._id} onChange={e => handleChange("_id", e.target.value)} className="border px-1 py-1 w-full" /> : order._id}
                        </p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4 border-t pt-2">
                    <p className="font-semibold">Billed To:</p>
                    {editMode ? (
                        <>
                            <input type="text" value={order.userEmail} onChange={e => handleChange("userEmail", e.target.value)} className="border px-1 py-1 w-full mb-1" />
                            <input type="text" value={order.deliveryAddress} onChange={e => handleChange("deliveryAddress", e.target.value)} className="border px-1 py-1 w-full" />
                        </>
                    ) : (
                        <>
                            <p>{order.userEmail}</p>
                            <p>{order.deliveryAddress}</p>
                        </>
                    )}
                </div>

                {/* Cake Message */}
                <div className="mb-6">
                    <p className="font-semibold">Cake Message:</p>
                    {editMode ? (
                        <textarea value={order.cakeMessage || ""} onChange={e => handleChange("cakeMessage", e.target.value)} className="border px-2 py-1 w-full" />
                    ) : (
                        <p>{order.cakeMessage || "N/A"}</p>
                    )}
                </div>

                {/* Table */}
                <table className="w-full border-collapse border mb-4 text-left">
                    <thead>
                        <tr className="bg-pink-50 text-pink-700 font-semibold">
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Cake / Item</th>
                            <th className="border px-4 py-2">Qty</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsWithSubtotal.map((item, idx) => (
                            <tr key={idx}>
                                <td className="border px-4 py-2">{idx + 1}</td>
                                <td className="border px-4 py-2">
                                    {editMode ? <input type="text" value={item.name} onChange={e => handleItemChange(idx, "name", e.target.value)} className="border px-1 py-1 w-full" /> : item.name}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMode ? <input type="number" value={item.quantity} onChange={e => handleItemChange(idx, "quantity", e.target.value)} className="border px-1 py-1 w-full" /> : item.quantity}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMode ? <input type="number" value={item.price} onChange={e => handleItemChange(idx, "price", e.target.value)} className="border px-1 py-1 w-full" /> : `₹${item.price}`}
                                </td>
                                <td className="border px-4 py-2">₹{item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total */}
                <div className="text-right font-bold text-xl mb-4">
                    Grand Total: ₹{grandTotal}
                </div>

                <div className="mt-8 text-center space-y-2 text-gray-700 text-sm">
                    <p>If you have any questions, feel free to{" "}
                        <a href="mailto:ritualcakes2019@gmail.com" className="underline text-pink-600">contact us</a>.
                    </p>
                    <p>Sincerely, <br />Ritual Cakes</p>
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

export default BillPage;
