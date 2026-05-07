import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import assets from '../assets/assets';

function Footer() {
  return (
    <footer className="bg-bakery-chocolate text-bakery-cream pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img src={assets.logo} className="h-12 w-auto brightness-0 invert" alt="Logo" />
              <span className="text-2xl font-serif font-bold tracking-tighter">RITUAL CAKES</span>
            </Link>
            <p className="text-bakery-cream/70 leading-relaxed">
              Crafting sweet moments with love and precision. Every cake is a ritual of taste and artistry, baked fresh just for you.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-bakery-cream/10 flex items-center justify-center hover:bg-bakery-rose transition-colors">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-bakery-cream/10 flex items-center justify-center hover:bg-bakery-rose transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6">Explore</h3>
            <ul className="space-y-4">
              {['Home', 'Designs', 'Cakes', 'Catalogue', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '')}`} className="text-bakery-cream/70 hover:text-bakery-rose transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-bakery-cream/70">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-bakery-rose" />
                <span>Shop no.:1, Uma Imperial, Dronagiri Sec.:48, Uran-400702</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-bakery-rose" />
                <a href="tel:+918169296802" className="hover:text-bakery-rose">+91 8169296802</a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-bakery-rose" />
                <a href="mailto:ritualcakes2019@gmail.com" className="hover:text-bakery-rose">ritualcakes2019@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6">Visit Us</h3>
            <div className="bg-bakery-cream/5 p-6 rounded-2xl border border-bakery-cream/10">
              <div className="flex items-center space-x-3 mb-4">
                <FaClock className="text-bakery-rose" />
                <span className="font-bold">Opening Hours</span>
              </div>
              <div className="space-y-2 text-sm text-bakery-cream/70">
                <div className="flex justify-between">
                  <span>Mon - Sun</span>
                  <span>10:00 am - 10:30 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-bakery-cream/10 flex flex-col md:flex-row justify-between items-center text-sm text-bakery-cream/50">
          <p>© 2024 Ritual Cakes. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/company-info" className="hover:text-bakery-rose">Privacy Policy</Link>
            <Link to="/company-info" className="hover:text-bakery-rose">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

