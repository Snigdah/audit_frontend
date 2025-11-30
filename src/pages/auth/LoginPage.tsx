import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { InputField } from "../../components/common/InputField";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

type LoginFormData = {
  employeeId: string;
  password: string;
};

export const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.employeeId, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden flex items-center justify-center px-4">

      {/* Subtle gradient glowing balls */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-72 h-72 bg-white/5 blur-3xl rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md bg-gray-800/60 backdrop-blur-xl border border-white/10 shadow-xl p-10 rounded-3xl"
      >
        {/* Live Clock */}
        {/* <motion.h1
          className="text-center text-4xl font-bold mb-6 tracking-wide"
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.1)",
              "0 0 25px rgba(255,255,255,0.2)",
              "0 0 10px rgba(255,255,255,0.1)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {formatTime(currentTime)}
        </motion.h1> */}

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Sign in to access ERP System
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="employeeId"
            label="Employee ID"
            placeholder="Enter your ID"
            register={register}
            error={errors.employeeId}
            registerOptions={{
              required: "Employee ID is required",
            }}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            registerOptions={{
              required: "Password is required",
            }}
          />

          {/* Actions */}
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div>
              <input
                type="checkbox"
                className="mr-2"
              />
              Remember me
            </div>

            <Link to="/forgot-password" className="hover:text-white">
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-xl bg-white text-gray-900 hover:bg-gray-200 transition shadow-lg ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} ERP System
        </p>
      </motion.div>
    </div>
  );
};
