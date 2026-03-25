import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            TodoApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {token ? (
              <>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}

            
          </div>
        </div> 
      </div>    
    </nav>
  );
}
