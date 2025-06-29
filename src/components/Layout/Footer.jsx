import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Mutaxassislar</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              O'zbekistondagi eng yaxshi professional xizmatlar platformasi.
              Minglab mutaxassis va mijozlarni bog'laymiz.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/specialists"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Mutaxassislar
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Kategoriyalar
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Narxlar
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Martaba
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Yordam</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Yordam markazi
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Ko'p so'raladigan savollar
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Aloqa
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Foydalanish shartlari
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Maxfiylik siyosati
                </a>
              </li>
              <li>
                <a
                  href="/refund"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Qaytarish siyosati
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa ma'lumotlari</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Toshkent shahar,</p>
                  <p className="text-gray-300 text-sm">Chilonzor tumani</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:+998712345678"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +998 (71) 234-56-78
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:info@mutaxassislar.uz"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  info@mutaxassislar.uz
                </a>
              </div>
            </div>

            {/* App Download */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">
                Ilovani yuklab oling
              </h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2"
                >
                  <img
                    src="/app-store.png"
                    alt="App Store"
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2"
                >
                  <img
                    src="/google-play.png"
                    alt="Google Play"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="py-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Mashhur kategoriyalar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Veb Dizayn",
              "Mobil Ilovalar",
              "Digital Marketing",
              "Copywriting",
              "Video Montaj",
              "Grafik Dizayn",
              "SEO Optimizatsiya",
              "Sotsiyal Media",
              "Logo Dizayn",
              "WordPress",
              "E-commerce",
              "UI/UX Dizayn",
            ].map((category) => (
              <a
                key={category}
                href={`/categories/${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm">
              © {currentYear} Mutaxassislar. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex space-x-6">
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Shartlar
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Maxfiylik
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookie
              </a>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Til:</span>
            <select className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-blue-500">
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
