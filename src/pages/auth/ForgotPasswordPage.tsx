import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";

type VerifyOtpForm = {
  otp: string;
};

export const ForgotPasswordPage = () => {
  const { forgotPassword, verifyOtp } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOtpForm>();

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSendOtp = async () => {
    try {
      setIsLoading(true);
      setResendMessage("");
      await forgotPassword();
      setOtpSent(true);
      setResendCooldown(30);
      setResendMessage("OTP sent successfully!");
      setTimeout(() => setResendMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      setIsLoading(true);
      setResendMessage("");
      await forgotPassword();
      setResendCooldown(30);
      setResendMessage("OTP resent successfully!");
      setTimeout(() => setResendMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: VerifyOtpForm) => {
    try {
      setIsLoading(true);
      await verifyOtp(data.otp);
      // Redirect handled by AuthContext after login
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSend = () => {
    setOtpSent(false);
    setResendCooldown(0);
    setResendMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        {!otpSent ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Click the button below to send an OTP to the admin email.
            </p>
            <button
              onClick={onSendOtp}
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
            <p className="text-sm text-gray-600">
              OTP has been sent to the admin email.
            </p>
            
            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                {resendMessage}
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                {...register("otp", { 
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must be 6 digits"
                  }
                })}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onResendOtp}
                disabled={isLoading || resendCooldown > 0}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend OTP in ${resendCooldown}s` 
                  : "Resend OTP"}
              </button>
              
              <button
                type="button"
                onClick={handleBackToSend}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};