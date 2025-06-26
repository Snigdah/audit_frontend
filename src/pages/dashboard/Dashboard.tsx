import React from "react";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Welcome to the ERP Dashboard!
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Here you can access all of your modules, track your tasks, and
            manage your work efficiently.
          </p>

          <div className="mt-6">
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Explore Modules
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Manage Users",
            description: "Add, edit, or remove user accounts.",
            icon: "👤",
          },
          {
            title: "View Reports",
            description: "Check real-time performance and summaries.",
            icon: "📊",
          },
          {
            title: "Access Modules",
            description: "Quickly jump into your assigned modules.",
            icon: "📁",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-200 cursor-pointer"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Helpful Info Section */}
      <div className="mt-16 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h3>
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          If you encounter any issues or need assistance using the ERP system,
          please contact the IT department or refer to the user manual provided
          in the Help section.
        </p>
        <a
          href="#"
          className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
        >
          Go to Help Center
        </a>
      </div>

      <div className="mt-12 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Healthcare Pharmaceuticals. All rights
        reserved.
      </div>
    </div>
  );
};

export default Dashboard;
