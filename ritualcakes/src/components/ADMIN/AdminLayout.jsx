import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaBoxOpen, 
  FaStore, 
  FaMagic, 
  FaStar, 
  FaSignOutAlt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaShoppingBag, 
  FaBirthdayCake, 
  FaClipboardList 
} from 'react-icons/fa';
import assets from '../../assets/assets';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboards', icon: <FaChartLine /> },
    { name: 'Customers', path: '/admin/customers', icon: <FaUsers /> },
    { name: 'Orders Total', path: '/admin/orderspanel', icon: <FaBoxOpen /> },
    { name: 'Customized', path: '/admin/customizedpanal', icon: <FaMagic /> },
    { name: 'In Store Collection', path: '/admin/orderscollection', icon: <FaClipboardList /> },
    { name: 'Available Cakes', path: '/admin/CakesAvailable', icon: <FaBirthdayCake /> },
    { name: 'Customizations List', path: '/admin/adminproducts', icon: <FaStore /> },
    { name: 'Store Front', path: '/admin/store', icon: <FaShoppingBag /> },
    { name: 'Store Front POS', path: '/admin/storefront', icon: <FaChartLine /> },
    { name: 'Reviews', path: '/admin/reviewsection', icon: <FaStar /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Admin Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-72'
        } bg-bakery-dark text-bakery-cream flex flex-col shadow-2xl fixed h-full z-50 transition-all duration-300 ease-in-out border-r border-white/5`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 bg-bakery-rose text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border border-white/20"
        >
          {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
        </button>

        <div className={`p-8 border-b border-white/10 overflow-hidden ${isCollapsed ? 'px-4' : 'p-8'}`}>
          <div className="flex items-center space-x-3 mb-2">
            <img src={assets.logo} className="h-8 min-w-[32px] brightness-0 invert" alt="Logo" />
            {!isCollapsed && (
              <span className="font-serif font-bold text-xl tracking-tighter whitespace-nowrap opacity-100 transition-opacity duration-300">ADMIN PANEL</span>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest whitespace-nowrap opacity-100 transition-opacity duration-300">Ritual Cakes Management</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ''}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group ${
                  isActive 
                    ? 'bg-bakery-rose text-white shadow-lg' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
              {!isCollapsed && (
                <span className="whitespace-nowrap opacity-100 transition-opacity duration-300">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`p-4 border-t border-white/10 ${isCollapsed ? 'px-2' : 'p-6'}`}>
          <button 
            onClick={handleSignOut}
            title={isCollapsed ? "Sign Out" : ''}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-white/60 group"
          >
            <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-72'} ${location.pathname.includes('storefront') ? 'p-0' : 'p-8 md:p-12'}`}>
        {!location.pathname.includes('storefront') && (
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-bakery-chocolate tracking-tight">Welcome Back, Admin</h1>
              <p className="text-bakery-chocolate/50 font-medium">Managing the sweetness of Ritual Cakes today.</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-3 rounded-2xl shadow-sm border border-bakery-chocolate/5">
              <div className="text-right hidden sm:block px-2">
                <p className="font-bold text-bakery-chocolate leading-tight">Administrator</p>
                <p className="text-[10px] text-bakery-rose uppercase tracking-widest font-black">Super User</p>
              </div>
              <div className="w-12 h-12 bg-bakery-rose rounded-xl flex items-center justify-center text-white font-bold shadow-md transform rotate-3">
                A
              </div>
            </div>
          </header>
        )}
        
        <div className={`${location.pathname.includes('storefront') ? 'bg-transparent shadow-none border-none p-0' : 'bg-white rounded-3xl p-2 sm:p-6 shadow-xl shadow-bakery-chocolate/5 border border-bakery-chocolate/5 min-h-[70vh]'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
