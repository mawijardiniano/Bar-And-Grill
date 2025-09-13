import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar (burger only, top-left) */}
      <div className="md:hidden bg-gray-800 text-white p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col transform md:translate-x-0 transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Title (desktop only) */}
        <div className="p-4 text-2xl font-bold border-b border-gray-700 hidden md:block">
          POS System
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Point of Sales
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Sales Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                className="block px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Menu Management
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
