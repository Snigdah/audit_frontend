import { useForm } from "react-hook-form";
import { InputField } from "../../components/common/InputField";
import { useAuth } from "../../context/AuthContext";

type LoginFormData = {
  employeeId: string;
  password: string;
};

export const LoginPage = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    try {
      login(data.employeeId, data.password); // ⬅ This handles token, authState, and redirect
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            ERP Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the system
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              name="employeeId"
              label="Employee ID"
              type="text"
              placeholder="Enter your employee ID"
              register={register}
              error={errors.employeeId}
              required
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
              required
              registerOptions={{
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 8 characters",
                },
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-gray-800 hover:text-gray-600"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Healthcare Pharmaceuticals. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
