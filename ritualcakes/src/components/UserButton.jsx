import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function UserButton() {
  const { user, updateUser, loading, error, isAdmin } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    dob: "",
  });

  const navigate = useNavigate();

  // Populate form from backend user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
        address: user.address || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setTimeout(() => window.location.reload(), 1100);
  };

  const formattedDOB = user?.dob
    ? new Date(user.dob).toLocaleDateString("en-GB")
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-bakery-pista-light/30 px-4 py-16 text-center text-bakery-chocolate">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bakery-pista-light/30 px-4 py-16">
        <p className="mx-auto max-w-md bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            to="/"
            className="font-montserrat text-sm font-semibold text-bakery-chocolate hover:text-bakery-pista-deep"
          >
            &larr; Back to home
          </Link>
        </div>

        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-pista-deep">
            Your account
          </p>
          <h1 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Your Information</h1>
          <p className="mt-3 text-sm text-customGray">
            Manage your details and view your Ritual Cakes activity.
          </p>
        </div>

        {!user ? (
          <div className="bg-white p-6 text-center shadow-premium md:p-8">
            <p className="font-semibold text-red-600">
              Please log in to view your information.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn-premium mt-5"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-premium md:p-8">
            {!isEditing ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <p className="border border-bakery-pista/30 bg-bakery-pista-light/60 px-4 py-3 text-sm text-customGray">
                    <span className="block font-semibold text-bakery-chocolate">Full Name</span>
                    {user.name}
                  </p>
                  <p className="border border-bakery-pista/30 bg-bakery-pista-light/60 px-4 py-3 text-sm text-customGray">
                    <span className="block font-semibold text-bakery-chocolate">Email</span>
                    {user.email}
                  </p>
                  <p className="border border-bakery-pista/30 bg-bakery-pista-light/60 px-4 py-3 text-sm text-customGray">
                    <span className="block font-semibold text-bakery-chocolate">Mobile</span>
                    {user.mobile || "Not added"}
                  </p>
                  <p className="border border-bakery-pista/30 bg-bakery-pista-light/60 px-4 py-3 text-sm text-customGray">
                    <span className="block font-semibold text-bakery-chocolate">Date of Birth</span>
                    {formattedDOB || "Not added"}
                  </p>
                  <p className="border border-bakery-pista/30 bg-bakery-pista-light/60 px-4 py-3 text-sm text-customGray md:col-span-2">
                    <span className="block font-semibold text-bakery-chocolate">Address</span>
                    {user.address || "Not added"}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="btn-premium"
                  >
                    View Orders
                  </button>
                  {isAdmin() && (
                    <button
                      onClick={() => navigate("/admin/dashboards")}
                      className="px-8 py-3 bg-bakery-rose text-white rounded-full font-semibold transition-all duration-300 hover:bg-bakery-chocolate active:scale-95"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-bakery-chocolate" htmlFor="name">Full Name</label>
                  <input className="input-premium" id="name" name="name" value={formData.name} onChange={handleEditChange} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-bakery-chocolate" htmlFor="mobile">Mobile</label>
                  <input className="input-premium" id="mobile" name="mobile" value={formData.mobile} onChange={handleEditChange} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-bakery-chocolate" htmlFor="dob">Date of Birth</label>
                  <input className="input-premium" id="dob" name="dob" type="date" value={formData.dob?.slice(0, 10) || ""} onChange={handleEditChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-bakery-chocolate" htmlFor="address">Address</label>
                  <input className="input-premium" id="address" name="address" value={formData.address} onChange={handleEditChange} />
                </div>
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button type="submit" className="btn-premium">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserButton;
