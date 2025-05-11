import { FaUser, FaBell, FaCog } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Healthcare Pharmaceuticals
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <FaBell className="h-5 w-5" />
              </button>

              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none ml-3">
                <FaCog className="h-5 w-5" />
              </button>

              <div className="ml-3 relative">
                <div>
                  <button className="flex text-sm rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:hidden">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
              <FaUser className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
