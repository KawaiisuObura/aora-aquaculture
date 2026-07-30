import { Link } from 'react-router-dom';
import fishBg from './assets/fish-background.jpg';

function LandingPage() {
  return (
    <div 
  className="min-h-screen bg-gradient-to-b from-green-50 to-white"
  style={{
    backgroundImage: `url(${fishBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}
>
  <div div classname="absolute inset-0 bg-white/70 "></div>

      
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐟</span>
          <span className="text-2xl font-bold text-green-700">Aora</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-green-600 transition">Home</a>
          <a href="#" className="hover:text-green-600 transition">About Us</a>
          <a href="#" className="hover:text-green-600 transition">Services</a>
          <a href="#" className="hover:text-green-600 transition">Contact Us</a>
        </div>

        {/* Login Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg">
              Farmer Login
            </button>
          </Link>
          <Link to="/admin-login">
            <button className="border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition">
              Admin Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-8 py-16 gap-12">
        {/* Left Side - Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
            Smart <span className="text-green-600">Aquaculture</span>
            <br />
            Management
          </h1>
          <p className="text-gray-600 text-lg mt-4 max-w-lg mx-auto md:mx-0">
            Streamline your fish farming operations with real-time monitoring, 
            feeding schedules, and financial tracking—all in one place.
          </p>
          
          {/* Button Group */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg text-lg font-medium">
              Learn More
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition text-lg font-medium">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side - Image/Illustration */}
        <div className="flex-1 flex justify-center">
          <div className="bg-green-100 rounded-3xl p-8 w-full max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">🌊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Water Quality</p>
                  <p className="font-semibold text-green-700">pH: 7.2 • Temp: 26°C</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">🐟</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Count</p>
                  <p className="font-semibold text-green-700">1,247 Tilapia</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="font-semibold text-green-700">KSh 45,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Credit */}
      <div className="text-center text-gray-400 text-sm py-6">
        Designed for Aora Aquaculture 
      </div>
    </div>
  );
}

export default LandingPage;