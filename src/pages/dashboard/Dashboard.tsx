import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">

      {/* Subtle Gradient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 blur-3xl rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: "-40vh",
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Live Clock */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-14"
        >
          <div className="bg-gray-800/40 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-10 text-center w-full max-w-xl">
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-3 tracking-wider"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.15)",
                  "0 0 40px rgba(255,255,255,0.25)",
                  "0 0 20px rgba(255,255,255,0.15)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {formatTime(currentTime)}
            </motion.h1>

            <p className="text-lg md:text-xl text-white/60 tracking-wide">
              {formatDate(currentTime)}
            </p>
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-800/40 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-10 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            Welcome to ERP System
          </h2>

          <p className="text-center text-xl text-white/70 mb-10">
            Streamline operations with a fast, secure & modern enterprise platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 border border-white/40 text-white rounded-xl shadow-md hover:bg-white/10 transition"
            >
              Explore Features
            </motion.button>
          </div>
        </motion.div>

        {/* Clean Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Performance",
              desc: "Optimized and scalable architecture.",
            },
            {
              title: "Security",
              desc: "Reliable authentication & access controls.",
            },
            {
              title: "Insights",
              desc: "Clear visualization for key metrics.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.2 }}
              whileHover={{ scale: 1.04 }}
              className="bg-gray-800/50 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:border-white/20 transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/40 text-sm">
          © {new Date().getFullYear()} Enterprise Resource Planning System
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
