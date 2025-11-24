import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";

type VerifyOtpForm = {
  otp: string;
};

export const ForgotPasswordPage = () => {
  const { forgotPassword, verifyOtp } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOtpForm>();

  const onSendOtp = async () => {
    try {
      setIsLoading(true);
      await forgotPassword(); // no employeeId needed
      setOtpSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: VerifyOtpForm) => {
    try {
      setIsLoading(true);
      await verifyOtp(data.otp); // backend knows it’s admin
      // Redirect handled by AuthContext after login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        {!otpSent ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Click the button below to send an OTP to the admin email.
            </p>
            <button
              onClick={onSendOtp}
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 rounded disabled:opacity-70"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <h2 className="text-xl font-bold">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp", { required: "OTP is required" })}
              className="w-full border rounded p-2"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 rounded disabled:opacity-70"
            >
              {isLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            <p className="text-sm text-gray-500 mt-2">
              OTP sent to admin email. Didn’t receive? Try again after 30s.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
